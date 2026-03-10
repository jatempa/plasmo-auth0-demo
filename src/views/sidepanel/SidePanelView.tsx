import LoadingCard from "./components/LoadingCard"
import SignInCard from "./components/SignInCard"
import WelcomeCard from "./components/WelcomeCard"
import { useAuth } from "./hooks/useAuth"

function SidePanelView() {
  const { isLoading, error, isAuthenticated, user, onLogin, onLogout } =
    useAuth()

  if (isLoading) {
    return <LoadingCard />
  }
  if (!isLoading && !isAuthenticated) {
    return <SignInCard error={error} onLogin={onLogin} />
  }

  return <WelcomeCard user={user} error={error} onLogout={onLogout} />
}

export default SidePanelView
