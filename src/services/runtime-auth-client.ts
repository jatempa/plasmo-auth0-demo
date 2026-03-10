import {
  AUTH0_GET_SESSION,
  AUTH0_LOGIN,
  AUTH0_LOGOUT,
  type AuthGetSessionResponse,
  type AuthLoginResponse,
  type AuthLogoutResponse,
  type AuthMessage
} from "~src/models/auth"

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
