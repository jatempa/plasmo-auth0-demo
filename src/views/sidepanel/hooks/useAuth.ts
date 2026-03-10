import {
  requestAuthLogin,
  requestAuthLogout,
  requestAuthSession
} from "@/services/runtime-auth-client"
import { useEffect, useState } from "react"

export type User = {
  displayName: string
  email: string
  picture: string
}

const defaultUser: User = {
  displayName: "User",
  email: "",
  picture: ""
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User>(defaultUser)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await requestAuthSession()
        if (!response.ok) {
          setError(
            "error" in response ? response.error : "Could not load session."
          )
          setIsLoading(false)
          return
        }

        const session = response.session
        if (session?.isAuthenticated) {
          setIsAuthenticated(true)
          setUser({
            displayName: session?.user?.name || "User",
            email: session?.user?.email || "",
            picture: session?.user?.picture || ""
          })
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Could not load session."
        )
      } finally {
        setIsLoading(false)
      }
    })()
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

        const session = response.session
        setIsAuthenticated(Boolean(session?.isAuthenticated))
        setUser({
          displayName: session?.user?.name || "User",
          email: session?.user?.email || "",
          picture: session?.user?.picture || ""
        })
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
          setError(
            "error" in response ? response.error : "Auth0 logout failed."
          )
          setIsLoading(false)
          return
        }

        setIsAuthenticated(false)
        setUser(defaultUser)
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Auth0 logout failed."
        )
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
