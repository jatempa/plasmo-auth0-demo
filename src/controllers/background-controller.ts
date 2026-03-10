import {
  AUTH0_GET_SESSION,
  AUTH0_LOGIN,
  AUTH0_LOGOUT
} from "~src/models/auth"
import { getAuthSession } from "~src/services/auth-session-storage"
import { loginWithAuth0, logoutFromAuth0 } from "~src/services/auth0-service"

const canConfigureSidePanelBehavior = () =>
  Boolean(chrome.sidePanel?.setPanelBehavior)

export const registerBackgroundController = () => {
  chrome.runtime.onInstalled.addListener(() => {
    if (!canConfigureSidePanelBehavior()) {
      return
    }

    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => {
        console.error("Failed to configure side panel behavior:", error)
      })
  })

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    ;(async () => {
      try {
        if (message?.type === AUTH0_GET_SESSION) {
          const session = await getAuthSession()
          sendResponse({ ok: true, session })
          return
        }

        if (message?.type === AUTH0_LOGIN) {
          const session = await loginWithAuth0()
          sendResponse({ ok: true, session })
          return
        }

        if (message?.type === AUTH0_LOGOUT) {
          await logoutFromAuth0()
          sendResponse({ ok: true })
        }
      } catch (error) {
        const messageText =
          error instanceof Error ? error.message : "Unknown background error."
        sendResponse({ ok: false, error: messageText })
      }
    })()

    return true
  })
}
