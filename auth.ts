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

const sendMessage = <TResponse>(message: AuthMessage): Promise<TResponse> =>
  new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response: TResponse) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
        return
      }
      resolve(response)
    })
  })

export const requestAuthSession = () =>
  sendMessage<AuthGetSessionResponse>({ type: AUTH0_GET_SESSION })

export const requestAuthLogin = () =>
  sendMessage<AuthLoginResponse>({ type: AUTH0_LOGIN })

export const requestAuthLogout = () =>
  sendMessage<AuthLogoutResponse>({ type: AUTH0_LOGOUT })
