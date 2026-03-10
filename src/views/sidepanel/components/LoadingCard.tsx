import { sidepanelClasses as c } from "../sidepanelClasses"

function LoadingCard() {
  return (
    <section className={c.card}>
      <p className={c.loadingText}>Loading...</p>
    </section>
  )
}

export default LoadingCard
