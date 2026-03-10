import { sidepanelClasses as c } from "../sidepanelClasses"

type SignInCardProps = {
  error: string
  onLogin: () => void
}

function SignInCard({ error, onLogin }: SignInCardProps) {
  return (
    <section className={c.card}>
      <h2 className={c.title}>Sign in with Auth0</h2>
      <p className={c.subtitle}>Continue with your Auth0 account.</p>
      {error ? <p className={c.error}>{error}</p> : null}
      <button className={c.buttonPrimary} onClick={onLogin} type="button">
        Sign In
      </button>
    </section>
  )
}

export default SignInCard
