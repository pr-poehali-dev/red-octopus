import { useRef, useEffect } from "react"

export interface Prize {
  id: string
  label: string
  color: string
  weight: number
}

interface FortuneWheelProps {
  prizes: Prize[]
  rotation: number
  isSpinning: boolean
}

const COLORS = [
  "#f472b6", "#e879f9", "#c084fc", "#fb7185",
  "#f9a8d4", "#d946ef", "#a78bfa", "#f43f5e",
]

export function FortuneWheel({ prizes, rotation, isSpinning }: FortuneWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const SIZE = 320
  const cx = SIZE / 2
  const cy = SIZE / 2
  const R = SIZE / 2 - 4

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, SIZE, SIZE)

    const total = prizes.reduce((s, p) => s + p.weight, 0)
    let startAngle = 0

    prizes.forEach((prize, i) => {
      const slice = (prize.weight / total) * 2 * Math.PI

      // Sector
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, startAngle, startAngle + slice)
      ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = "rgba(255,255,255,0.7)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Inner glow
      const grad = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R)
      grad.addColorStop(0, "rgba(255,255,255,0.25)")
      grad.addColorStop(1, "rgba(0,0,0,0.1)")
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, startAngle, startAngle + slice)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()

      // Label
      const midAngle = startAngle + slice / 2
      const labelR = R * 0.65
      const lx = cx + Math.cos(midAngle) * labelR
      const ly = cy + Math.sin(midAngle) * labelR

      ctx.save()
      ctx.translate(lx, ly)
      ctx.rotate(midAngle + Math.PI / 2)

      const fontSize = slice < 0.4 ? 9 : slice < 0.7 ? 11 : 13
      ctx.font = `bold ${fontSize}px sans-serif`
      ctx.fillStyle = "#fff"
      ctx.textAlign = "center"
      ctx.shadowColor = "rgba(0,0,0,0.4)"
      ctx.shadowBlur = 3

      // Wrap text if needed
      const words = prize.label.split(" ")
      const lineH = fontSize + 2
      const lines: string[] = []
      let current = ""
      for (const w of words) {
        const test = current ? `${current} ${w}` : w
        if (ctx.measureText(test).width > R * 0.55) {
          if (current) lines.push(current)
          current = w
        } else {
          current = test
        }
      }
      if (current) lines.push(current)

      const totalH = lines.length * lineH
      lines.forEach((line, li) => {
        ctx.fillText(line, 0, -totalH / 2 + li * lineH + lineH / 2)
      })

      ctx.restore()
      startAngle += slice
    })

    // Center circle
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22)
    centerGrad.addColorStop(0, "#fff")
    centerGrad.addColorStop(1, "#fce7f3")
    ctx.beginPath()
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI)
    ctx.fillStyle = centerGrad
    ctx.shadowColor = "rgba(244,114,182,0.4)"
    ctx.shadowBlur = 12
    ctx.fill()
    ctx.strokeStyle = "rgba(244,114,182,0.4)"
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.shadowBlur = 0

    // Center star
    ctx.font = "18px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("✨", cx, cy)

  }, [prizes, rotation])

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      {/* Pointer */}
      <div className="absolute z-20 top-0 left-1/2 -translate-x-1/2 -translate-y-1"
        style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "26px solid #be185d", filter: "drop-shadow(0 2px 4px rgba(190,24,93,0.4))" }} />

      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full"
        style={{ boxShadow: "0 0 0 4px rgba(244,114,182,0.3), 0 8px 40px rgba(244,114,182,0.25), inset 0 0 0 2px rgba(255,255,255,0.5)" }} />

      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        style={{
          borderRadius: "50%",
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "transform 0.3s ease",
        }}
      />
    </div>
  )
}
