import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, Trash2, ShieldCheck, Lock, AlertCircle, GripVertical } from "lucide-react"
import { type Prize } from "@/components/FortuneWheel"

interface AdminPageProps {
  prizes: Prize[]
  onSave: (prizes: Prize[]) => void
  onBack: () => void
}

const ADMIN_PIN = "1234"

const COLORS = [
  "#f472b6", "#e879f9", "#c084fc", "#fb7185",
  "#f9a8d4", "#d946ef", "#a78bfa", "#f43f5e",
  "#fb923c", "#facc15", "#34d399", "#38bdf8",
]

export function AdminPage({ prizes, onSave, onBack }: AdminPageProps) {
  const [pin, setPin] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [pinError, setPinError] = useState(false)
  const [localPrizes, setLocalPrizes] = useState<Prize[]>(prizes)
  const [newLabel, setNewLabel] = useState("")
  const [newPct, setNewPct] = useState("")
  const [saved, setSaved] = useState(false)

  const totalPct = localPrizes.reduce((s, p) => s + p.weight, 0)
  const remaining = 100 - totalPct

  const handlePin = (digit: string) => {
    const next = pin + digit
    setPin(next)
    setPinError(false)
    if (next.length === 4) {
      if (next === ADMIN_PIN) {
        setUnlocked(true)
      } else {
        setPinError(true)
        setTimeout(() => setPin(""), 600)
      }
    }
  }

  const handlePinBack = () => {
    setPin(p => p.slice(0, -1))
    setPinError(false)
  }

  const addPrize = () => {
    const label = newLabel.trim()
    const pct = parseFloat(newPct)
    if (!label || isNaN(pct) || pct <= 0) return
    if (totalPct + pct > 100) return
    const id = Date.now().toString()
    const color = COLORS[localPrizes.length % COLORS.length]
    setLocalPrizes(prev => [...prev, { id, label, color, weight: pct }])
    setNewLabel("")
    setNewPct("")
    setSaved(false)
  }

  const removePrize = (id: string) => {
    setLocalPrizes(prev => prev.filter(p => p.id !== id))
    setSaved(false)
  }

  const updatePct = (id: string, val: string) => {
    const n = parseFloat(val)
    if (isNaN(n) || n < 0) return
    setLocalPrizes(prev => prev.map(p => p.id === id ? { ...p, weight: n } : p))
    setSaved(false)
  }

  const updateLabel = (id: string, val: string) => {
    setLocalPrizes(prev => prev.map(p => p.id === id ? { ...p, label: val } : p))
    setSaved(false)
  }

  const handleSave = () => {
    onSave(localPrizes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isValid = totalPct > 0 && Math.abs(totalPct - 100) < 0.01

  return (
    <main className="relative min-h-screen px-4 py-6 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50" />
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.25) 0%, transparent 70%)", filter: "blur(60px)", top: "-10%", right: "-10%" }}
        animate={{ x: [0, -60, 0], y: [0, 80, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-[400px] w-full flex flex-col flex-1">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button onClick={onBack} whileTap={{ scale: 0.92 }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-rose-500"
            style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.2)" }}>
            <ArrowLeft className="h-5 w-5" />
          </motion.button>
          <div>
            <h1 className="text-lg font-semibold text-rose-800 leading-tight flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-rose-400" />
              Администратор
            </h1>
            <p className="text-xs text-fuchsia-400">Управление призами · КУТЮР</p>
          </div>
        </div>

        {/* PIN screen */}
        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div key="pin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 mt-8"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 8px 24px rgba(244,114,182,0.4)" }}>
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <p className="text-base font-semibold text-rose-800 mt-2">Введите PIN-код</p>
                <p className="text-xs text-rose-400">Для доступа к панели администратора</p>
              </div>

              {/* Dots */}
              <motion.div className="flex gap-4"
                animate={pinError ? { x: [-8, 8, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="h-4 w-4 rounded-full transition-all duration-200"
                    style={{ background: i < pin.length ? (pinError ? "#f43f5e" : "#f472b6") : "rgba(244,114,182,0.2)", boxShadow: i < pin.length ? "0 0 8px rgba(244,114,182,0.5)" : "none" }} />
                ))}
              </motion.div>

              {pinError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" /> Неверный PIN
                </motion.div>
              )}

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
                {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((d, i) => (
                  <motion.button key={i}
                    onClick={() => d === "⌫" ? handlePinBack() : d !== "" ? handlePin(d) : undefined}
                    whileTap={d !== "" ? { scale: 0.88 } : {}}
                    disabled={d === "" || pin.length >= 4}
                    className="h-14 rounded-2xl text-lg font-semibold text-rose-700 disabled:opacity-0 transition-all"
                    style={d !== "" ? { background: "rgba(255,255,255,0.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.2)", boxShadow: "0 2px 8px rgba(244,114,182,0.1)" } : {}}>
                    {d}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (

            /* Editor */
            <motion.div key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Total indicator */}
              <div className="rounded-2xl px-4 py-3 flex items-center justify-between"
                style={{ background: Math.abs(totalPct - 100) < 0.01 ? "rgba(52,211,153,0.15)" : totalPct > 100 ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.5)", border: `1px solid ${Math.abs(totalPct - 100) < 0.01 ? "rgba(52,211,153,0.4)" : totalPct > 100 ? "rgba(244,63,94,0.35)" : "rgba(244,114,182,0.15)"}`, backdropFilter: "blur(16px)" }}>
                <span className="text-sm font-medium text-rose-800">Сумма процентов</span>
                <span className={`text-lg font-bold ${Math.abs(totalPct - 100) < 0.01 ? "text-emerald-500" : totalPct > 100 ? "text-red-500" : "text-rose-600"}`}>
                  {totalPct.toFixed(1)}%
                  {Math.abs(totalPct - 100) < 0.01 && " ✓"}
                  {totalPct > 100 && " — перебор!"}
                  {totalPct < 100 && ` (осталось ${remaining.toFixed(1)}%)`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(244,114,182,0.15)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: totalPct > 100 ? "#f43f5e" : "linear-gradient(90deg, #f472b6, #c026d3)" }}
                  animate={{ width: `${Math.min(totalPct, 100)}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }} />
              </div>

              {/* Prizes list */}
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {localPrizes.map((p, i) => (
                    <motion.div key={p.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="rounded-xl overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.7)" }}
                    >
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <GripVertical className="h-4 w-4 text-rose-200 shrink-0" />
                        <div className="h-3 w-3 rounded-full shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }} />
                        <input
                          value={p.label}
                          onChange={e => updateLabel(p.id, e.target.value)}
                          className="flex-1 text-sm font-medium text-rose-800 bg-transparent outline-none min-w-0"
                          placeholder="Название приза..."
                        />
                        <div className="flex items-center gap-1 shrink-0">
                          <input
                            value={p.weight}
                            onChange={e => updatePct(p.id, e.target.value)}
                            type="number" min="0.1" max="100" step="0.1"
                            className="w-16 px-2 py-1 rounded-lg text-sm font-bold text-rose-700 text-right outline-none"
                            style={{ background: "rgba(244,114,182,0.08)", border: "1px solid rgba(244,114,182,0.2)" }}
                          />
                          <span className="text-xs text-rose-400">%</span>
                        </div>
                        <motion.button onClick={() => removePrize(p.id)} whileTap={{ scale: 0.85 }}
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-rose-300 hover:text-rose-500 transition-colors shrink-0">
                          <Trash2 className="h-3.5 w-3.5" />
                        </motion.button>
                      </div>

                      {/* Mini bar */}
                      <div className="h-1 mx-3 mb-2 rounded-full overflow-hidden" style={{ background: "rgba(244,114,182,0.1)" }}>
                        <div className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(p.weight, 100)}%`, background: COLORS[i % COLORS.length] }} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Add new prize */}
              <div className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: "rgba(255,255,255,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(244,114,182,0.15)" }}>
                <p className="text-xs font-semibold text-rose-600">+ Новый приз</p>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addPrize()}
                  placeholder="Название приза..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-rose-800 placeholder-rose-300 outline-none"
                  style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(244,114,182,0.2)" }} />
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input value={newPct} onChange={e => setNewPct(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addPrize()}
                      type="number" min="0.1" max="100" step="0.1"
                      placeholder={`макс. ${remaining.toFixed(1)}`}
                      className="w-full px-3 py-2.5 pr-8 rounded-xl text-sm text-rose-800 placeholder-rose-300 outline-none"
                      style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(244,114,182,0.2)" }} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-rose-400">%</span>
                  </div>
                  <motion.button onClick={addPrize} whileTap={{ scale: 0.92 }}
                    disabled={!newLabel.trim() || !newPct || totalPct + parseFloat(newPct || "0") > 100}
                    className="h-10 w-10 flex items-center justify-center rounded-xl text-white disabled:opacity-40"
                    style={{ background: "linear-gradient(135deg, #f472b6, #c026d3)" }}>
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Save button */}
              <motion.button onClick={handleSave}
                disabled={!isValid}
                whileTap={{ scale: 0.97 }}
                animate={saved ? { scale: [1, 1.04, 1] } : {}}
                className="w-full py-4 rounded-2xl text-white font-bold text-sm disabled:opacity-40 transition-all"
                style={{ background: saved ? "linear-gradient(135deg, #34d399, #059669)" : "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 4px 20px rgba(244,114,182,0.4)" }}>
                {saved ? "✓ Сохранено!" : isValid ? "Сохранить призы" : `Сумма должна быть 100% (сейчас ${totalPct.toFixed(1)}%)`}
              </motion.button>

              <p className="text-[10px] text-rose-300 text-center">
                Сумма всех процентов должна равняться ровно 100%
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
