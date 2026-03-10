import type { Auth0UserInfo, AuthSession } from "~src/models/auth"
import {
  clearAuthSession,
  setAuthSession
} from "~src/services/auth-session-storage"

const AUTH0_DOMAIN = process.env.PLASMO_PUBLIC_AUTH0_DOMAIN
const AUTH0_CLIENT_ID = process.env.PLASMO_PUBLIC_AUTH0_CLIENT_ID
const AUTH0_AUDIENCE = process.env.PLASMO_PUBLIC_AUTH0_AUDIENCE

const assertAuthConfig = () => {
  if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
    throw new Error(
      "Missing Auth0 config. Set PLASMO_PUBLIC_AUTH0_DOMAIN and PLASMO_PUBLIC_AUTH0_CLIENT_ID in .env."
    )
  }
}

const toBase64Url = (buffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

const randomString = (length = 64) => {
  const randomBytes = new Uint8Array(length)
  crypto.getRandomValues(randomBytes)
  return Array.from(randomBytes, (byte) =>
    ("0" + (byte % 36).toString(36)).slice(-1)
  ).join("")
}

const sha256 = async (value: string) => {
  const data = new TextEncoder().encode(value)
  return crypto.subtle.digest("SHA-256", data)
}

const parseJwtPayload = (token: string) => {
  const payload = token.split(".")[1]
  if (!payload) {
    return {}
  }

  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  return JSON.parse(atob(padded)) as Record<string, string>
}

const launchWebAuthFlow = async (url: string, interactive: boolean) => {
  const redirectedTo = await chrome.identity.launchWebAuthFlow({
    url,
    interactive
  })

  if (!redirectedTo) {
    throw new Error("Auth flow did not return a redirect URL.")
  }

  return redirectedTo
}

const fetchAuth0UserInfo = async (accessToken: string): Promise<Auth0UserInfo> => {
  assertAuthConfig()

  const userInfoResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (!userInfoResponse.ok) {
    const errorText = await userInfoResponse.text()
    throw new Error(`Failed to fetch Auth0 userinfo: ${errorText}`)
  }

  return (await userInfoResponse.json()) as Auth0UserInfo
}

export const loginWithAuth0 = async (): Promise<AuthSession> => {
  assertAuthConfig()

  const redirectUri = chrome.identity.getRedirectURL("auth0")
  const state = randomString(32)
  const codeVerifier = randomString(64)
  const challenge = toBase64Url(await sha256(codeVerifier))
  const scope = "openid profile email"

  const authorizeUrl = new URL(`https://${AUTH0_DOMAIN}/authorize`)
  authorizeUrl.searchParams.set("response_type", "code")
  authorizeUrl.searchParams.set("client_id", AUTH0_CLIENT_ID)
  authorizeUrl.searchParams.set("redirect_uri", redirectUri)
  authorizeUrl.searchParams.set("scope", scope)
  authorizeUrl.searchParams.set("state", state)
  authorizeUrl.searchParams.set("code_challenge", challenge)
  authorizeUrl.searchParams.set("code_challenge_method", "S256")
  if (AUTH0_AUDIENCE) {
    authorizeUrl.searchParams.set("audience", AUTH0_AUDIENCE)
  }

  const callbackUrl = new URL(await launchWebAuthFlow(authorizeUrl.toString(), true))
  const code = callbackUrl.searchParams.get("code")
  const returnedState = callbackUrl.searchParams.get("state")
  const authError = callbackUrl.searchParams.get("error")
  const authErrorDescription = callbackUrl.searchParams.get("error_description")

  if (authError) {
    throw new Error(authErrorDescription || authError)
  }
  if (!code) {
    throw new Error("Auth code missing from callback URL.")
  }
  if (returnedState !== state) {
    throw new Error("Auth state mismatch. Please retry.")
  }

  const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: AUTH0_CLIENT_ID,
      code_verifier: codeVerifier,
      code,
      redirect_uri: redirectUri
    })
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    throw new Error(`Token exchange failed: ${errorText}`)
  }

  const tokenData = (await tokenResponse.json()) as {
    id_token?: string
    access_token?: string
  }

  if (!tokenData.id_token) {
    throw new Error("Auth0 did not return an ID token.")
  }

  const payload = parseJwtPayload(tokenData.id_token)
  let userInfo: Auth0UserInfo = {}

  if (tokenData.access_token) {
    userInfo = await fetchAuth0UserInfo(tokenData.access_token)
  }

  const session: AuthSession = {
    isAuthenticated: true,
    user: {
      name: userInfo.name || payload.name,
      email: userInfo.email || payload.email,
      sub: userInfo.sub || payload.sub,
      picture: userInfo.picture || payload.picture
    },
    idToken: tokenData.id_token,
    accessToken: tokenData.access_token
  }

  await setAuthSession(session)
  return session
}

export const logoutFromAuth0 = async () => {
  assertAuthConfig()

  const redirectUri = chrome.identity.getRedirectURL("auth0-logout")
  const logoutUrl = new URL(`https://${AUTH0_DOMAIN}/v2/logout`)
  logoutUrl.searchParams.set("client_id", AUTH0_CLIENT_ID)
  logoutUrl.searchParams.set("returnTo", redirectUri)

  await launchWebAuthFlow(logoutUrl.toString(), true)
  await clearAuthSession()
}
