"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { FACE_EDGES, FACE_GROUPS, FACE_VERTICES } from "./faceMeshData"

const EMOTIONS = ["joy", "surprise", "neutral", "sadness", "anger"] as const
type Emotion = (typeof EMOTIONS)[number]

const CYCLE_MS = 3400
// Below this container width the scores move from a side panel to a strip at the bottom.
const SIDE_PANEL_MIN_WIDTH = 440
const VERTEX_COUNT = FACE_VERTICES.length / 3

// Expressions as soft displacements around MediaPipe landmarks.
// `out` moves horizontally away from the face centre (negative = towards it); radius is in face units (height = 2).
type Anchor = { i: number; out?: number; dy?: number; dz?: number; r: number }
const EXPRESSIONS: Record<Emotion, Anchor[]> = {
	neutral: [],
	joy: [
		{ i: 61, out: 0.035, dy: 0.075, r: 0.13 },
		{ i: 291, out: 0.035, dy: 0.075, r: 0.13 },
		{ i: 14, dy: -0.025, r: 0.09 },
		{ i: 50, dy: 0.03, r: 0.15 },
		{ i: 280, dy: 0.03, r: 0.15 },
		{ i: 145, dy: 0.018, r: 0.06 },
		{ i: 374, dy: 0.018, r: 0.06 }
	],
	surprise: [
		{ i: 14, dy: -0.14, r: 0.16 },
		{ i: 152, dy: -0.1, r: 0.45 },
		{ i: 13, dy: 0.015, r: 0.07 },
		{ i: 61, out: -0.02, r: 0.08 },
		{ i: 291, out: -0.02, r: 0.08 },
		{ i: 105, dy: 0.075, r: 0.17 },
		{ i: 334, dy: 0.075, r: 0.17 },
		{ i: 159, dy: 0.022, r: 0.05 },
		{ i: 386, dy: 0.022, r: 0.05 }
	],
	sadness: [
		{ i: 61, out: -0.01, dy: -0.055, r: 0.1 },
		{ i: 291, out: -0.01, dy: -0.055, r: 0.1 },
		{ i: 107, dy: 0.05, r: 0.09 },
		{ i: 336, dy: 0.05, r: 0.09 },
		{ i: 70, dy: -0.025, r: 0.1 },
		{ i: 300, dy: -0.025, r: 0.1 },
		{ i: 159, dy: -0.012, r: 0.05 },
		{ i: 386, dy: -0.012, r: 0.05 }
	],
	anger: [
		{ i: 107, out: -0.03, dy: -0.055, r: 0.1 },
		{ i: 336, out: -0.03, dy: -0.055, r: 0.1 },
		{ i: 105, dy: -0.03, r: 0.12 },
		{ i: 334, dy: -0.03, r: 0.12 },
		{ i: 13, dy: -0.015, r: 0.07 },
		{ i: 14, dy: 0.025, r: 0.07 },
		{ i: 61, out: -0.012, dy: -0.018, r: 0.08 },
		{ i: 291, out: -0.012, dy: -0.018, r: 0.08 },
		{ i: 145, dy: 0.012, r: 0.05 },
		{ i: 374, dy: 0.012, r: 0.05 }
	]
}

function buildDisplacements() {
	const result = {} as Record<Emotion, Float32Array>
	for (const emotion of EMOTIONS) {
		const d = new Float32Array(FACE_VERTICES.length)
		for (const a of EXPRESSIONS[emotion]) {
			const ax = FACE_VERTICES[a.i * 3]
			const ay = FACE_VERTICES[a.i * 3 + 1]
			const az = FACE_VERTICES[a.i * 3 + 2]
			const side = Math.sign(ax) || 0
			for (let v = 0; v < VERTEX_COUNT; v++) {
				const dx = FACE_VERTICES[v * 3] - ax
				const dy = FACE_VERTICES[v * 3 + 1] - ay
				const dz = FACE_VERTICES[v * 3 + 2] - az
				const w = Math.exp(-(dx * dx + dy * dy + dz * dz) / (a.r * a.r))
				if (w < 0.001) continue
				d[v * 3] += w * (a.out ?? 0) * side
				d[v * 3 + 1] += w * (a.dy ?? 0)
				d[v * 3 + 2] += w * (a.dz ?? 0)
			}
		}
		result[emotion] = d
	}
	return result
}

