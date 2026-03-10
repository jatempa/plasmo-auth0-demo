import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const ROOT_ID = "my-extension-sidepanel-root"

const createPanel = () => {
  if (document.getElementById(ROOT_ID)) {
    return
  }

  const root = document.createElement("div")
  root.id = ROOT_ID
  root.style.position = "fixed"
  root.style.top = "16px"
  root.style.right = "16px"
  root.style.zIndex = "2147483647"
  root.style.fontFamily = "Arial, sans-serif"

  const pinButton = document.createElement("button")
  pinButton.type = "button"
  pinButton.textContent = "Pin"
  pinButton.setAttribute("aria-label", "Open side panel")
  pinButton.style.width = "44px"
  pinButton.style.height = "44px"
  pinButton.style.border = "none"
  pinButton.style.borderRadius = "50%"
  pinButton.style.cursor = "pointer"
  pinButton.style.background = "#2563eb"
  pinButton.style.color = "#fff"
  pinButton.style.fontWeight = "700"
  pinButton.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)"

  const panel = document.createElement("aside")
  panel.setAttribute("aria-hidden", "true")
  panel.style.position = "fixed"
  panel.style.top = "0"
  panel.style.right = "0"
  panel.style.height = "100vh"
  panel.style.width = "340px"
  panel.style.background = "#ffffff"
  panel.style.boxShadow = "-8px 0 20px rgba(0, 0, 0, 0.2)"
  panel.style.borderLeft = "1px solid #e5e7eb"
  panel.style.transform = "translateX(110%)"
  panel.style.transition = "transform 0.2s ease"
  panel.style.padding = "20px"
  panel.style.boxSizing = "border-box"
  panel.style.color = "#111827"
  panel.style.overflowY = "auto"

  const header = document.createElement("h2")
  header.textContent = "Sign In"
  header.style.marginTop = "0"
  header.style.marginBottom = "12px"
  header.style.fontSize = "20px"

  const help = document.createElement("p")
  help.textContent = "Use admin/admin to sign in."
  help.style.marginTop = "0"
  help.style.marginBottom = "16px"
  help.style.fontSize = "13px"
  help.style.color = "#6b7280"

  const form = document.createElement("form")
  form.style.display = "grid"
  form.style.gap = "12px"

  const username = document.createElement("input")
  username.type = "text"
  username.placeholder = "Username"
  username.required = true
  username.style.padding = "10px 12px"
  username.style.border = "1px solid #d1d5db"
  username.style.borderRadius = "8px"
  username.style.fontSize = "14px"

  const password = document.createElement("input")
  password.type = "password"
  password.placeholder = "Password"
  password.required = true
  password.style.padding = "10px 12px"
  password.style.border = "1px solid #d1d5db"
  password.style.borderRadius = "8px"
  password.style.fontSize = "14px"

  const status = document.createElement("p")
  status.style.margin = "0"
  status.style.fontSize = "13px"
  status.style.color = "#dc2626"
  status.style.minHeight = "20px"

  const submit = document.createElement("button")
  submit.type = "submit"
  submit.textContent = "Sign In"
  submit.style.padding = "10px 12px"
  submit.style.border = "none"
  submit.style.borderRadius = "8px"
  submit.style.background = "#2563eb"
  submit.style.color = "#ffffff"
  submit.style.fontWeight = "600"
  submit.style.cursor = "pointer"

  const welcomeView = document.createElement("div")
  welcomeView.style.display = "none"

  const welcomeTitle = document.createElement("h2")
  welcomeTitle.textContent = "Welcome, admin!"
  welcomeTitle.style.marginTop = "0"
  welcomeTitle.style.marginBottom = "10px"

  const welcomeText = document.createElement("p")
  welcomeText.textContent =
    "You are signed in. This is your side panel welcome content."
  welcomeText.style.marginTop = "0"
  welcomeText.style.lineHeight = "1.45"
  welcomeText.style.color = "#374151"

  const logout = document.createElement("button")
  logout.type = "button"
  logout.textContent = "Log Out"
  logout.style.marginTop = "8px"
  logout.style.padding = "10px 12px"
  logout.style.border = "1px solid #d1d5db"
  logout.style.borderRadius = "8px"
  logout.style.background = "#ffffff"
  logout.style.color = "#111827"
  logout.style.fontWeight = "600"
  logout.style.cursor = "pointer"

  welcomeView.append(welcomeTitle, welcomeText, logout)
  form.append(username, password, submit, status)
  panel.append(header, help, form, welcomeView)
  root.append(pinButton, panel)
  document.body.append(root)

  let isOpen = false
  const openPanel = () => {
    isOpen = true
    panel.style.transform = "translateX(0)"
    panel.setAttribute("aria-hidden", "false")
    pinButton.textContent = "Close"
    pinButton.setAttribute("aria-label", "Close side panel")
  }

  const closePanel = () => {
    isOpen = false
    panel.style.transform = "translateX(110%)"
    panel.setAttribute("aria-hidden", "true")
    pinButton.textContent = "Pin"
    pinButton.setAttribute("aria-label", "Open side panel")
  }

  pinButton.addEventListener("click", () => {
    if (isOpen) {
      closePanel()
      return
    }
    openPanel()
  })

  form.addEventListener("submit", (event) => {
    event.preventDefault()

    if (username.value === "admin" && password.value === "admin") {
      status.textContent = ""
      form.style.display = "none"
      help.style.display = "none"
      welcomeView.style.display = "block"
      header.textContent = "Welcome"
      return
    }

    status.textContent = "Invalid credentials. Try admin/admin."
  })

  logout.addEventListener("click", () => {
    username.value = ""
    password.value = ""
    status.textContent = ""
    form.style.display = "grid"
    help.style.display = "block"
    welcomeView.style.display = "none"
    header.textContent = "Sign In"
  })
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", createPanel, { once: true })
} else {
  createPanel()
}
