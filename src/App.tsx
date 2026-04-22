import { useState } from "react"
import { LinkBioPage } from "./pages/LinkBioPage"
import { RafflePage } from "./pages/RafflePage"
import { AdminPage } from "./pages/AdminPage"
import { type Prize } from "./components/FortuneWheel"

type Page = "home" | "raffle" | "admin"

const DEFAULT_PRIZES: Prize[] = [
  { id: "1", label: "Скидка 3% на маникюр", color: "#f472b6", weight: 30 },
  { id: "2", label: "Скидка 4% на маникюр", color: "#e879f9", weight: 25 },
  { id: "3", label: "Скидка 2% на маникюр", color: "#c084fc", weight: 30 },
  { id: "4", label: "Скидка 5% на маникюр", color: "#fb7185", weight: 8 },
  { id: "5", label: "Скидка 80% на маникюр", color: "#f9a8d4", weight: 3 },
  { id: "6", label: "Скидка 60% на массаж", color: "#d946ef", weight: 3 },
  { id: "7", label: "Окрашивание бесплатно", color: "#a78bfa", weight: 1 },
]

function App() {
  const [page, setPage] = useState<Page>("home")
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES)

  if (page === "raffle") {
    return <RafflePage prizes={prizes} onBack={() => setPage("home")} />
  }

  if (page === "admin") {
    return (
      <AdminPage
        prizes={prizes}
        onSave={(updated) => setPrizes(updated)}
        onBack={() => setPage("home")}
      />
    )
  }

  return <LinkBioPage onRaffle={() => setPage("raffle")} onAdmin={() => setPage("admin")} />
}

export default App
