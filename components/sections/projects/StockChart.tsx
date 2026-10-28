"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"

type Candle = { o: number; h: number; l: number; c: number; v: number }

// Monochrome like the rest of the site, with a single amber accent (shared with the GeoSearch map)
// reserved for what the "AI" adds: the forecast and the live price.
type Palette = {
	ink: (alpha: number) => string
	accent: string
	accentInk: string
	tooltipBg: string
}

const DARK: Palette = {
	ink: (a) => `rgba(255, 255, 255, ${a})`,
	accent: "#fbbf24",
	accentInk: "#0a0a0a",
	tooltipBg: "rgba(12, 12, 14, 0.94)"
}

const LIGHT: Palette = {
	ink: (a) => `rgba(10, 10, 10, ${a})`,
	accent: "#d97706",
	accentInk: "#ffffff",
	tooltipBg: "rgba(255, 255, 255, 0.96)"
}

const CANDLE_MS = 1200
const FORECAST_STEPS = 8
const START_PRICE = 248
const MAX_HISTORY = 200

const randn = () => (Math.random() + Math.random() + Math.random() + Math.random() - 2) * 1.2

function emaSeries(values: number[], period: number) {
	const k = 2 / (period + 1)
	const out: number[] = []
	let prev = values[0]
	for (const v of values) {
		prev = v * k + prev * (1 - k)
		out.push(prev)
	}
	return out
}

function niceStep(range: number, targetLines: number) {
	const raw = range / targetLines
	const mag = Math.pow(10, Math.floor(Math.log10(raw)))
	for (const m of [1, 2, 2.5, 5, 10]) if (m * mag >= raw) return m * mag
	return 10 * mag
}

