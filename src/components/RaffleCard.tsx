import { motion } from "framer-motion"
import { Trophy, ChevronRight } from "lucide-react"

interface RaffleCardProps {
  onClick: () => void
}

export function RaffleCard({ onClick }: RaffleCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex w-full items-center gap-4 rounded-[20px] px-4 py-4 overflow-hidden text-left"
      style={{
        background: "linear-gradient(135deg, rgba(244,114,182,0.35) 0%, rgba(192,38,211,0.25) 100%)",
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
        boxShadow: `
          inset 0 1px 1px rgba(255, 255, 255, 0.8),
          0 0 0 1.5px rgba(244, 114, 182, 0.4),
          0 4px 16px rgba(244, 114, 182, 0.25),
          0 8px 32px rgba(192, 38, 211, 0.15)
        `,
        border: "1px solid rgba(244,114,182,0.3)",
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="absolute inset-x-0 top-0 h-[50%] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)", borderRadius: "20px 20px 0 0" }} />

      <motion.div className="absolute inset-0 pointer-events-none rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.3), transparent 70%)" }} />

      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
        style={{ background: "linear-gradient(135deg, #f472b6, #c026d3)", boxShadow: "0 4px 12px rgba(244,114,182,0.5)" }}>
        <Trophy className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <div className="relative flex-1 min-w-0">
        <h3 className="text-[15px] font-bold text-rose-800 tracking-tight">Провести розыгрыш</h3>
        <p className="text-[12px] text-fuchsia-500 truncate mt-0.5">Запустить честное случайное определение</p>
      </div>

      <ChevronRight className="relative h-5 w-5 text-rose-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-rose-600" strokeWidth={2} />
    </motion.button>
  )
}
