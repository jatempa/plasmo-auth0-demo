import { type ReactNode } from "react"

type DefaultLayoutProps = {
  children: ReactNode
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <main className="h-screen flex flex-col items-center justify-center  p-5 font-sans text-gray-900">
      {children}
    </main>
  )
}

export default DefaultLayout