function hexAlpha(hex: string, alpha: number) {
	const n = parseInt(hex.slice(1), 16)
	return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

export default function StockChart() {
	const t = useTranslations("projects.stockChart")
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const priceRef = useRef<HTMLSpanElement | null>(null)
	const changeRef = useRef<HTMLSpanElement | null>(null)
	const paletteRef = useRef<Palette>(DARK)
	const redrawRef = useRef<(() => void) | null>(null)
	const { resolvedTheme } = useTheme()

	useEffect(() => {
		paletteRef.current = resolvedTheme === "light" ? LIGHT : DARK
		redrawRef.current?.()
	}, [resolvedTheme])

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext("2d")
		if (!canvas || !ctx) return
		const parent = canvas.parentElement!
		const fontFamily = getComputedStyle(document.body).fontFamily || "ui-monospace, monospace"
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

		let cssW = 0
		let cssH = 0
		const resize = () => {
			cssW = parent.clientWidth
			cssH = parent.clientHeight
			const dpr = Math.min(window.devicePixelRatio || 1, cssW < 640 ? 1.5 : 2)
			canvas.width = Math.round(cssW * dpr)
			canvas.height = Math.round(cssH * dpr)
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}
		resize()
		// Resizing clears the canvas, so always repaint afterwards (matters when the loop is not running).
		const resizeObserver = new ResizeObserver(() => {
			resize()
			requestDraw()
		})
		resizeObserver.observe(parent)

		// --- Market simulation: a random walk that switches between trending regimes -------------
		let drift = 0
		let vol = 1
		let regimeLeft = 0
		const nextRegime = () => {
			drift = (Math.random() - 0.47) * 0.9
			vol = 0.6 + Math.random() * 0.9
			regimeLeft = 12 + Math.floor(Math.random() * 18)
		}
		const tick = (candle: Candle, fraction: number) => {
			if (!(fraction > 0)) return
			const meanRevert = (START_PRICE - candle.c) * 0.012
			const move = (drift + meanRevert) * fraction + vol * Math.sqrt(fraction) * randn() * 1.3
			candle.c += move
			candle.h = Math.max(candle.h, candle.c)
			candle.l = Math.min(candle.l, candle.c)
			candle.v += (Math.abs(move) * 30 + Math.random() * 4) * fraction * 10
		}
		const openCandle = (price: number): Candle => ({ o: price, h: price, l: price, c: price, v: 0 })

		const candles: Candle[] = []
		nextRegime()
		let last = START_PRICE
		for (let i = 0; i < 140; i++) {
			const candle = openCandle(last)
			for (let s = 0; s < 10; s++) tick(candle, 0.1)
			candles.push(candle)
			last = candle.c
			if (--regimeLeft <= 0) nextRegime()
		}
		candles.push(openCandle(last))
		const sessionOpen = candles[candles.length - 60].o

		let candleElapsed = 0
		let yMin = 0
		let yMax = 0
		let forecastSlope = 0
		let lastTs = 0
		let lastHeaderUpdate = 0
		let pointer: { x: number; y: number } | null = null

		const onPointerMove = (e: PointerEvent) => {
			if (e.pointerType === "touch") return
			const rect = canvas.getBoundingClientRect()
			pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top }
			requestDraw()
		}
		const onPointerLeave = () => {
			pointer = null
			requestDraw()
		}
		canvas.addEventListener("pointermove", onPointerMove)
		canvas.addEventListener("pointerleave", onPointerLeave)

		const updateHeader = (price: number) => {
			const change = ((price - sessionOpen) / sessionOpen) * 100
			if (priceRef.current) priceRef.current.textContent = price.toFixed(2)
			if (changeRef.current) {
				changeRef.current.textContent = `${change >= 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(2)}%`
			}
		}

		const draw = (ts: number) => {
			frame = 0
			const P = paletteRef.current
			// rAF timestamps can be slightly earlier than the performance.now() of the first call — never go negative.
			const dtMs = lastTs ? Math.max(0, Math.min(64, ts - lastTs)) : 16
			lastTs = ts
			const dt = dtMs / 1000

			// Advance the live candle; roll over to a new one every CANDLE_MS.
			if (!reduceMotion) {
				const live = candles[candles.length - 1]
				tick(live, dtMs / CANDLE_MS)
				candleElapsed += dtMs
				if (candleElapsed >= CANDLE_MS) {
					candleElapsed -= CANDLE_MS
					candles.push(openCandle(live.c))
					if (candles.length > MAX_HISTORY) candles.shift()
					if (--regimeLeft <= 0) nextRegime()
				}
			}
			const progress = reduceMotion ? 0 : candleElapsed / CANDLE_MS

			// --- Layout -------------------------------------------------------------------------
			const narrow = cssW < 420
			const axisW = narrow ? 44 : 54
			const padL = 0
			const priceTop = narrow ? 64 : 68
			const padB = 6
			const plotR = cssW - axisW
			const volH = Math.round((cssH - priceTop) * 0.1)
			const volBase = cssH - padB
			const priceBottom = volBase - volH - 14
			const slot = narrow ? 8 : 9
			const bodyW = Math.max(3, Math.round(slot * 0.6))
			const liveX = plotR - slot * (FORECAST_STEPS + 1)
			const visibleCount = Math.min(candles.length, Math.ceil((liveX - padL) / slot) + 2)
			const visible = candles.slice(candles.length - visibleCount)
			const xOf = (i: number) => liveX - (visible.length - 1 - i + progress) * slot

			const closes = candles.map((c) => c.c)
			const emaAll = emaSeries(closes, 21)
			const ema = emaAll.slice(emaAll.length - visibleCount)
			const liveCandle = visible[visible.length - 1]

			// Forecast: damped momentum, eased so it does not jitter, capped so it never shoots off.
			const avgRange =
				visible.slice(-20).reduce((sum, c) => sum + (c.h - c.l), 0) / Math.min(20, visible.length) || 1
			const momentum = (liveCandle.c - ema[ema.length - 1]) * 0.12 + drift * 0.5
			const targetSlope = Math.max(-avgRange * 0.45, Math.min(avgRange * 0.45, momentum))
			forecastSlope += (targetSlope - forecastSlope) * Math.min(1, dt * 1.2)
			const forecast = Array.from({ length: FORECAST_STEPS + 1 }, (_, k) => {
				const mid = liveCandle.c + forecastSlope * k * (1 - k / (FORECAST_STEPS * 2.5))
				const spread = avgRange * 0.32 * Math.sqrt(k)
				return { mid, lo: mid - spread, hi: mid + spread }
			})

			// Scale on candles + forecast midline (not the band) so price action uses the full height.
			let tMin = Infinity
			let tMax = -Infinity
			for (const c of visible) {
				tMin = Math.min(tMin, c.l)
				tMax = Math.max(tMax, c.h)
			}
			for (const f of forecast) {
				tMin = Math.min(tMin, f.mid)
				tMax = Math.max(tMax, f.mid)
			}
			const margin = (tMax - tMin) * 0.06 || 1
			tMin -= margin
			tMax += margin
			if (!yMax || reduceMotion) {
				yMin = tMin
				yMax = tMax
			} else {
				const k = Math.min(1, dt * 2.5)
				yMin += (tMin - yMin) * k
				yMax += (tMax - yMax) * k
			}
			const yOf = (p: number) => priceBottom - ((p - yMin) / (yMax - yMin)) * (priceBottom - priceTop)
			const crisp = (v: number) => Math.round(v) + 0.5

			ctx.clearRect(0, 0, cssW, cssH)
			ctx.font = `${narrow ? 10 : 10.5}px ${fontFamily}`
			ctx.textBaseline = "middle"
			ctx.lineWidth = 1

			// --- Grid + price axis ---------------------------------------------------------------
			const step = niceStep(yMax - yMin, narrow ? 3 : 4)
			const tagY = yOf(candles[candles.length - 1].c)
			ctx.textAlign = "left"
			for (let v = Math.ceil(yMin / step) * step; v <= yMax; v += step) {
				const y = crisp(yOf(v))
				if (y < priceTop || y > priceBottom) continue
				ctx.strokeStyle = P.ink(0.06)
				ctx.beginPath()
				ctx.moveTo(padL, y)
				ctx.lineTo(plotR, y)
				ctx.stroke()
				// Skip axis labels hidden behind the live price tag.
				if (Math.abs(y - tagY) < 14) continue
				ctx.fillStyle = P.ink(0.38)
				ctx.fillText(v.toFixed(step < 1 ? 1 : 0), plotR + 10, y)
			}
			// Hairline separating price and volume panes
			ctx.strokeStyle = P.ink(0.08)
			ctx.beginPath()
			ctx.moveTo(padL, crisp(volBase - volH - 7))
			ctx.lineTo(plotR, crisp(volBase - volH - 7))
			ctx.stroke()

			ctx.save()
			ctx.beginPath()
			ctx.rect(padL, 0, plotR - padL, cssH)
			ctx.clip()

			// --- Volume -------------------------------------------------------------------------
			const maxVol = Math.max(...visible.map((c) => c.v), 1)
			visible.forEach((c, i) => {
				const h = Math.max(1, (c.v / maxVol) * volH)
				const isLive = i === visible.length - 1
				ctx.fillStyle = isLive ? hexAlpha(P.accent, 0.5) : P.ink(c.c >= c.o ? 0.16 : 0.1)
				ctx.fillRect(Math.round(xOf(i) - bodyW / 2), volBase - h, bodyW, h)
			})

			// --- EMA 21 -------------------------------------------------------------------------
			ctx.strokeStyle = P.ink(0.3)
			ctx.lineWidth = 1.25
			ctx.lineJoin = "round"
			ctx.beginPath()
			ema.forEach((v, i) => {
				const x = xOf(i)
				const y = yOf(v)
				if (i === 0) ctx.moveTo(x, y)
				else {
					const px = xOf(i - 1)
					const py = yOf(ema[i - 1])
					ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2)
				}
			})
			ctx.lineTo(xOf(ema.length - 1), yOf(ema[ema.length - 1]))
			ctx.stroke()
			ctx.lineWidth = 1

			// --- Candles: hollow = up, filled = down ---------------------------------------------
			visible.forEach((c, i) => {
				const isLive = i === visible.length - 1
				const x = Math.round(xOf(i))
				const up = c.c >= c.o
				const top = Math.round(yOf(Math.max(c.o, c.c)))
				const bottom = Math.round(yOf(Math.min(c.o, c.c)))
				const height = Math.max(1, bottom - top)
				const left = x - Math.floor(bodyW / 2)
				const color = isLive ? P.accent : P.ink(up ? 0.85 : 0.42)

				ctx.strokeStyle = color
				ctx.beginPath()
				ctx.moveTo(x + 0.5, Math.round(yOf(c.h)))
				ctx.lineTo(x + 0.5, top)
				ctx.moveTo(x + 0.5, top + height)
				ctx.lineTo(x + 0.5, Math.round(yOf(c.l)))
				ctx.stroke()

				if (up && height > 2) {
					ctx.strokeRect(left + 0.5, top + 0.5, bodyW - 1, height - 1)
				} else {
					ctx.fillStyle = color
					ctx.fillRect(left, top, bodyW, height)
				}
			})

			// --- Forecast: soft band + dotted path in the accent colour ------------------------
			const fx = (k: number) => liveX + k * slot
			const band = ctx.createLinearGradient(liveX, 0, fx(FORECAST_STEPS), 0)
			band.addColorStop(0, hexAlpha(P.accent, 0.16))
			band.addColorStop(1, hexAlpha(P.accent, 0.02))
			ctx.fillStyle = band
			ctx.beginPath()
			forecast.forEach((f, k) => (k === 0 ? ctx.moveTo(fx(k), yOf(f.hi)) : ctx.lineTo(fx(k), yOf(f.hi))))
			for (let k = FORECAST_STEPS; k >= 0; k--) ctx.lineTo(fx(k), yOf(forecast[k].lo))
			ctx.closePath()
			ctx.fill()
			ctx.fillStyle = P.accent
			forecast.forEach((f, k) => {
				if (k === 0) return
				ctx.globalAlpha = 1 - (k / FORECAST_STEPS) * 0.65
				ctx.beginPath()
				ctx.arc(fx(k), yOf(f.mid), 1.4, 0, Math.PI * 2)
				ctx.fill()
			})
			ctx.globalAlpha = 1
			ctx.restore()

			// --- Live price line + tag ----------------------------------------------------------
			const lastPrice = liveCandle.c
			const ly = crisp(yOf(lastPrice))
			ctx.strokeStyle = hexAlpha(P.accent, 0.45)
			ctx.setLineDash([1, 3])
			ctx.beginPath()
			ctx.moveTo(padL, ly)
			ctx.lineTo(plotR, ly)
			ctx.stroke()
			ctx.setLineDash([])
			ctx.fillStyle = P.accent
			ctx.beginPath()
			ctx.roundRect(plotR + 3, ly - 9, axisW - 5, 18, 3)
			ctx.fill()
			ctx.fillStyle = P.accentInk
			ctx.textAlign = "center"
			ctx.fillText(lastPrice.toFixed(2), plotR + 3 + (axisW - 5) / 2, ly + 0.5)

			// --- Crosshair (mouse only) ---------------------------------------------------------
			if (pointer && pointer.x > padL && pointer.x < plotR && pointer.y > priceTop && pointer.y < cssH - padB) {
				const idx = Math.round(visible.length - 1 - progress - (liveX - pointer.x) / slot)
				const candle = visible[idx]
				const cx = candle ? crisp(xOf(idx)) : pointer.x
				ctx.strokeStyle = P.ink(0.25)
				ctx.setLineDash([2, 3])
				ctx.beginPath()
				ctx.moveTo(padL, crisp(pointer.y))
				ctx.lineTo(plotR, crisp(pointer.y))
				ctx.moveTo(cx, priceTop)
				ctx.lineTo(cx, cssH - padB)
				ctx.stroke()
				ctx.setLineDash([])
				if (candle) {
					const rows: [string, number][] = [
						["O", candle.o],
						["H", candle.h],
						["L", candle.l],
						["C", candle.c]
					]
					const boxW = 86
					const boxH = 66
					const bx = cx + 10 + boxW > plotR ? cx - 10 - boxW : cx + 10
					const by = Math.min(Math.max(priceTop, pointer.y - boxH / 2), cssH - padB - boxH)
					ctx.fillStyle = P.tooltipBg
					ctx.strokeStyle = P.ink(0.12)
					ctx.beginPath()
					ctx.roundRect(bx + 0.5, by + 0.5, boxW, boxH, 4)
					ctx.fill()
					ctx.stroke()
					ctx.textAlign = "left"
					rows.forEach(([label, value], r) => {
						ctx.fillStyle = P.ink(0.4)
						ctx.fillText(label, bx + 10, by + 13 + r * 13.5)
						ctx.fillStyle = P.ink(0.9)
						ctx.fillText(value.toFixed(2), bx + 26, by + 13 + r * 13.5)
					})
				}
			}

			if (ts - lastHeaderUpdate > 300 || !lastHeaderUpdate) {
				lastHeaderUpdate = ts
				updateHeader(lastPrice)
			}

			if (isVisible && !reduceMotion) frame = requestAnimationFrame(draw)
		}

		// Animate only while on screen. With reduced motion a single static frame is painted on demand.
		let frame = 0
		let isVisible = true
		function requestDraw() {
			if (!frame) frame = requestAnimationFrame(draw)
		}
		redrawRef.current = requestDraw
		const visibilityObserver = new IntersectionObserver(([entry]) => {
			isVisible = entry.isIntersecting
			if (isVisible && !frame) {
				lastTs = 0
				frame = requestAnimationFrame(draw)
			}
		})
		visibilityObserver.observe(canvas)
		draw(performance.now())

		return () => {
			redrawRef.current = null
			cancelAnimationFrame(frame)
			visibilityObserver.disconnect()
			resizeObserver.disconnect()
			canvas.removeEventListener("pointermove", onPointerMove)
			canvas.removeEventListener("pointerleave", onPointerLeave)
		}
	}, [])

	return (
		<div className="relative h-full w-full overflow-hidden rounded-xl bg-[#fafafa] ring-1 ring-black/5 dark:bg-[#0b0b0d] dark:ring-white/8">
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

			<div className="pointer-events-none absolute inset-x-4 top-3 flex items-start justify-between gap-3">
				<div className="min-w-0">
					<div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">ANLT / PLN</div>
					<div className="mt-1 flex items-baseline gap-2.5">
						<span
							ref={priceRef}
							className="text-xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50"
						/>
						<span ref={changeRef} className="text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400" />
					</div>
				</div>

				<div className="flex flex-col items-end gap-1 pt-0.5 text-[10px] text-zinc-500">
					<span className="flex items-center gap-1.5">
						<span className="h-px w-3 bg-zinc-400 dark:bg-zinc-500" />
						EMA 21
					</span>
					<span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
						<span className="w-3 border-t border-dotted border-current" />
						{t("forecast")}
					</span>
					<span className="hidden text-zinc-400 sm:inline dark:text-zinc-600">{t("simulated")}</span>
				</div>
			</div>
		</div>
	)
}
