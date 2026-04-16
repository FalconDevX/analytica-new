"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

type Point = number

type Palette = {
	bg: string
	starAlphaMul: number
	bokehAlphaMul: number
	binaryRain: string
	gridLine: string
	gridDot: string
	ghostStroke: string
	ghostGlow: string
	areaStopsDown: [string, string, string, string, string]
	areaStopsUp: [string, string, string, string, string]
	wickDashBase: string
	wickDashHot: (hr: number) => string
	lineGradStops: [string, string, string, string, string, string]
	lineOuterStroke: string
	lineOuterGlow: string
	lineMidStroke: string
	lineMidGlow: string
	lineMainGlow: string
	wickBear: string
	wickBull: string
	bearGrad: [string, string, string]
	bullGrad: [string, string, string]
	bodyStrokeBear: string
	bodyStrokeBull: string
	bearGlow: string
	bullGlow: string
	lastPulseUp: (alpha: number) => string
	lastPulseDown: (alpha: number) => string
	lastDotUp: string
	lastDotDown: string
	lastDotUpGlow: string
	lastDotDownGlow: string
	lastDotCore: string
	priceText: string
	priceShadow: string
	axisText: string
	scanStops: [string, string, string, string, string]
	hudTextWarm: (alpha: number) => string
	hudTextCool: (alpha: number) => string
	hudTextBlue: (alpha: number) => string
	streamOk: string
}

const DARK_PALETTE: Palette = {
	bg: "#000000",
	starAlphaMul: 1,
	bokehAlphaMul: 1,
	binaryRain: "rgba(255, 200, 80, 0.04)",
	gridLine: "rgba(255, 255, 255, 0.06)",
	gridDot: "rgba(255, 255, 255, 0.28)",
	ghostStroke: "rgba(255, 140, 110, 0.55)",
	ghostGlow: "rgba(255, 45, 65, 0.78)",
	areaStopsDown: [
		"rgba(255, 255, 90, 0.1)",
		"rgba(255, 160, 40, 0.08)",
		"rgba(255, 80, 50, 0.06)",
		"rgba(255, 40, 70, 0.05)",
		"rgba(160, 0, 40, 0)"
	],
	areaStopsUp: [
		"rgba(180, 255, 180, 0.12)",
		"rgba(90, 230, 130, 0.09)",
		"rgba(40, 200, 100, 0.07)",
		"rgba(20, 160, 80, 0.05)",
		"rgba(0, 90, 40, 0)"
	],
	wickDashBase: "rgba(255, 200, 80, 0.32)",
	wickDashHot: (hr) => `rgba(255, ${80 - 40 * hr}, ${70 - 20 * hr}, ${0.32 + hr * 0.15})`,
	lineGradStops: ["#ff2244", "#ff8c00", "#ffcc00", "#ffff00", "#ff1030", "#ffaa33"],
	lineOuterStroke: "rgba(255, 70, 50, 0.38)",
	lineOuterGlow: "rgba(255, 45, 65, 0.78)",
	lineMidStroke: "rgba(255, 150, 70, 0.52)",
	lineMidGlow: "rgba(255, 120, 60, 0.55)",
	lineMainGlow: "rgba(255, 200, 80, 0.75)",
	wickBear: "rgba(255, 150, 130, 0.88)",
	wickBull: "rgba(255, 235, 170, 0.82)",
	bearGrad: ["rgba(255, 85, 95, 0.98)", "rgba(255, 45, 70, 0.94)", "rgba(195, 20, 50, 0.9)"],
	bullGrad: ["rgba(255, 250, 140, 0.96)", "rgba(255, 190, 60, 0.9)", "rgba(255, 130, 35, 0.88)"],
	bodyStrokeBear: "rgba(255, 210, 210, 0.48)",
	bodyStrokeBull: "rgba(255, 255, 230, 0.4)",
	bearGlow: "rgba(255, 45, 65, 0.78)",
	bullGlow: "rgba(255, 140, 0, 0.75)",
	lastPulseUp: (a) => `rgba(255, 255, 80, ${a})`,
	lastPulseDown: (a) => `rgba(255, 100, 100, ${a})`,
	lastDotUp: "#ffb200",
	lastDotDown: "#ff2244",
	lastDotUpGlow: "#ffff00",
	lastDotDownGlow: "rgba(255, 45, 65, 0.78)",
	lastDotCore: "#ffffff",
	priceText: "rgba(245, 232, 210, 0.9)",
	priceShadow: "rgba(255, 190, 100, 0.2)",
	axisText: "rgba(255, 220, 120, 0.5)",
	scanStops: [
		"rgba(255, 180, 120, 0)",
		"rgba(255, 200, 100, 0.05)",
		"rgba(255, 120, 100, 0.08)",
		"rgba(255, 220, 140, 0.05)",
		"rgba(255, 160, 100, 0)"
	],
	hudTextWarm: (a) => `rgba(255, 170, 130, ${a})`,
	hudTextCool: (a) => `rgba(255, 200, 100, ${a})`,
	hudTextBlue: (a) => `rgba(200, 220, 255, ${a})`,
	streamOk: "rgba(255, 255, 100, 0.35)"
}

