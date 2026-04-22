import { useState } from "react"
import { LinkBioPage } from "./pages/LinkBioPage"
import { RafflePage } from "./pages/RafflePage"

type Page = "home" | "raffle"

function App() {
  const [page, setPage] = useState<Page>("home")

  if (page === "raffle") {
    return <RafflePage onBack={() => setPage("home")} />
  }

  return <LinkBioPage onRaffle={() => setPage("raffle")} />
}

export default App
