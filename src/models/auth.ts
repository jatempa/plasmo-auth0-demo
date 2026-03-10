export const AUTH0_GET_SESSION = "AUTH0_GET_SESSION"
export const AUTH0_LOGIN = "AUTH0_LOGIN"
export const AUTH0_LOGOUT = "AUTH0_LOGOUT"

export type AuthSession = {
  isAuthenticated: boolean
  user?: {
    name?: string
    email?: string
    sub?: string
    picture?: string
  }
  idToken?: string
  accessToken?: string
}

export type Auth0UserInfo = {
  sub?: string
  name?: string
  email?: string
  picture?: string
}

export type AuthGetSessionMessage = { type: typeof AUTH0_GET_SESSION }
export type AuthLoginMessage = { type: typeof AUTH0_LOGIN }
export type AuthLogoutMessage = { type: typeof AUTH0_LOGOUT }

export type AuthMessage =
  | AuthGetSessionMessage
  | AuthLoginMessage
  | AuthLogoutMessage

type AuthOkResponse = { ok: true }
type AuthErrorResponse = { ok: false; error: string }

export type AuthGetSessionResponse =
  | (AuthOkResponse & { session: AuthSession })
  | AuthErrorResponse

export type AuthLoginResponse =
  | (AuthOkResponse & { session: AuthSession })
  | AuthErrorResponse

export type AuthLogoutResponse = AuthOkResponse | AuthErrorResponse