const LIGHT_PALETTE: Palette = {
	bg: "#fafafa",
	starAlphaMul: 0,
	bokehAlphaMul: 0.25,
	binaryRain: "rgba(180, 120, 40, 0.05)",
	gridLine: "rgba(0, 0, 0, 0.06)",
	gridDot: "rgba(0, 0, 0, 0.22)",
	ghostStroke: "rgba(220, 60, 40, 0.35)",
	ghostGlow: "rgba(220, 38, 38, 0.3)",
	areaStopsDown: [
		"rgba(234, 179, 8, 0.14)",
		"rgba(234, 88, 12, 0.11)",
		"rgba(220, 38, 38, 0.08)",
		"rgba(185, 28, 28, 0.05)",
		"rgba(127, 29, 29, 0)"
	],
	areaStopsUp: [
		"rgba(134, 239, 172, 0.2)",
		"rgba(74, 222, 128, 0.14)",
		"rgba(34, 197, 94, 0.1)",
		"rgba(22, 163, 74, 0.06)",
		"rgba(20, 83, 45, 0)"
	],
	wickDashBase: "rgba(180, 83, 9, 0.32)",
	wickDashHot: (hr) => `rgba(${200 - 40 * hr}, ${60 - 30 * hr}, 30, ${0.28 + hr * 0.2})`,
	lineGradStops: ["#b91c1c", "#ea580c", "#d97706", "#eab308", "#dc2626", "#c2410c"],
	lineOuterStroke: "rgba(220, 38, 38, 0.22)",
	lineOuterGlow: "rgba(220, 38, 38, 0.25)",
	lineMidStroke: "rgba(234, 88, 12, 0.4)",
	lineMidGlow: "rgba(234, 88, 12, 0.35)",
	lineMainGlow: "rgba(234, 88, 12, 0.3)",
	wickBear: "rgba(153, 27, 27, 0.85)",
	wickBull: "rgba(120, 53, 15, 0.75)",
	bearGrad: ["rgba(239, 68, 68, 0.95)", "rgba(220, 38, 38, 0.92)", "rgba(153, 27, 27, 0.9)"],
	bullGrad: ["rgba(252, 211, 77, 0.96)", "rgba(251, 146, 60, 0.92)", "rgba(217, 119, 6, 0.9)"],
	bodyStrokeBear: "rgba(127, 29, 29, 0.45)",
	bodyStrokeBull: "rgba(120, 53, 15, 0.42)",
	bearGlow: "rgba(220, 38, 38, 0.28)",
	bullGlow: "rgba(234, 88, 12, 0.25)",
	lastPulseUp: (a) => `rgba(217, 119, 6, ${a})`,
	lastPulseDown: (a) => `rgba(220, 38, 38, ${a})`,
	lastDotUp: "#d97706",
	lastDotDown: "#dc2626",
	lastDotUpGlow: "rgba(234, 179, 8, 0.6)",
	lastDotDownGlow: "rgba(220, 38, 38, 0.55)",
	lastDotCore: "#ffffff",
	priceText: "rgba(60, 30, 5, 0.9)",
	priceShadow: "rgba(234, 88, 12, 0.22)",
	axisText: "rgba(80, 40, 5, 0.7)",
	scanStops: [
		"rgba(234, 88, 12, 0)",
		"rgba(234, 88, 12, 0.04)",
		"rgba(220, 38, 38, 0.06)",
		"rgba(234, 179, 8, 0.04)",
		"rgba(234, 88, 12, 0)"
	],
	hudTextWarm: (a) => `rgba(153, 73, 10, ${a * 1.6})`,
	hudTextCool: (a) => `rgba(120, 50, 5, ${a * 1.6})`,
	hudTextBlue: (a) => `rgba(30, 41, 90, ${a * 1.8})`,
	streamOk: "rgba(21, 128, 61, 0.6)"
}

