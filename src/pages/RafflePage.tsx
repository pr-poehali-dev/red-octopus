import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trophy, Plus, Trash2, Play, Settings, RotateCcw } from "lucide-react"
import { FortuneWheel, type Prize } from "@/components/FortuneWheel"

interface RafflePageProps {
  onBack: () => void
}

const DEFAULT_PRIZES: Prize[] = [
  { id: "1", label: "Скидка 3% на маникюр", color: "#f472b6", weight: 30 },
  { id: "2", label: "Скидка 4% на маникюр", color: "#e879f9", weight: 25 },
  { id: "3", label: "Скидка 2% на маникюр", color: "#c084fc", weight: 35 },
  { id: "4", label: "Скидка 5% на маникюр", color: "#fb7185", weight: 20 },
  { id: "5", label: "Скидка 80% на маникюр", color: "#f9a8d4", weight: 5 },
  { id: "6", label: "Скидка 60% на массаж", color: "#d946ef", weight: 5 },
  { id: "7", label: "Окрашивание бесплатно", color: "#a78bfa", weight: 2 },
]

export function RafflePage({ onBack }: RafflePageProps) {
  const [prizes, setPrizes] = useState<Prize[]>(DEFAULT_PRIZES)
  const [tab, setTab] = useState<"raffle" | "prizes">("raffle")
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<Prize | null>(null)
  const [showWinner, setShowWinner] = useState(false)
  const [newLabel, setNewLabel] = useState("")
  const [newWeight, setNewWeight] = useState("10")
  const rotationRef = useRef(0)

  const spin = () => {
    if (isSpinning || prizes.length < 2) return
    setWinner(null)
    setShowWinner(false)
    setIsSpinning(true)

    const total = prizes.reduce((s, p) => s + p.weight, 0)

    // Pick winner by weight
    let rand = Math.random() * total
    let chosen = prizes[prizes.length - 1]
    for (const p of prizes) {
      rand -= p.weight
      if (rand <= 0) { chosen = p; break }
    }

    // Calculate target angle so chosen sector is under pointer (top = 270deg)
    const totalW = prizes.reduce((s, p) => s + p.weight, 0)
    let angleStart = 0
    for (const p of prizes) {
      if (p.id === chosen.id) break
      angleStart += (p.weight / totalW) * 360
    }
    const sectorAngle = (chosen.weight / totalW) * 360
    const targetSectorMid = angleStart + sectorAngle / 2

    // Pointer is at top (270deg in canvas = 0deg in CSS rotation)
    // We need sector mid at 270deg (top) relative to canvas
    // canvas starts at right (0deg). Top = -90deg = 270deg
    const pointerAt = 270
    const neededRotation = (pointerAt - targetSectorMid + 360) % 360

    // Add multiple full spins for drama
    const spins = 5 + Math.floor(Math.random() * 3)
    const finalRotation = rotationRef.current + spins * 360 + neededRotation - (rotationRef.current % 360)

    rotationRef.current = finalRotation
    setRotation(finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setWinner(chosen)
      setTimeout(() => setShowWinner(true), 200)
    }, 4200)
  }

  const reset = () => {
    setWinner(null)
    setShowWinner(false)
  }

  const addPrize = () => {
    const label = newLabel.trim()
    const weight = parseInt(newWeight) || 10
    if (!label) return
    setPrizes(prev => [...prev, { id: Date.now().toString(), label, color: "#f472b6", weight }])
    setNewLabel("")
    setNewWeight("10")
  }

  const removePrize = (id: string) => {
    setPrizes(prev => prev.filter(p => p.id !== id))
  }

  const updateWeight = (id: string, val: string) => {
    const n = parseInt(val)
    if (isNaN(n) || n < 1) return
    setPrizes(prev => prev.map(p => p.id === id ? { ...p, weight: n } : p))
  }

  return (
    <main className="relative min-h-screen px-4 py-6 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50" />
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.3) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(232,121,249,0.25) 0%, transparent 70%)", filter: "blur(80px)", bottom: "-10%", right: "-20%" }}
        animate={{ x: [0, -80, -40, 0], y: [0, -60, 40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-[400px] w-full flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <motion.button onClick={onBack} whileTap={{ scale: 0.92 }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-rose-500"
            style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.2)" }}>
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-rose-800 leading-tight">Колесо фортуны</h1>
            <p className="text-xs text-fuchsia-400">Салон красоты КУТЮР</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 p-1 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.15)" }}>
          {([
            ["raffle", <Trophy key="t" className="h-4 w-4" />, "Розыгрыш"],
            ["prizes", <Settings key="s" className="h-4 w-4" />, "Призы"],
          ] as const).map(([key, icon, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all"
              style={tab === key ? { background: "rgba(244,114,182,0.15)", color: "#be185d" } : { color: "#9ca3af" }}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* RAFFLE TAB */}
        {tab === "raffle" && (
          <div className="flex flex-col items-center gap-5">

            {/* Wheel */}
            <div className="flex items-center justify-center w-full py-2">
              <FortuneWheel prizes={prizes} rotation={rotation} isSpinning={isSpinning} />
            </div>

            {/* Winner */}
            <AnimatePresence>
              {showWinner && winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.75, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.75 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="w-full rounded-2xl px-5 py-4 text-center"
                  style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(244,114,182,0.2))", border: "1.5px solid rgba(251,191,36,0.5)", backdropFilter: "blur(16px)" }}
                >
                  <p className="text-xs text-amber-600 font-semibold mb-1 tracking-wide uppercase">🎉 Ваш приз</p>
                  <p className="text-xl font-bold text-rose-800 leading-snug">{winner.label}</p>
                  <p className="text-xs text-fuchsia-400 mt-1">Поздравляем! Покажите экран администратору</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="w-full flex gap-3">
              {!winner ? (
                <motion.button onClick={spin} disabled={isSpinning || prizes.length < 2}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm disabled:opacity-50"
                  style={{ background: isSpinning ? "rgba(244,114,182,0.5)" : "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 4px 20px rgba(244,114,182,0.4)" }}>
                  <Play className="h-5 w-5" />
                  {isSpinning ? "Крутится..." : "Крутить колесо!"}
                </motion.button>
              ) : (
                <motion.button onClick={reset} whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-rose-600 font-semibold text-sm"
                  style={{ background: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(244,114,182,0.3)" }}>
                  <RotateCcw className="h-4 w-4" />
                  Крутить снова
                </motion.button>
              )}
            </div>

            {/* Prizes legend */}
            <div className="w-full rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.6)" }}>
              <p className="text-xs font-semibold text-rose-700 mb-1">Призы сегодня:</p>
              {prizes.map((p, i) => {
                const total = prizes.reduce((s, x) => s + x.weight, 0)
                const pct = Math.round((p.weight / total) * 100)
                const COLORS = ["#f472b6","#e879f9","#c084fc","#fb7185","#f9a8d4","#d946ef","#a78bfa","#f43f5e"]
                return (
                  <div key={p.id} className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-rose-800 flex-1 truncate">{p.label}</span>
                    <span className="text-[10px] text-fuchsia-400 font-medium">{pct}%</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PRIZES TAB */}
        {tab === "prizes" && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-rose-400 px-1">Настройте призы и их шансы выпадения</p>

            {/* Add form */}
            <div className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.15)" }}>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addPrize()}
                placeholder="Название приза..."
                className="w-full px-4 py-3 rounded-xl text-sm text-rose-800 placeholder-rose-300 outline-none"
                style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(244,114,182,0.2)" }} />
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <label className="text-[10px] text-rose-400 mb-1 block">Шанс (вес, чем больше — тем чаще)</label>
                  <input value={newWeight} onChange={e => setNewWeight(e.target.value)} type="number" min="1" max="1000"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-rose-800 outline-none"
                    style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(244,114,182,0.2)" }} />
                </div>
                <motion.button onClick={addPrize} whileTap={{ scale: 0.92 }}
                  className="h-11 w-11 flex items-center justify-center rounded-xl text-white mt-5"
                  style={{ background: "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 4px 12px rgba(244,114,182,0.35)" }}>
                  <Plus className="h-5 w-5" />
                </motion.button>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {prizes.map((p, i) => {
                  const total = prizes.reduce((s, x) => s + x.weight, 0)
                  const pct = Math.round((p.weight / total) * 100)
                  const COLORS = ["#f472b6","#e879f9","#c084fc","#fb7185","#f9a8d4","#d946ef","#a78bfa","#f43f5e"]
                  return (
                    <motion.div key={p.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.6)" }}>
                      <div className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: COLORS[i % COLORS.length] }}>
                        {pct}%
                      </div>
                      <span className="flex-1 text-sm font-medium text-rose-800 leading-tight">{p.label}</span>
                      <input value={p.weight} onChange={e => updateWeight(p.id, e.target.value)} type="number" min="1"
                        className="w-14 px-2 py-1.5 rounded-lg text-xs text-rose-700 text-center outline-none"
                        style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(244,114,182,0.2)" }} />
                      <motion.button onClick={() => removePrize(p.id)} whileTap={{ scale: 0.85 }}
                        className="h-7 w-7 flex items-center justify-center rounded-lg text-rose-300 hover:text-rose-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <p className="text-[10px] text-rose-300 text-center px-4">
              Вес определяет шанс: вес 5 выпадет в 5 раз реже, чем вес 25
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
