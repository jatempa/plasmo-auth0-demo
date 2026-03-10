import { type ReactNode } from "react"

import { sidepanelClasses as c } from "../sidepanelClasses"

type DefaultLayoutProps = {
  children: ReactNode
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return <main className={c.container}>{children}</main>
}

export default DefaultLayout