function rnd(seed: number) {
	const x = Math.sin(seed) * 10000
	return x - Math.floor(x)
}

export default function StockChart() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const frameRef = useRef<number | null>(null)
	const paletteRef = useRef<Palette>(DARK_PALETTE)
	const { resolvedTheme } = useTheme()

	useEffect(() => {
		paletteRef.current = resolvedTheme === "light" ? LIGHT_PALETTE : DARK_PALETTE
	}, [resolvedTheme])

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

		const N = 60
		let prices: Point[] = Array.from({ length: N + 1 }, (_, i) => {
			const spike = rnd(i * 4.3) > 0.78 ? (rnd(i * 9.1) - 0.5) * 28 : 0
			return 550 + Math.sin(i * 0.32) * 22 + (rnd(i * 1.7) - 0.5) * 18 + spike
		})
		let ghost: Point[] = prices.map((p, i) => p + Math.sin(i * 0.55) * 8 - 6)
		let t = 0
		let scanY = 0
		let hudPhase = 0
		let candleAcc = 0
		const CANDLE_INTERVAL = 0.2
		let lastTs = 0

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

		const hudLines = ["SIM_MODE: HFT_ALPHA", "LAT_MS: 0.42", "DEPTH: L2_AGG", "SIGMA: 1.28", "CORR_SPX: 0.71"]

		const draw = (ts: number) => {
			if (!lastTs) lastTs = ts
			const dt = Math.min(0.05, (ts - lastTs) / 1000)
			lastTs = ts
			t += dt
			hudPhase += dt * 1.4
			scanY = (scanY + cssH * 0.25 * dt + dt * 18) % (cssH + 40)

			candleAcc += dt
			while (candleAcc >= CANDLE_INTERVAL) {
				candleAcc -= CANDLE_INTERVAL
				const last = prices[prices.length - 1]
				const volatility = Math.random() < 0.22 ? 22 : Math.random() < 0.45 ? 10 : 4
				const next = last + (Math.random() - 0.48) * volatility + Math.sin(t * 0.55) * 1.4 + Math.cos(t * 0.31) * 0.9
				prices.push(Math.max(488, Math.min(628, next)))
				prices.shift()
				const gLast = ghost[ghost.length - 1]
				ghost.push(gLast + (Math.random() - 0.5) * 5 + Math.sin(t * 0.9) * 2)
				ghost.shift()
			}
			const shift = candleAcc / CANDLE_INTERVAL

			const P = paletteRef.current

			const pad = { l: 52, r: 108, t: 56, b: 64 }
			const w = cssW,
				h = cssH
			const cw = w - pad.l - pad.r
			const ch = h - pad.t - pad.b
			const min = Math.min(...prices) - 14
			const max = Math.max(...prices) + 14
			const denom = prices.length - 2
			const xS = (i: number) => pad.l + ((i - shift) / denom) * cw
			const yS = (p: number) => pad.t + ch - ((p - min) / (max - min)) * ch
			const baseY = pad.t + ch

			const heatAt = (i: number) => {
				if (i <= 0) return rnd(i * 11 + t) * 0.38
				const drop = prices[i - 1] - prices[i]
				return Math.max(0, Math.min(1, drop / 11 + rnd(i * 3 + Math.floor(t * 28)) * 0.34))
			}

			ctx.fillStyle = P.bg
			ctx.fillRect(0, 0, w, h)

			if (P.bokehAlphaMul > 0) {
				bokeh.forEach((b) => {
					const g = ctx.createRadialGradient(b.x * w, b.y * h, 0, b.x * w, b.y * h, b.r)
					g.addColorStop(0, `rgba(${b.hue}, ${b.a * P.bokehAlphaMul})`)
					g.addColorStop(1, "rgba(0,0,0,0)")
					ctx.fillStyle = g
					ctx.fillRect(0, 0, w, h)
				})
			}

			if (P.starAlphaMul > 0) {
				stars.forEach((s, si) => {
					s.twinkle += s.twinkleSpeed
					const alpha = s.brightness * (0.45 + 0.55 * Math.sin(s.twinkle)) * P.starAlphaMul
					const warm = rnd(si * 8.3) > 0.72
					ctx.beginPath()
					ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
					ctx.fillStyle = warm ? `rgba(255, 160, 150, ${alpha * 0.42})` : `rgba(255, 245, 220, ${alpha * 0.32})`
					ctx.fill()
				})
			}

			ctx.save()
			ctx.font = "9px ui-monospace, monospace"
			ctx.fillStyle = P.binaryRain
			for (let row = 0; row < 14; row++) {
				let line = ""
				for (let col = 0; col < 42; col++) {
					line += rnd(row * 97 + col * 13 + t * 3) > 0.55 ? (rnd(col) > 0.5 ? "1" : "0") : " "
				}
				ctx.fillText(line, 8 + (row % 3) * 40, 14 + row * 11 + Math.sin(t + row) * 2)
			}
			ctx.restore()

			ctx.save()
			ctx.strokeStyle = P.gridLine
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
					ctx.fillStyle = P.gridDot
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
			ctx.strokeStyle = P.ghostStroke
			ctx.lineWidth = 2
			ctx.shadowColor = P.ghostGlow
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
			const trendUp = prices[prices.length - 1] >= prices[0]
			const areaStops = trendUp ? P.areaStopsUp : P.areaStopsDown
			const areaGrad = ctx.createLinearGradient(0, pad.t, 0, baseY)
			areaGrad.addColorStop(0, areaStops[0])
			areaGrad.addColorStop(0.28, areaStops[1])
			areaGrad.addColorStop(0.52, areaStops[2])
			areaGrad.addColorStop(0.78, areaStops[3])
			areaGrad.addColorStop(1, areaStops[4])
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
				ctx.strokeStyle = hr > 0.45 || rnd(i * 13) > 0.62 ? P.wickDashHot(hr) : P.wickDashBase
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
			lineGrad.addColorStop(0, P.lineGradStops[0])
			lineGrad.addColorStop(0.2, P.lineGradStops[1])
			lineGrad.addColorStop(0.45, P.lineGradStops[2])
			lineGrad.addColorStop(0.62, P.lineGradStops[3])
			lineGrad.addColorStop(0.8, P.lineGradStops[4])
			lineGrad.addColorStop(1, P.lineGradStops[5])

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = P.lineOuterStroke
			ctx.lineWidth = 12
			ctx.shadowColor = P.lineOuterGlow
			ctx.shadowBlur = 26
			ctx.stroke()
			ctx.shadowBlur = 0

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = P.lineMidStroke
			ctx.lineWidth = 4.5
			ctx.shadowColor = P.lineMidGlow
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
			ctx.shadowColor = P.lineMainGlow
			ctx.shadowBlur = 10
			ctx.stroke()
			ctx.shadowBlur = 0

			const nC = prices.length
			const segW = cw / Math.max(1, nC - 1)
			const bodyW = Math.min(16, Math.max(3.5, segW * 0.58))
			const wickW = Math.max(1.1, Math.min(2, bodyW * 0.16))
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
				ctx.strokeStyle = bear ? P.wickBear : P.wickBull
				ctx.lineWidth = wickW
				ctx.lineCap = "butt"
				ctx.stroke()

				const bg = ctx.createLinearGradient(x - bodyW * 0.5, top, x + bodyW * 0.5, bot)
				const stops = bear ? P.bearGrad : P.bullGrad
				bg.addColorStop(0, stops[0])
				bg.addColorStop(bear ? 0.55 : 0.45, stops[1])
				bg.addColorStop(1, stops[2])
				ctx.fillStyle = bg
				ctx.shadowColor = bear ? P.bearGlow : P.bullGlow
				ctx.shadowBlur = bear ? 10 : 8
				ctx.fillRect(x - bodyW * 0.5, top, bodyW, bodyH)
				ctx.shadowBlur = 0

				ctx.strokeStyle = bear ? P.bodyStrokeBear : P.bodyStrokeBull
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
			ctx.strokeStyle = lastDown ? P.lastPulseDown(0.14 + pulse * 0.24) : P.lastPulseUp(0.12 + pulse * 0.22)
			ctx.lineWidth = 1.5
			ctx.stroke()

			ctx.beginPath()
			ctx.arc(lx, ly, 4.2, 0, Math.PI * 2)
			ctx.fillStyle = lastDown ? P.lastDotDown : P.lastDotUp
			ctx.shadowColor = lastDown ? P.lastDotDownGlow : P.lastDotUpGlow
			ctx.shadowBlur = 22
			ctx.fill()
			ctx.shadowBlur = 0

			ctx.beginPath()
			ctx.arc(lx, ly, 1.6, 0, Math.PI * 2)
			ctx.fillStyle = P.lastDotCore
			ctx.fill()

			ctx.save()
			ctx.font = '300 11.5px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace'
			ctx.fillStyle = P.priceText
			ctx.shadowColor = P.priceShadow
			ctx.shadowBlur = 4
			ctx.fillText(`$ ${last.toFixed(2)}`, lx + 11, ly - 5)
			ctx.shadowBlur = 0
			ctx.restore()

			ctx.font = "11px ui-monospace, monospace"
			ctx.fillStyle = P.axisText
			ctx.textAlign = "right"
			for (let i = 0; i <= 4; i++) {
				const val = min + (max - min) * (i / 4)
				const y = pad.t + ch - (i / 4) * ch
				ctx.fillText("$" + val.toFixed(0), pad.l - 8, y + 4)
			}
			ctx.textAlign = "left"

			ctx.save()
			const scanGrad = ctx.createLinearGradient(0, scanY - 14, 0, scanY + 14)
			scanGrad.addColorStop(0, P.scanStops[0])
			scanGrad.addColorStop(0.35, P.scanStops[1])
			scanGrad.addColorStop(0.5, P.scanStops[2])
			scanGrad.addColorStop(0.65, P.scanStops[3])
			scanGrad.addColorStop(1, P.scanStops[4])
			ctx.fillStyle = scanGrad
			ctx.fillRect(pad.l, scanY - 16, cw, 32)
			ctx.restore()

			ctx.save()
			ctx.font = "10px ui-monospace, monospace"
			const tick = Math.floor(t * 8) % 1000
			const tickWarm = Math.sin(hudPhase * 1.3) > 0.25
			ctx.fillStyle = tickWarm
				? P.hudTextWarm(0.14 + 0.05 * Math.sin(hudPhase))
				: P.hudTextCool(0.12 + 0.06 * Math.sin(hudPhase))
			ctx.fillText(
				`▸ ${tick.toString().padStart(3, "0")}  ${(last * 1.0001).toFixed(4)}  ${(last * 0.9997).toFixed(4)}  VOL_SIM`,
				pad.l,
				h - 22
			)
			hudLines.forEach((line, i) => {
				ctx.fillStyle = P.hudTextBlue(0.06 + 0.04 * Math.sin(hudPhase + i))
				ctx.fillText(line, w - pad.r + 4, pad.t + 14 + i * 13)
			})
			if (Math.sin(t * 0.7) > 0.65) {
				ctx.fillStyle = P.streamOk
				ctx.fillText("STREAM_OK", w - pad.r + 4, pad.t + 14 + hudLines.length * 13)
			}
			ctx.restore()

			frameRef.current = requestAnimationFrame(draw)
		}

		draw(performance.now())

		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current)
			window.removeEventListener("resize", resize)
		}
	}, [])

	return (
		<div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#fafafa] dark:bg-black">
			<canvas ref={canvasRef} className="h-full w-full" />
		</div>
	)
}
