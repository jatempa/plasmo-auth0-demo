import { useEffect, useState } from "react"

import {
  requestAuthLogin,
  requestAuthLogout,
  requestAuthSession
} from "@/services/runtime-auth-client"
import {
  getAuthSession,
  watchAuthSession
} from "@/services/auth-session-storage"
import type { SidePanelViewModel, User } from "@/viewmodels/sidepanel/types"

const defaultUser: User = {
  displayName: "User",
  email: "",
  picture: ""
}

export const useSidePanelViewModel = (): SidePanelViewModel => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User>(defaultUser)

  const applySession = (session?: {
    isAuthenticated?: boolean
    user?: { name?: string; email?: string; picture?: string }
  }) => {
    if (session?.isAuthenticated) {
      setIsAuthenticated(true)
      setUser({
        displayName: session.user?.name || "User",
        email: session.user?.email || "",
        picture: session.user?.picture || ""
      })
      return
    }

    setIsAuthenticated(false)
    setUser(defaultUser)
  }

  useEffect(() => {
    let isMounted = true

    const syncFromStorage = async () => {
      const session = await getAuthSession()
      if (!isMounted) {
        return
      }

      applySession(session)
      setIsLoading(false)
    }

    const unwatch = watchAuthSession(() => {
      void syncFromStorage()
    })

    ;(async () => {
      try {
        const response = await requestAuthSession()
        if (!isMounted) {
          return
        }

        if (!response.ok) {
          setError("error" in response ? response.error : "Could not load session.")
          setIsLoading(false)
          return
        }

        applySession(response.session)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setError(error instanceof Error ? error.message : "Could not load session.")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      isMounted = false
      unwatch()
    }
  }, [])

  const onLogin = () => {
    setError("")
    setIsLoading(true)

    ;(async () => {
      try {
        const response = await requestAuthLogin()
        if (!response.ok) {
          setError("error" in response ? response.error : "Auth0 login failed.")
          setIsLoading(false)
          return
        }

        applySession(response.session)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Auth0 login failed.")
      } finally {
        setIsLoading(false)
      }
    })()
  }

  const onLogout = () => {
    setError("")
    setIsLoading(true)

    ;(async () => {
      try {
        const response = await requestAuthLogout()
        if (!response.ok) {
          setError("error" in response ? response.error : "Auth0 logout failed.")
          setIsLoading(false)
          return
        }

        applySession()
      } catch (error) {
        setError(error instanceof Error ? error.message : "Auth0 logout failed.")
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return {
    isLoading,
    error,
    isAuthenticated,
    user,
    onLogin,
    onLogout
  }
}
