import { type CSSProperties, useEffect, useState } from "react"
import {
  requestAuthLogin,
  requestAuthLogout,
  requestAuthSession
} from "~auth"

const containerStyle: CSSProperties = {
  padding: 20,
  fontFamily: "Arial, sans-serif",
  color: "#111827"
}

const cardStyle: CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 16,
  background: "#ffffff"
}

const buttonStyle: CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "none",
  borderRadius: 8,
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer"
}

function SidePanel() {
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
    <main style={containerStyle}>
      {isLoading ? (
        <section style={cardStyle}>
          <p style={{ margin: 0, color: "#6b7280" }}>Loading...</p>
        </section>
      ) : null}

      {!isAuthenticated && !isLoading ? (
        <section style={cardStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Sign in with Auth0</h2>
          <p style={{ marginTop: 0, marginBottom: 16, color: "#6b7280" }}>
            Continue with your Auth0 account.
          </p>
          {error ? (
            <p style={{ marginTop: 0, marginBottom: 12, color: "#dc2626" }}>
              {error}
            </p>
          ) : null}
          <button onClick={onLogin} style={buttonStyle} type="button">
            Sign In
          </button>
        </section>
      ) : null}

      {isAuthenticated && !isLoading ? (
        <section
          style={{
            ...cardStyle,
            textAlign: "center"
          }}>
          {picture ? (
            <img
              alt={`${displayName} profile`}
              src={picture}
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                margin: "0 auto 12px",
                border: "1px solid #e5e7eb"
              }}
            />
          ) : null}
          <h2 style={{ marginTop: 0, marginBottom: 8 }}>Welcome, {displayName}!</h2>
          <p style={{ marginTop: 0, marginBottom: 16, color: "#374151" }}>
            You are signed in with Auth0.
          </p>
          {email ? (
            <p style={{ marginTop: 0, marginBottom: 16, color: "#6b7280" }}>
              {email}
            </p>
          ) : null}
          {error ? (
            <p style={{ marginTop: 0, marginBottom: 12, color: "#dc2626" }}>
              {error}
            </p>
          ) : null}
          <button
            onClick={onLogout}
            style={{
              ...buttonStyle,
              width: "auto",
              minWidth: 120,
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #d1d5db",
              display: "block",
              margin: "0 auto"
            }}
            type="button">
            Log Out
          </button>
        </section>
      ) : null}
    </main>
  )
}

export default SidePanel
