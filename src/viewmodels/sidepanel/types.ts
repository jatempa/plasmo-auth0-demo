export type User = {
  displayName: string
  email: string
  picture: string
}

export type SidePanelViewModel = {
  isLoading: boolean
  error: string
  isAuthenticated: boolean
  user: User
  onLogin: () => void
  onLogout: () => void
}
