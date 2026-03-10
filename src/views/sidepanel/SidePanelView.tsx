import { useEffect, useState } from "react"
import {
  requestAuthLogin,
  requestAuthLogout,
  requestAuthSession
} from "~src/services/runtime-auth-client"
import { sidepanelClasses as c } from "./sidepanelClasses"

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
        setError(error instanceof Error ? error.message : "Could not load session.")
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
          setError("error" in response ? response.error : "Auth0 logout failed.")
          setIsLoading(false)
          return
        }

        setIsAuthenticated(false)
        setDisplayName("User")
        setEmail("")
        setPicture("")
      } catch (error) {
        setError(error instanceof Error ? error.message : "Auth0 logout failed.")
      } finally {
        setIsLoading(false)
      }
    })()
  }

  return (
    <main className={c.container}>
      {isLoading ? (
        <section className={c.card}>
          <p className={c.loadingText}>Loading...</p>
        </section>
      ) : null}

      {!isAuthenticated && !isLoading ? (
        <section className={c.card}>
          <h2 className={c.title}>Sign in with Auth0</h2>
          <p className={c.subtitle}>Continue with your Auth0 account.</p>
          {error ? (
            <p className={c.error}>{error}</p>
          ) : null}
          <button className={c.buttonPrimary} onClick={onLogin} type="button">
            Sign In
          </button>
        </section>
      ) : null}

      {isAuthenticated && !isLoading ? (
        <section className={`${c.card} ${c.authenticatedCard}`}>
          {picture ? (
            <img alt={`${displayName} profile`} className={c.avatar} src={picture} />
          ) : null}
          <h2 className={c.title}>Welcome, {displayName}!</h2>
          <p className={c.body}>
            You are signed in with Auth0.
          </p>
          {email ? (
            <p className={c.email}>{email}</p>
          ) : null}
          {error ? <p className={c.error}>{error}</p> : null}
          <button className={c.buttonLogout} onClick={onLogout} type="button">
            Log Out
          </button>
        </section>
      ) : null}
    </main>
  )
}

export default SidePanelView
