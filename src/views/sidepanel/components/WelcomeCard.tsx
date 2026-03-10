import type { User } from "../hooks/useAuth"
import { sidepanelClasses as c } from "../sidepanelClasses"

type WelcomeCardProps = {
  user: User
  error: string
  onLogout: () => void
}

function WelcomeCard({ user, error, onLogout }: WelcomeCardProps) {
  const { displayName, email, picture } = user
  return (
    <section className={`${c.card} ${c.authenticatedCard}`}>
      {picture ? (
        <img
          alt={`${displayName} profile`}
          className={c.avatar}
          src={picture}
        />
      ) : null}
      <h2 className={c.title}>Welcome, {displayName}!</h2>
      <p className={c.body}>You are signed in with Auth0.</p>
      {email ? <p className={c.email}>{email}</p> : null}
      {error ? <p className={c.error}>{error}</p> : null}
      <button className={c.buttonLogout} onClick={onLogout} type="button">
        Log Out
      </button>
    </section>
  )
}

export default WelcomeCard