function randomScores(top: Emotion): Record<Emotion, number> {
	const main = 74 + Math.round(Math.random() * 20)
	const others = EMOTIONS.filter((e) => e !== top)
	const weights = others.map(() => Math.random() + 0.15)
	const sum = weights.reduce((a, b) => a + b, 0)
	const scores = { [top]: main } as Record<Emotion, number>
	let left = 100 - main
	others.forEach((e, i) => {
		const value = i === others.length - 1 ? left : Math.round(((100 - main) * weights[i]) / sum)
		scores[e] = Math.max(0, value)
		left -= value
	})
	return scores
}

type Palette = { ink: (a: number) => string; accent: string; accent2: string; labelInk: string }
const DARK: Palette = { ink: (a) => `rgba(255,255,255,${a})`, accent: "#a78bfa", accent2: "#60a5fa", labelInk: "#0b0b0d" }
const LIGHT: Palette = { ink: (a) => `rgba(10,10,10,${a})`, accent: "#7c3aed", accent2: "#2563eb", labelInk: "#ffffff" }

export default function EmotionFace() {
	const t = useTranslations("projects.emotionAI")
	const rootRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const inView = useInView(rootRef, { amount: 0.25 })
	const { resolvedTheme } = useTheme()
	const paletteRef = useRef<Palette>(DARK)
	const redrawRef = useRef<(() => void) | null>(null)
	const [wide, setWide] = useState(true)
	const [emotion, setEmotion] = useState<Emotion>("joy")
	const [scores, setScores] = useState<Record<Emotion, number>>({
		joy: 86,
		surprise: 6,
		neutral: 5,
		sadness: 2,
		anger: 1
	})
	const emotionRef = useRef<Emotion>("joy")
	const labelRef = useRef("")
	const wideRef = useRef(true)

	useEffect(() => {
		paletteRef.current = resolvedTheme === "light" ? LIGHT : DARK
		redrawRef.current?.()
	}, [resolvedTheme])

	useEffect(() => {
		const el = rootRef.current
		if (!el) return
		const ro = new ResizeObserver(([entry]) => {
			const next = entry.contentRect.width >= SIDE_PANEL_MIN_WIDTH
			wideRef.current = next
			setWide(next)
		})
		ro.observe(el)
		return () => ro.disconnect()
	}, [])

	// Cycle through emotions while visible.
	useEffect(() => {
		if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
		let index = EMOTIONS.indexOf(emotionRef.current)
		const id = setInterval(() => {
			index = (index + 1) % EMOTIONS.length
			const next = EMOTIONS[index]
			setEmotion(next)
			setScores(randomScores(next))
		}, CYCLE_MS)
		return () => clearInterval(id)
	}, [inView])

	useEffect(() => {
		const canvas = canvasRef.current
		const ctx = canvas?.getContext("2d")
		if (!canvas || !ctx) return
		const parent = canvas.parentElement!
		const fontFamily = getComputedStyle(document.body).fontFamily || "ui-monospace, monospace"
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		const displacements = buildDisplacements()

		const isFeature = new Uint8Array(VERTEX_COUNT)
		for (const group of [FACE_GROUPS.lips, FACE_GROUPS.eyes, FACE_GROUPS.brows]) for (const i of group) isFeature[i] = 1
		const isOval = new Uint8Array(VERTEX_COUNT)
		for (const i of FACE_GROUPS.oval) isOval[i] = 1

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
		const resizeObserver = new ResizeObserver(() => {
			resize()
			requestDraw()
		})
		resizeObserver.observe(parent)

		const weights: Record<Emotion, number> = { joy: 1, surprise: 0, neutral: 0, sadness: 0, anger: 0 }
		const sx = new Float32Array(VERTEX_COUNT)
		const sy = new Float32Array(VERTEX_COUNT)
		const sz = new Float32Array(VERTEX_COUNT)
		const ALPHA_BUCKETS = 4
		let time = 0
		let lastTs = 0

		const draw = (ts: number) => {
			frame = 0
			const P = paletteRef.current
			const dtMs = lastTs ? Math.max(0, Math.min(64, ts - lastTs)) : 16
			lastTs = ts
			const dt = dtMs / 1000
			if (!reduceMotion) time += dt

			// Ease the expression towards the current emotion.
			const target = emotionRef.current
			for (const e of EMOTIONS) {
				const goal = e === target ? 1 : 0
				weights[e] = reduceMotion ? goal : weights[e] + (goal - weights[e]) * Math.min(1, dt * 5)
			}

			const isWide = wideRef.current
			const faceCx = isWide ? cssW * 0.33 : cssW / 2
			const faceCy = isWide ? cssH * 0.5 : cssH * 0.39
			const areaW = isWide ? cssW * 0.58 : cssW
			const areaH = isWide ? cssH : cssH * 0.72
			const scale = Math.min(areaW * 0.46, areaH * 0.35)

			const yaw = reduceMotion ? -0.35 : Math.sin(time * 0.45) * 0.55
			const pitch = reduceMotion ? 0.05 : Math.sin(time * 0.31) * 0.1 + 0.04
			const cy = Math.cos(yaw)
			const syaw = Math.sin(yaw)
			const cp = Math.cos(pitch)
			const sp = Math.sin(pitch)
			const camera = 4.2

			let minX = Infinity
			let maxX = -Infinity
			let minY = Infinity
			let maxY = -Infinity
			for (let v = 0; v < VERTEX_COUNT; v++) {
				let x = FACE_VERTICES[v * 3]
				let y = FACE_VERTICES[v * 3 + 1]
				let z = FACE_VERTICES[v * 3 + 2]
				for (const e of EMOTIONS) {
					const w = weights[e]
					if (w < 0.002) continue
					const d = displacements[e]
					x += d[v * 3] * w
					y += d[v * 3 + 1] * w
					z += d[v * 3 + 2] * w
				}
				const x1 = x * cy + z * syaw
				const z1 = -x * syaw + z * cy
				const y2 = y * cp - z1 * sp
				const z2 = y * sp + z1 * cp
				const f = camera / (camera - z2)
				sx[v] = faceCx + x1 * f * scale
				sy[v] = faceCy - y2 * f * scale
				sz[v] = z2
				minX = Math.min(minX, sx[v])
				maxX = Math.max(maxX, sx[v])
				minY = Math.min(minY, sy[v])
				maxY = Math.max(maxY, sy[v])
			}

			ctx.clearRect(0, 0, cssW, cssH)

			// Soft glow behind the face
			const glow = ctx.createRadialGradient(faceCx, faceCy, 0, faceCx, faceCy, scale * 1.3)
			glow.addColorStop(0, `${P.accent}22`)
			glow.addColorStop(1, `${P.accent}00`)
			ctx.fillStyle = glow
			ctx.fillRect(0, 0, cssW, cssH)

			// Mesh: depth-sorted into a few alpha buckets so it is drawn with only a handful of strokes.
			const depthAlpha = (z: number) => Math.max(0, Math.min(1, (z + 0.6) / 1.2))
			ctx.lineWidth = 0.6
			for (let b = 0; b < ALPHA_BUCKETS; b++) {
				ctx.beginPath()
				for (let e = 0; e < FACE_EDGES.length; e += 2) {
					const a = FACE_EDGES[e]
					const c = FACE_EDGES[e + 1]
					if (isFeature[a] && isFeature[c]) continue
					const bucket = Math.min(ALPHA_BUCKETS - 1, Math.floor(depthAlpha((sz[a] + sz[c]) / 2) * ALPHA_BUCKETS))
					if (bucket !== b) continue
					ctx.moveTo(sx[a], sy[a])
					ctx.lineTo(sx[c], sy[c])
				}
				ctx.strokeStyle = P.ink(0.05 + b * 0.07)
				ctx.stroke()
			}

			// Facial features in the accent colour
			const accentGradient = ctx.createLinearGradient(minX, 0, maxX, 0)
			accentGradient.addColorStop(0, P.accent2)
			accentGradient.addColorStop(1, P.accent)
			ctx.strokeStyle = accentGradient
			ctx.lineWidth = 1.1
			ctx.globalAlpha = 0.85
			ctx.beginPath()
			for (let e = 0; e < FACE_EDGES.length; e += 2) {
				const a = FACE_EDGES[e]
				const c = FACE_EDGES[e + 1]
				if (!(isFeature[a] && isFeature[c])) continue
				ctx.moveTo(sx[a], sy[a])
				ctx.lineTo(sx[c], sy[c])
			}
			ctx.stroke()
			ctx.globalAlpha = 1

			// Landmark points; a horizontal scan line lights them up as it passes.
			const scanY = minY + (((time * 0.35) % 1.25) / 1.25) * (maxY - minY + 40) - 20
			for (let v = 0; v < VERTEX_COUNT; v++) {
				const depth = depthAlpha(sz[v])
				const near = Math.abs(sy[v] - scanY) < 10
				const feature = isFeature[v] || isOval[v]
				if (near) {
					ctx.fillStyle = P.accent
					ctx.globalAlpha = 0.95
				} else {
					ctx.fillStyle = feature ? P.accent : P.ink(1)
					ctx.globalAlpha = feature ? 0.35 + depth * 0.55 : 0.12 + depth * 0.5
				}
				const r = (near ? 1.6 : 0.7) + depth * 0.8
				ctx.fillRect(sx[v] - r / 2, sy[v] - r / 2, r, r)
			}
			ctx.globalAlpha = 1
			if (!reduceMotion && scanY > minY && scanY < maxY) {
				const band = ctx.createLinearGradient(0, scanY - 16, 0, scanY + 16)
				band.addColorStop(0, `${P.accent}00`)
				band.addColorStop(0.5, `${P.accent}26`)
				band.addColorStop(1, `${P.accent}00`)
				ctx.fillStyle = band
				ctx.fillRect(minX - 18, scanY - 16, maxX - minX + 36, 32)
			}

			// Detection box with corner brackets + label
			const pad = 14
			const bx0 = minX - pad
			const by0 = minY - pad
			const bx1 = maxX + pad
			const by1 = maxY + pad
			const corner = Math.min(18, (bx1 - bx0) * 0.15)
			ctx.strokeStyle = P.accent
			ctx.lineWidth = 1.5
			ctx.beginPath()
			for (const [x, y, dx, dy] of [
				[bx0, by0, 1, 1],
				[bx1, by0, -1, 1],
				[bx0, by1, 1, -1],
				[bx1, by1, -1, -1]
			]) {
				ctx.moveTo(x, y + dy * corner)
				ctx.lineTo(x, y)
				ctx.lineTo(x + dx * corner, y)
			}
			ctx.stroke()

			ctx.font = `600 10.5px ${fontFamily}`
			ctx.textBaseline = "middle"
			const label = labelRef.current
			const lw = ctx.measureText(label).width + 14
			const lx = Math.max(4, Math.min(bx0, cssW - lw - 4))
			const ly = Math.max(4, by0 - 24)
			ctx.fillStyle = P.accent
			ctx.beginPath()
			ctx.roundRect(lx, ly, lw, 18, 3)
			ctx.fill()
			ctx.fillStyle = P.labelInk
			ctx.textAlign = "left"
			ctx.fillText(label, lx + 7, ly + 9.5)

			if (isVisible && !reduceMotion) frame = requestAnimationFrame(draw)
		}

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
		}
	}, [])

	// Hand the current emotion to the canvas loop; also repaints the static frame under reduced motion.
	useEffect(() => {
		emotionRef.current = emotion
		labelRef.current = `${t(`emotions.${emotion}`)} ${scores[emotion]}%`
		redrawRef.current?.()
	}, [emotion, scores, wide, t])

	return (
		<div
			ref={rootRef}
			className="relative h-full w-full overflow-hidden rounded-xl bg-[#fafafa] ring-1 ring-black/5 dark:bg-[#0b0b0d] dark:ring-white/8"
		>
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

			{wide && (
				<div className="pointer-events-none absolute bottom-3 left-4 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
					{t("landmarks")}
				</div>
			)}

			<div
				className={
					wide
						? "pointer-events-none absolute right-4 top-1/2 flex w-[36%] -translate-y-1/2 flex-col gap-3"
						: "pointer-events-none absolute inset-x-4 bottom-3 flex flex-col gap-2"
				}
				aria-live="polite"
			>
				<div className={wide ? "" : "flex items-baseline justify-between gap-2"}>
					<div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{t("detected")}</div>
					<div className="mt-0.5 text-lg font-semibold tracking-tight text-violet-700 sm:text-xl dark:text-violet-300">
						{t(`emotions.${emotion}`)}
					</div>
				</div>
				<ul className={wide ? "flex flex-col gap-2" : "grid grid-cols-5 gap-2"}>
					{EMOTIONS.map((e) => {
						const active = e === emotion
						return (
							<li key={e} className="min-w-0">
								<div className="flex items-baseline justify-between gap-1 text-[10px]">
									<span
										className={`truncate ${active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"}`}
									>
										{t(`emotions.${e}`)}
									</span>
									{wide && (
										<span className="tabular-nums text-zinc-500 dark:text-zinc-400">{scores[e]}%</span>
									)}
								</div>
								<div className="mt-1 h-1 overflow-hidden rounded-full bg-black/6 dark:bg-white/8">
									<div
										className={`h-full rounded-full transition-[width] duration-700 ease-out ${
											active
												? "bg-linear-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400"
												: "bg-zinc-400/60 dark:bg-zinc-600"
										}`}
										style={{ width: `${scores[e]}%` }}
									/>
								</div>
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}
