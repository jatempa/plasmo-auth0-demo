import { Storage, type StorageCallbackMap } from "@plasmohq/storage"
import type { AuthSession } from "@/models/auth"

const AUTH_STORAGE_KEY = "auth0_session"
const authStorage = new Storage({ area: "local" })

export const setAuthSession = async (session: AuthSession) => {
  await authStorage.set(AUTH_STORAGE_KEY, session)
}

export const getAuthSession = async (): Promise<AuthSession> => {
  const session = await authStorage.get<AuthSession>(AUTH_STORAGE_KEY)
  return session ?? { isAuthenticated: false }
}

export const clearAuthSession = async () => {
  await authStorage.remove(AUTH_STORAGE_KEY)
}

export const watchAuthSession = (onChange: () => void) => {
  const callbackMap: StorageCallbackMap = {
    [AUTH_STORAGE_KEY]: () => {
      onChange()
    }
  }

  authStorage.watch(callbackMap)

  return () => {
    authStorage.unwatch(callbackMap)
  }
}
