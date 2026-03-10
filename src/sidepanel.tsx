import { type FC } from "react"

import SidePanelView from "~src/views/sidepanel/SidePanelView"

import "~src/styles/tailwind.css"
import DefaultLayout from "./views/sidepanel/layouts/DefaultLayout"

const SidePanel: FC = () => {
  return (
    <DefaultLayout>
      <SidePanelView />
    </DefaultLayout>
  )
}

export default SidePanel
