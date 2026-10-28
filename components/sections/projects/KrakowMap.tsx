"use client"

import { useEffect, useRef, useState } from "react"
import { DISTRICTS, HOT_DISTRICT, MAP_HEIGHT, MAP_WIDTH, PARCEL_BOX, PARCELS, type MapBox } from "./krakowMapData"

export type MapPhase = "overview" | "searching" | "district" | "parcel"

type ViewBox = { x: number; y: number; w: number; h: number }
// Fractions of the container covered by UI overlays, so the focus stays in the free area.
type Insets = { top: number; right: number; bottom: number; left: number }

const HOT = DISTRICTS.find((d) => d.id === HOT_DISTRICT)!
const FULL_BOX: MapBox = [0, 0, MAP_WIDTH, MAP_HEIGHT]
const TWEEN_MS: Record<MapPhase, number> = { overview: 1100, searching: 600, district: 1300, parcel: 1500 }

// Stylised context around the parcels (≈30 m per unit): an access road south of the plots.
const ROAD = "M186.6 243.25L189.4 244.1L191.9 244.9L194.6 245.75"

function grow([x0, y0, x1, y1]: MapBox, k: number): MapBox {
	const mx = (x1 - x0) * k
	const my = (y1 - y0) * k
	return [x0 - mx, y0 - my, x1 + mx, y1 + my]
}

