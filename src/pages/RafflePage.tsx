import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Trophy, Plus, Trash2, Play, Sparkles, Users } from "lucide-react"

interface Participant {
  id: string
  name: string
}

interface RafflePageProps {
  onBack: () => void
}

const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: "1", name: "Анна Смирнова" },
  { id: "2", name: "Мария Козлова" },
  { id: "3", name: "Екатерина Иванова" },
  { id: "4", name: "Ольга Петрова" },
  { id: "5", name: "Наталья Сидорова" },
]

export function RafflePage({ onBack }: RafflePageProps) {
  const [participants, setParticipants] = useState<Participant[]>(DEFAULT_PARTICIPANTS)
  const [newName, setNewName] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [winner, setWinner] = useState<Participant | null>(null)
  const [drumItems, setDrumItems] = useState<string[]>([])
  const [drumOffset, setDrumOffset] = useState(0)
  const [showWinner, setShowWinner] = useState(false)
  const [tab, setTab] = useState<"raffle" | "participants">("raffle")
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const addParticipant = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    setParticipants((prev) => [...prev, { id: Date.now().toString(), name: trimmed }])
    setNewName("")
  }

  const removeParticipant = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  const startRaffle = () => {
    if (participants.length < 2) return
    setWinner(null)
    setShowWinner(false)
    setIsSpinning(true)

    const shuffled = [...participants].sort(() => Math.random() - 0.5)
    const winnerPick = shuffled[Math.floor(Math.random() * shuffled.length)]
    const drumList: string[] = []
    for (let i = 0; i < 40; i++) {
      drumList.push(shuffled[i % shuffled.length].name)
    }
    drumList.push(winnerPick.name)
    setDrumItems(drumList)
    setDrumOffset(0)

    let index = 0
    const speed = [80, 80, 100, 120, 150, 200, 250, 300, 380, 480]
    let step = 0

    const tick = () => {
      index++
      setDrumOffset(index * 64)

      if (index >= drumList.length - 1) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setIsSpinning(false)
        setWinner(winnerPick)
        setTimeout(() => setShowWinner(true), 300)
        return
      }

      if (intervalRef.current) clearInterval(intervalRef.current)
      const delay = step < speed.length ? speed[step] : 500
      step++
      intervalRef.current = setTimeout(tick, delay)
    }

    intervalRef.current = setTimeout(tick, 80)
  }

  const reset = () => {
    setWinner(null)
    setShowWinner(false)
    setDrumItems([])
    setDrumOffset(0)
  }

  const ITEM_H = 64

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
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            onClick={onBack}
            whileTap={{ scale: 0.92 }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-rose-500"
            style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.2)" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-rose-800 leading-tight">Розыгрыш призов</h1>
            <p className="text-xs text-fuchsia-400">Салон красоты КУТЮР</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.15)" }}>
          {([["raffle", <Trophy key="t" className="h-4 w-4" />, "Розыгрыш"], ["participants", <Users key="u" className="h-4 w-4" />, "Участники"]] as const).map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all"
              style={tab === key ? { background: "rgba(244,114,182,0.15)", color: "#be185d" } : { color: "#9ca3af" }}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* RAFFLE TAB */}
        {tab === "raffle" && (
          <div className="flex flex-col items-center gap-6">

            {/* Drum */}
            <div className="w-full rounded-3xl overflow-hidden relative"
              style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(40px)", border: "1px solid rgba(244,114,182,0.2)", boxShadow: "0 8px 32px rgba(244,114,182,0.12)" }}>

              {/* Top fade */}
              <div className="absolute inset-x-0 top-0 h-16 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, rgba(255,240,245,0.95), transparent)" }} />
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-16 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(255,240,245,0.95), transparent)" }} />

              {/* Highlight line */}
              <div className="absolute inset-x-0 z-20 pointer-events-none"
                style={{ top: "50%", transform: "translateY(-50%)", height: 64, border: "2px solid rgba(244,114,182,0.4)", borderRadius: 12, margin: "0 12px", background: "rgba(244,114,182,0.06)" }} />

              <div className="h-[192px] overflow-hidden px-4 py-0">
                {drumItems.length > 0 ? (
                  <motion.div
                    animate={{ y: -drumOffset }}
                    transition={{ type: "tween", ease: "linear", duration: 0 }}
                    style={{ paddingTop: 64 }}
                  >
                    {drumItems.map((name, i) => (
                      <div key={i} className="flex items-center justify-center h-16 text-base font-semibold text-rose-700">
                        {name}
                      </div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-1">
                    <Sparkles className="h-8 w-8 text-rose-300" />
                    <p className="text-sm text-rose-400 font-medium">Нажми «Запустить»</p>
                    <p className="text-xs text-rose-300">Участников: {participants.length}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Winner banner */}
            <AnimatePresence>
              {showWinner && winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full rounded-2xl px-5 py-4 text-center"
                  style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(244,114,182,0.2))", border: "1.5px solid rgba(251,191,36,0.4)", backdropFilter: "blur(16px)" }}
                >
                  <p className="text-xs text-amber-600 font-medium mb-1">🎉 Победитель</p>
                  <p className="text-xl font-bold text-rose-800">{winner.name}</p>
                  <p className="text-xs text-fuchsia-400 mt-1">Поздравляем!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons */}
            <div className="w-full flex gap-3">
              {!winner ? (
                <motion.button
                  onClick={startRaffle}
                  disabled={isSpinning || participants.length < 2}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-semibold text-sm disabled:opacity-50"
                  style={{ background: isSpinning ? "rgba(244,114,182,0.6)" : "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 4px 20px rgba(244,114,182,0.4)" }}
                >
                  <Play className="h-4 w-4" />
                  {isSpinning ? "Идёт розыгрыш..." : "Запустить розыгрыш"}
                </motion.button>
              ) : (
                <motion.button
                  onClick={reset}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-rose-600 font-semibold text-sm"
                  style={{ background: "rgba(255,255,255,0.6)", border: "1.5px solid rgba(244,114,182,0.3)" }}
                >
                  <Play className="h-4 w-4" />
                  Новый розыгрыш
                </motion.button>
              )}
            </div>

            {participants.length < 2 && (
              <p className="text-xs text-rose-400 text-center">Добавьте минимум 2 участника во вкладке «Участники»</p>
            )}
          </div>
        )}

        {/* PARTICIPANTS TAB */}
        {tab === "participants" && (
          <div className="flex flex-col gap-3">

            {/* Add form */}
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addParticipant()}
                placeholder="Имя участника..."
                className="flex-1 px-4 py-3 rounded-xl text-sm text-rose-800 placeholder-rose-300 outline-none"
                style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(244,114,182,0.2)", backdropFilter: "blur(16px)" }}
              />
              <motion.button
                onClick={addParticipant}
                whileTap={{ scale: 0.92 }}
                className="h-12 w-12 flex items-center justify-center rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 4px 12px rgba(244,114,182,0.35)" }}
              >
                <Plus className="h-5 w-5" />
              </motion.button>
            </div>

            {/* Count */}
            <p className="text-xs text-rose-400 px-1">Участников: {participants.length}</p>

            {/* List */}
            <div className="flex flex-col gap-2">
              <AnimatePresence>
                {participants.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.5)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.6)" }}
                  >
                    <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-rose-600"
                      style={{ background: "rgba(244,114,182,0.12)" }}>
                      {i + 1}
                    </div>
                    <span className="flex-1 text-sm font-medium text-rose-800">{p.name}</span>
                    <motion.button
                      onClick={() => removeParticipant(p.id)}
                      whileTap={{ scale: 0.85 }}
                      className="h-7 w-7 flex items-center justify-center rounded-lg text-rose-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
