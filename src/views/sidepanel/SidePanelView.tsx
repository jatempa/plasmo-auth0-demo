import { useEffect, useState } from "react"

import {
  requestAuthLogin,
  requestAuthLogout,
  requestAuthSession
} from "~src/services/runtime-auth-client"

import LoadingCard from "./components/LoadingCard"
import SignInCard from "./components/SignInCard"
import WelcomeCard from "./components/WelcomeCard"

function SidePanelView() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [displayName, setDisplayName] = useState("User")
  const [email, setEmail] = useState("")
  const [picture, setPicture] = useState("")

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
          setDisplayName(session?.user?.name || "User")
          setEmail(session?.user?.email || "")
          setPicture(session?.user?.picture || "")
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
        setDisplayName(session?.user?.name || "User")
        setEmail(session?.user?.email || "")
        setPicture(session?.user?.picture || "")
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
        setDisplayName("User")
        setEmail("")
        setPicture("")
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Auth0 logout failed."
        )
      } finally {
        setIsLoading(false)
      }
    })()
  }

  if (isLoading) {
    return <LoadingCard />
  }
  if (!isLoading && !isAuthenticated) {
    return <SignInCard error={error} onLogin={onLogin} />
  }

  return (
    <WelcomeCard
      displayName={displayName}
      email={email}
      error={error}
      onLogout={onLogout}
      picture={picture}
    />
  )
}

export default SidePanelView
