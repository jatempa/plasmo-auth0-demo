import { type FC } from "react"

import SidePanelView from "@/views/sidepanel/SidePanelView"

import "@/styles/tailwind.css"
import DefaultLayout from "./views/sidepanel/layouts/DefaultLayout"

const SidePanel: FC = () => {
  return (
    <DefaultLayout>
      <SidePanelView />
    </DefaultLayout>
  )
}

export default SidePanel