// Smallest viewBox matching the container aspect that shows `box` inside the area left free by `insets`.
function fitBox([x0, y0, x1, y1]: MapBox, aspect: number, insets: Insets): ViewBox {
	const fw = Math.max(0.2, 1 - insets.left - insets.right)
	const fh = Math.max(0.2, 1 - insets.top - insets.bottom)
	const bw = x1 - x0
	const bh = y1 - y0
	const w = Math.max(bw / fw, (bh * aspect) / fh)
	const h = w / aspect
	return {
		x: (x0 + x1) / 2 - w * (insets.left + fw / 2),
		y: (y0 + y1) / 2 - h * (insets.top + fh / 2),
		w,
		h
	}
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type Props = {
	phase: MapPhase
	/** Results panel placement in the parcel phase. */
	panel: "right" | "bottom"
	/** Height reserved at the top for the search bar, in px. */
	topOffset?: number
}

export default function KrakowMap({ phase, panel, topOffset = 56 }: Props) {
	const rootRef = useRef<HTMLDivElement>(null)
	const [size, setSize] = useState({ w: 0, h: 0 })
	const [vb, setVb] = useState<ViewBox>({ x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT })
	const vbRef = useRef(vb)

	useEffect(() => {
		const el = rootRef.current
		if (!el) return
		const ro = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect
			setSize({ w: Math.round(width), h: Math.round(height) })
		})
		ro.observe(el)
		return () => ro.disconnect()
	}, [])

	useEffect(() => {
		if (!size.w || !size.h) return
		const aspect = size.w / size.h
		const top = Math.min(0.35, topOffset / size.h)
		const base: Insets = { top, right: 0.03, bottom: 0.08, left: 0.03 }

		let target: ViewBox
		if (phase === "parcel") {
			const insets =
				panel === "right" ? { ...base, right: 0.5, top: top + 0.04 } : { ...base, bottom: 0.46, top: top + 0.02 }
			target = fitBox(grow(PARCEL_BOX, 0.9), aspect, insets)
		} else if (phase === "district") {
			target = fitBox(grow(HOT.box, 0.08), aspect, { ...base, top: top + 0.06 })
		} else {
			target = fitBox(FULL_BOX, aspect, base)
		}

		const from = vbRef.current
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		const duration = reduceMotion ? 0 : TWEEN_MS[phase]
		const start = performance.now()
		let frame = 0

		// Interpolate the zoom level logarithmically so a 300× zoom feels uniform instead of all happening at the end.
		const step = (now: number) => {
			const t = duration ? Math.min(1, (now - start) / duration) : 1
			const e = easeInOut(t)
			const w = Math.exp(Math.log(from.w) + (Math.log(target.w) - Math.log(from.w)) * e)
			const fromCx = from.x + from.w / 2
			const fromCy = from.y + from.h / 2
			const toCx = target.x + target.w / 2
			const toCy = target.y + target.h / 2
			// Move the centre in step with the zoom so the camera does not swing past the target.
			const k = from.w === target.w ? e : (from.w - w) / (from.w - target.w)
			const cx = fromCx + (toCx - fromCx) * k
			const cy = fromCy + (toCy - fromCy) * k
			const h = w / aspect
			const next = { x: cx - w / 2, y: cy - h / 2, w, h }
			vbRef.current = next
			setVb(next)
			if (t < 1) frame = requestAnimationFrame(step)
		}
		frame = requestAnimationFrame(step)
		return () => cancelAnimationFrame(frame)
	}, [phase, panel, size, topOffset])

	const pxPerUnit = size.w ? size.w / vb.w : 0
	const labelPx = 10
	const scanning = phase === "searching"
	const hotActive = phase === "district" || phase === "parcel"
	const showParcels = phase === "parcel"
	const zoomedIn = pxPerUnit > 12

	return (
		<div ref={rootRef} className="absolute inset-0 bg-(--geo-bg)">
			<svg
				className="h-full w-full"
				viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
				preserveAspectRatio="xMidYMid slice"
				role="img"
				aria-label="Kraków"
			>
				<defs>
					<pattern
						id="geo-cadastre"
						width="0.55"
						height="0.8"
						patternUnits="userSpaceOnUse"
						patternTransform="rotate(18)"
					>
						<path d="M0 0H0.55M0 0V0.8" fill="none" stroke="var(--geo-grid)" strokeWidth="0.012" />
					</pattern>
				</defs>

				{DISTRICTS.map((d, i) => {
					const isHot = d.id === HOT_DISTRICT
					const active = isHot && hotActive
					return (
						<path
							key={d.id}
							d={d.d}
							vectorEffect="non-scaling-stroke"
							className={scanning ? "geo-scan" : undefined}
							style={{
								fill: active ? "var(--geo-hot-fill)" : "var(--geo-district)",
								stroke: active ? "var(--geo-hot-stroke)" : "var(--geo-district-stroke)",
								strokeWidth: active ? 2 : 0.8,
								transition: "fill 0.5s, stroke 0.5s",
								animationDelay: scanning ? `${(i * 137) % 900}ms` : undefined
							}}
						/>
					)
				})}

				{/* Cadastral context, only visible once zoomed in far enough to be meaningful */}
				<g style={{ opacity: zoomedIn ? 1 : 0, transition: "opacity 0.6s" }} aria-hidden>
					<path d={HOT.d} fill="url(#geo-cadastre)" />
					<path d={ROAD} fill="none" stroke="var(--geo-road)" strokeWidth="0.16" strokeLinecap="round" />
					<path
						d={ROAD}
						fill="none"
						stroke="var(--geo-bg)"
						strokeWidth="0.015"
						strokeDasharray="0.12 0.1"
						opacity={0.8}
					/>
				</g>

				{PARCELS.map((p, i) => (
					<g key={p.id} style={{ opacity: showParcels ? 1 : 0, transition: `opacity 0.5s ${0.5 + i * 0.25}s` }}>
						<path
							d={p.d}
							vectorEffect="non-scaling-stroke"
							style={{ fill: "var(--geo-parcel)", stroke: "var(--geo-hot-stroke)", strokeWidth: 2 }}
						/>
						<path d={p.d} vectorEffect="non-scaling-stroke" className="geo-ring" fill="none" />
					</g>
				))}

				{/* Labels only where the district is wide enough on screen to hold its name */}
				{pxPerUnit > 0 &&
					!zoomedIn &&
					DISTRICTS.map((d) => {
						const widthPx = (d.box[2] - d.box[0]) * pxPerUnit
						if (widthPx < d.name.length * 6.2 + 8) return null
						const isHot = d.id === HOT_DISTRICT
						return (
							<text
								key={d.id}
								x={d.label[0]}
								y={d.label[1]}
								textAnchor="middle"
								dominantBaseline="middle"
								fontSize={labelPx / pxPerUnit}
								fontWeight={isHot && hotActive ? 600 : 400}
								style={{
									fill: isHot && hotActive ? "var(--geo-hot-stroke)" : "var(--geo-label)",
									transition: "fill 0.4s"
								}}
								className="pointer-events-none select-none font-mono uppercase tracking-wider"
							>
								{d.name}
							</text>
						)
					})}
			</svg>

			{scanning && <div className="geo-sweep pointer-events-none absolute inset-y-0 w-1/3" aria-hidden />}
		</div>
	)
}
