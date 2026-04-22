import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trophy, Play, RotateCcw } from "lucide-react"
import { FortuneWheel, type Prize } from "@/components/FortuneWheel"

interface RafflePageProps {
  prizes: Prize[]
  onBack: () => void
}

const COLORS = [
  "#f472b6","#e879f9","#c084fc","#fb7185",
  "#f9a8d4","#d946ef","#a78bfa","#f43f5e",
]

export function RafflePage({ prizes, onBack }: RafflePageProps) {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<Prize | null>(null)
  const [showWinner, setShowWinner] = useState(false)
  const rotationRef = useRef(0)

  const spin = () => {
    if (isSpinning || prizes.length < 2) return
    setWinner(null)
    setShowWinner(false)
    setIsSpinning(true)

    const total = prizes.reduce((s, p) => s + p.weight, 0)

    // Победитель выбирается по весу (проценту) — скрытая механика
    let rand = Math.random() * total
    let chosenIndex = prizes.length - 1
    for (let i = 0; i < prizes.length; i++) {
      rand -= prizes[i].weight
      if (rand <= 0) { chosenIndex = i; break }
    }
    const chosen = prizes[chosenIndex]

    // Все сектора визуально одинакового размера
    const sectorAngle = 360 / prizes.length
    const targetSectorMid = chosenIndex * sectorAngle + sectorAngle / 2

    const pointerAt = 270
    const neededRotation = (pointerAt - targetSectorMid + 360) % 360
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
            <h1 className="text-lg font-semibold text-rose-800 leading-tight flex items-center gap-2">
              <Trophy className="h-5 w-5 text-rose-400" />
              Колесо фортуны
            </h1>
            <p className="text-xs text-fuchsia-400">Салон красоты КУТЮР</p>
          </div>
        </div>

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

          {/* Spin button */}
          <div className="w-full">
            {!winner ? (
              <motion.button onClick={spin} disabled={isSpinning || prizes.length < 2}
                whileTap={{ scale: 0.96 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm disabled:opacity-50"
                style={{ background: isSpinning ? "rgba(244,114,182,0.5)" : "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 4px 20px rgba(244,114,182,0.4)" }}>
                <Play className="h-5 w-5" />
                {isSpinning ? "Крутится..." : "Крутить колесо!"}
              </motion.button>
            ) : (
              <motion.button onClick={reset} whileTap={{ scale: 0.96 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-rose-600 font-semibold text-sm"
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
              const pct = (p.weight / total * 100).toFixed(1)
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
      </div>
    </main>
  )
}