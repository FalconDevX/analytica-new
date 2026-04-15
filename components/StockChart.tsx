"use client"

import { useEffect, useRef } from "react"

type Point = number

const COL = {
	bg: "#000000",
	yellow: "#ffff00",
	orange: "#ff8c00",
	amber: "#ffb200",
	red: "#ff1030",
	redHot: "#ff2244",
	crimson: "#cc0020",
	gridLine: "rgba(255, 255, 255, 0.06)",
	gridDot: "rgba(255, 255, 255, 0.28)",
	glowYellow: "rgba(255, 255, 100, 0.85)",
	glowOrange: "rgba(255, 140, 0, 0.75)",
	glowRed: "rgba(255, 45, 65, 0.78)"
}

function rnd(seed: number) {
	const x = Math.sin(seed) * 10000
	return x - Math.floor(x)
}

export default function StockChart() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const frameRef = useRef<number | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current!
		const ctx = canvas.getContext("2d")!

		let W = 0,
			H = 0,
			cssW = 0,
			cssH = 0

		const resize = () => {
			const parent = canvas.parentElement!
			const dpr = window.devicePixelRatio || 1
			cssW = parent.clientWidth
			cssH = parent.clientHeight
			W = canvas.width = Math.round(cssW * dpr)
			H = canvas.height = Math.round(cssH * dpr)
			canvas.style.width = "100%"
			canvas.style.height = "100%"
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}

		resize()
		window.addEventListener("resize", resize)

		const N = 200
		let prices: Point[] = Array.from({ length: N }, (_, i) => 550 + Math.sin(i * 0.14) * 22 + rnd(i * 1.7) * 12)
		let ghost: Point[] = prices.map((p, i) => p + Math.sin(i * 0.3) * 8 - 6)
		let t = 0
		let scanY = 0
		let hudPhase = 0

		const bokeh = Array.from({ length: 34 }, (_, i) => {
			const roll = rnd(i * 9)
			let hue = "255, 200, 120"
			if (roll < 0.28) hue = "255, 45, 75"
			else if (roll < 0.52) hue = "255, 90, 50"
			else if (roll < 0.72) hue = "255, 200, 60"
			else if (roll < 0.88) hue = "180, 220, 255"
			return {
				x: rnd(i * 2.1),
				y: rnd(i * 3.7),
				r: 40 + rnd(i) * 120,
				a: 0.028 + rnd(i * 5) * 0.07,
				hue
			}
		})

		const stars = Array.from({ length: 220 }, () => ({
			x: Math.random(),
			y: Math.random(),
			r: Math.random() * 1.1 + 0.15,
			brightness: Math.random() * 0.45 + 0.15,
			twinkle: Math.random() * Math.PI * 2,
			twinkleSpeed: Math.random() * 0.028 + 0.004
		}))

		const gridRows = 10,
			gridCols = 16

		const hudLines = [
			"SIM_MODE: HFT_ALPHA",
			"LAT_MS: 0.42",
			"DEPTH: L2_AGG",
			"SIGMA: 1.28",
			"CORR_SPX: 0.71"
		]

		const draw = () => {
			t += 0.016
			hudPhase += 0.022
			scanY = (scanY + cssH * 0.004 + 0.3) % (cssH + 40)

			if (Math.random() < 0.42) {
				const last = prices[prices.length - 1]
				const next = last + (Math.random() - 0.48) * 6.5 + Math.sin(t * 0.55) * 1.4 + Math.cos(t * 0.31) * 0.9
				prices.push(Math.max(488, Math.min(628, next)))
				prices = prices.slice(-N)
				const gLast = ghost[ghost.length - 1]
				ghost.push(gLast + (Math.random() - 0.5) * 5 + Math.sin(t * 0.9) * 2)
				ghost = ghost.slice(-N)
			}

			const pad = { l: 52, r: 108, t: 56, b: 64 }
			const w = cssW,
				h = cssH
			const cw = w - pad.l - pad.r
			const ch = h - pad.t - pad.b
			const min = Math.min(...prices) - 14
			const max = Math.max(...prices) + 14
			const xS = (i: number) => pad.l + (i / (prices.length - 1)) * cw
			const yS = (p: number) => pad.t + ch - ((p - min) / (max - min)) * ch
			const baseY = pad.t + ch

			const heatAt = (i: number) => {
				if (i <= 0) return rnd(i * 11 + t) * 0.38
				const drop = prices[i - 1] - prices[i]
				return Math.max(0, Math.min(1, drop / 11 + rnd(i * 3 + Math.floor(t * 28)) * 0.34))
			}

			ctx.fillStyle = COL.bg
			ctx.fillRect(0, 0, w, h)

			bokeh.forEach((b, i) => {
				const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r)
				g.addColorStop(0, `rgba(${b.hue}, ${b.a})`)
				g.addColorStop(1, "rgba(0,0,0,0)")
				ctx.fillStyle = g
				ctx.fillRect(0, 0, w, h)
			})

			stars.forEach((s, si) => {
				s.twinkle += s.twinkleSpeed
				const alpha = s.brightness * (0.45 + 0.55 * Math.sin(s.twinkle))
				const warm = rnd(si * 8.3) > 0.72
				ctx.beginPath()
				ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
				ctx.fillStyle = warm
					? `rgba(255, 160, 150, ${alpha * 0.42})`
					: `rgba(255, 245, 220, ${alpha * 0.32})`
				ctx.fill()
			})

			ctx.save()
			ctx.font = "9px ui-monospace, monospace"
			ctx.fillStyle = "rgba(255, 200, 80, 0.04)"
			for (let row = 0; row < 14; row++) {
				let line = ""
				for (let col = 0; col < 42; col++) {
					line += rnd(row * 97 + col * 13 + t * 3) > 0.55 ? (rnd(col) > 0.5 ? "1" : "0") : " "
				}
				ctx.fillText(line, 8 + (row % 3) * 40, 14 + row * 11 + Math.sin(t + row) * 2)
			}
			ctx.restore()

			ctx.save()
			ctx.strokeStyle = COL.gridLine
			ctx.lineWidth = 0.5
			ctx.setLineDash([2, 14])
			for (let i = 0; i <= gridRows; i++) {
				const y = pad.t + (i / gridRows) * ch
				ctx.beginPath()
				ctx.moveTo(pad.l, y)
				ctx.lineTo(w - pad.r, y)
				ctx.stroke()
			}
			for (let i = 0; i <= gridCols; i++) {
				const x = pad.l + (i / gridCols) * cw
				ctx.beginPath()
				ctx.moveTo(x, pad.t)
				ctx.lineTo(x, pad.t + ch)
				ctx.stroke()
			}
			ctx.setLineDash([])

			for (let r = 0; r <= gridRows; r++) {
				for (let c = 0; c <= gridCols; c++) {
					const gx = pad.l + (c / gridCols) * cw
					const gy = pad.t + (r / gridRows) * ch
					ctx.beginPath()
					ctx.arc(gx, gy, 1.1, 0, Math.PI * 2)
					ctx.fillStyle = COL.gridDot
					ctx.fill()
				}
			}
			ctx.restore()

			ctx.save()
			ctx.globalAlpha = 0.16
			ctx.beginPath()
			ghost.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = "rgba(255, 140, 110, 0.55)"
			ctx.lineWidth = 2
			ctx.shadowColor = COL.glowRed
			ctx.shadowBlur = 16
			ctx.stroke()
			ctx.shadowBlur = 0
			ctx.restore()

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.lineTo(xS(prices.length - 1), baseY)
			ctx.lineTo(xS(0), baseY)
			ctx.closePath()
			const areaGrad = ctx.createLinearGradient(0, pad.t, 0, baseY)
			areaGrad.addColorStop(0, "rgba(255, 255, 90, 0.1)")
			areaGrad.addColorStop(0.28, "rgba(255, 160, 40, 0.08)")
			areaGrad.addColorStop(0.52, "rgba(255, 80, 50, 0.06)")
			areaGrad.addColorStop(0.78, "rgba(255, 40, 70, 0.05)")
			areaGrad.addColorStop(1, "rgba(160, 0, 40, 0)")
			ctx.fillStyle = areaGrad
			ctx.fill()

			ctx.save()
			ctx.setLineDash([3, 5])
			ctx.lineWidth = 0.8
			prices.forEach((p, i) => {
				if (i % 3 !== 0) return
				const x = xS(i),
					y = yS(p)
				const up = y - (18 + rnd(i * 7) * 28)
				const hr = heatAt(i)
				ctx.strokeStyle =
					hr > 0.45 || rnd(i * 13) > 0.62
						? `rgba(255, ${80 - 40 * hr}, ${70 - 20 * hr}, ${0.32 + hr * 0.15})`
						: "rgba(255, 200, 80, 0.32)"
				ctx.beginPath()
				ctx.moveTo(x, y)
				ctx.lineTo(x, up)
				ctx.stroke()
			})
			ctx.setLineDash([])
			ctx.restore()

			ctx.lineJoin = "round"
			ctx.lineCap = "round"

			const lineGrad = ctx.createLinearGradient(pad.l, pad.t, w - pad.r, baseY)
			lineGrad.addColorStop(0, COL.redHot)
			lineGrad.addColorStop(0.2, COL.orange)
			lineGrad.addColorStop(0.45, "#ffcc00")
			lineGrad.addColorStop(0.62, COL.yellow)
			lineGrad.addColorStop(0.8, COL.red)
			lineGrad.addColorStop(1, "#ffaa33")

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = "rgba(255, 70, 50, 0.38)"
			ctx.lineWidth = 12
			ctx.shadowColor = COL.glowRed
			ctx.shadowBlur = 26
			ctx.stroke()
			ctx.shadowBlur = 0

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = "rgba(255, 150, 70, 0.52)"
			ctx.lineWidth = 4.5
			ctx.shadowColor = "rgba(255, 120, 60, 0.55)"
			ctx.shadowBlur = 16
			ctx.stroke()
			ctx.shadowBlur = 0

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = lineGrad
			ctx.lineWidth = 2
			ctx.shadowColor = "rgba(255, 200, 80, 0.75)"
			ctx.shadowBlur = 10
			ctx.stroke()
			ctx.shadowBlur = 0

			const nC = prices.length
			const segW = cw / Math.max(1, nC - 1)
			const bodyW = Math.min(7.8, Math.max(2.1, segW * 0.56))
			const wickW = Math.max(0.9, Math.min(1.35, bodyW * 0.18))
			const rng = (max - min) * 0.0058

			for (let i = 0; i < nC; i++) {
				const open = i > 0 ? prices[i - 1] : prices[i]
				const close = prices[i]
				const hi = Math.max(open, close) + rng * (0.55 + rnd(i * 1.71 + t * 0.06) * 4.8)
				const lo = Math.min(open, close) - rng * (0.5 + rnd(i * 2.29 + t * 0.05) * 4.5)
				const x = xS(i)
				const yHi = yS(hi)
				const yLo = yS(lo)
				const yO = yS(open)
				const yC = yS(close)
				let top = Math.min(yO, yC)
				let bot = Math.max(yO, yC)
				let bodyH = bot - top
				if (bodyH < 1) {
					const ym = (yO + yC) * 0.5
					top = ym - 0.5
					bot = ym + 0.5
					bodyH = 1
				}
				const bear = close < open

				ctx.beginPath()
				ctx.moveTo(x, yHi)
				ctx.lineTo(x, yLo)
				ctx.strokeStyle = bear ? "rgba(255, 150, 130, 0.88)" : "rgba(255, 235, 170, 0.82)"
				ctx.lineWidth = wickW
				ctx.lineCap = "butt"
				ctx.stroke()

				const bg = ctx.createLinearGradient(x - bodyW * 0.5, top, x + bodyW * 0.5, bot)
				if (bear) {
					bg.addColorStop(0, "rgba(255, 85, 95, 0.98)")
					bg.addColorStop(0.55, "rgba(255, 45, 70, 0.94)")
					bg.addColorStop(1, "rgba(195, 20, 50, 0.9)")
				} else {
					bg.addColorStop(0, "rgba(255, 250, 140, 0.96)")
					bg.addColorStop(0.45, "rgba(255, 190, 60, 0.9)")
					bg.addColorStop(1, "rgba(255, 130, 35, 0.88)")
				}
				ctx.fillStyle = bg
				ctx.shadowColor = bear ? COL.glowRed : COL.glowOrange
				ctx.shadowBlur = bear ? 10 : 8
				ctx.fillRect(x - bodyW * 0.5, top, bodyW, bodyH)
				ctx.shadowBlur = 0

				ctx.strokeStyle = bear ? "rgba(255, 210, 210, 0.48)" : "rgba(255, 255, 230, 0.4)"
				ctx.lineWidth = 0.65
				ctx.strokeRect(x - bodyW * 0.5, top, bodyW, bodyH)
			}

			const last = prices[prices.length - 1]
			const lx = xS(prices.length - 1),
				ly = yS(last)

			const lastDown = prices.length > 1 && last < prices[prices.length - 2]
			const pulse = 0.5 + 0.5 * Math.sin(t * 4.2)
			ctx.beginPath()
			ctx.arc(lx, ly, 8 + pulse * 5, 0, Math.PI * 2)
			ctx.strokeStyle = lastDown
				? `rgba(255, 100, 100, ${0.14 + pulse * 0.24})`
				: `rgba(255, 255, 80, ${0.12 + pulse * 0.22})`
			ctx.lineWidth = 1.5
			ctx.stroke()

			ctx.beginPath()
			ctx.arc(lx, ly, 4.2, 0, Math.PI * 2)
			ctx.fillStyle = lastDown ? COL.redHot : COL.amber
			ctx.shadowColor = lastDown ? COL.glowRed : COL.yellow
			ctx.shadowBlur = 22
			ctx.fill()
			ctx.shadowBlur = 0

			ctx.beginPath()
			ctx.arc(lx, ly, 1.6, 0, Math.PI * 2)
			ctx.fillStyle = "#ffffff"
			ctx.fill()

			ctx.save()
			ctx.font =
				'300 11.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace'
			ctx.fillStyle = "rgba(245, 232, 210, 0.9)"
			ctx.shadowColor = "rgba(255, 190, 100, 0.2)"
			ctx.shadowBlur = 4
			ctx.fillText(`$ ${last.toFixed(2)}`, lx + 11, ly - 5)
			ctx.shadowBlur = 0
			ctx.restore()

			ctx.font = "11px ui-monospace, monospace"
			ctx.fillStyle = "rgba(255, 220, 120, 0.5)"
			ctx.textAlign = "right"
			for (let i = 0; i <= 4; i++) {
				const val = min + (max - min) * (i / 4)
				const y = pad.t + ch - (i / 4) * ch
				ctx.fillText("$" + val.toFixed(0), pad.l - 8, y + 4)
			}
			ctx.textAlign = "left"

			ctx.save()
			const scanGrad = ctx.createLinearGradient(0, scanY - 14, 0, scanY + 14)
			scanGrad.addColorStop(0, "rgba(255, 180, 120, 0)")
			scanGrad.addColorStop(0.35, "rgba(255, 200, 100, 0.05)")
			scanGrad.addColorStop(0.5, "rgba(255, 120, 100, 0.08)")
			scanGrad.addColorStop(0.65, "rgba(255, 220, 140, 0.05)")
			scanGrad.addColorStop(1, "rgba(255, 160, 100, 0)")
			ctx.fillStyle = scanGrad
			ctx.fillRect(pad.l, scanY - 16, cw, 32)
			ctx.restore()

			ctx.save()
			ctx.font = "10px ui-monospace, monospace"
			const tick = Math.floor(t * 8) % 1000
			const tickWarm = Math.sin(hudPhase * 1.3) > 0.25
			ctx.fillStyle = tickWarm
				? `rgba(255, 170, 130, ${0.14 + 0.05 * Math.sin(hudPhase)})`
				: `rgba(255, 200, 100, ${0.12 + 0.06 * Math.sin(hudPhase)})`
			ctx.fillText(
				`▸ ${tick.toString().padStart(3, "0")}  ${(last * 1.0001).toFixed(4)}  ${(last * 0.9997).toFixed(4)}  VOL_SIM`,
				pad.l,
				h - 22
			)
			hudLines.forEach((line, i) => {
				ctx.fillStyle = `rgba(200, 220, 255, ${0.06 + 0.04 * Math.sin(hudPhase + i)})`
				ctx.fillText(line, w - pad.r + 4, pad.t + 14 + i * 13)
			})
			if (Math.sin(t * 0.7) > 0.65) {
				ctx.fillStyle = "rgba(255, 255, 100, 0.35)"
				ctx.fillText("STREAM_OK", w - pad.r + 4, pad.t + 14 + hudLines.length * 13)
			}
			ctx.restore()

			frameRef.current = requestAnimationFrame(draw)
		}

		draw()

		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current)
			window.removeEventListener("resize", resize)
		}
	}, [])

	return (
		<div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
			<canvas ref={canvasRef} className="h-full w-full" />
		</div>
	)
}
