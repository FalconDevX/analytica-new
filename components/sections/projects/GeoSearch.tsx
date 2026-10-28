"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useTranslations } from "next-intl"
import { Search, MapPin, Ruler, Tag, Route, TreePine, Sparkles } from "lucide-react"
import KrakowMap, { type MapPhase } from "./KrakowMap"

type Phase = "typing" | "searching" | "district" | "parcel" | "reset"

// Below this container width the results move from a side panel to a bottom grid.
const SIDE_PANEL_MIN_WIDTH = 440

function phaseToMap(phase: Phase): MapPhase {
	if (phase === "searching") return "searching"
	if (phase === "district") return "district"
	if (phase === "parcel") return "parcel"
	return "overview"
}

export default function GeoSearch() {
	const t = useTranslations("projects.geoSearch")
	const query = t("query")
	const rootRef = useRef<HTMLDivElement>(null)
	const inView = useInView(rootRef, { amount: 0.25 })
	const [phase, setPhase] = useState<Phase>("typing")
	const [typed, setTyped] = useState("")
	const [wide, setWide] = useState(true)

	useEffect(() => {
		const el = rootRef.current
		if (!el) return
		const ro = new ResizeObserver(([entry]) => setWide(entry.contentRect.width >= SIDE_PANEL_MIN_WIDTH))
		ro.observe(el)
		return () => ro.disconnect()
	}, [])

	// The demo loop runs only while visible; it restarts from the beginning when scrolled back into view.
	useEffect(() => {
		if (!inView) return
		let cancelled = false
		const timeouts: ReturnType<typeof setTimeout>[] = []
		const wait = (ms: number) =>
			new Promise<void>((resolve) => {
				timeouts.push(setTimeout(resolve, ms))
			})

		const run = async () => {
			while (!cancelled) {
				setPhase("typing")
				setTyped("")
				for (let i = 1; i <= query.length; i++) {
					await wait(26 + Math.random() * 50)
					if (cancelled) return
					setTyped(query.slice(0, i))
				}
				await wait(500)
				if (cancelled) return
				setPhase("searching")
				await wait(1700)
				if (cancelled) return
				setPhase("district")
				await wait(2000)
				if (cancelled) return
				setPhase("parcel")
				await wait(5200)
				if (cancelled) return
				setPhase("reset")
				await wait(1300)
			}
		}
		void run()

		return () => {
			cancelled = true
			timeouts.forEach(clearTimeout)
		}
	}, [inView, query])

	const showResults = phase === "parcel"
	const status =
		phase === "searching" ? t("scanning") : phase === "district" ? t("districtMatch") : phase === "parcel" ? t("found") : null

	const results: { key: string; icon: ReactNode; label: string; value: string; compact: boolean }[] = [
		{ key: "area", icon: <Ruler />, label: t("area"), value: t("areaValue"), compact: true },
		{ key: "price", icon: <Tag />, label: t("price"), value: t("priceValue"), compact: true },
		{ key: "district", icon: <MapPin />, label: t("district"), value: "Zwierzyniec", compact: false },
		{ key: "access", icon: <Route />, label: t("access"), value: t("accessValue"), compact: true },
		{ key: "zoning", icon: <TreePine />, label: t("zoning"), value: t("zoningValue"), compact: true }
	]
	const visibleResults = wide ? results : results.filter((r) => r.compact)

	return (
		<div
			ref={rootRef}
			className="geo-root relative h-full w-full overflow-hidden rounded-xl shadow-xl ring-1 ring-zinc-300/60 dark:shadow-2xl dark:ring-white/10"
		>
			<KrakowMap phase={phaseToMap(phase)} panel={wide ? "right" : "bottom"} topOffset={status ? 84 : 56} />

			<div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-(--geo-bg) to-transparent" />

			<div className="absolute inset-x-3 top-3 z-10">
				<div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white/90 px-3 py-2 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-black/70">
					<Search className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300/80" aria-hidden />
					<div className="relative min-w-0 flex-1 truncate font-mono text-[12px] text-zinc-800 sm:text-sm dark:text-zinc-100">
						{typed || <span className="text-zinc-400 dark:text-zinc-500">{t("placeholder")}</span>}
						{phase === "typing" && (
							<span className="ml-0.5 inline-block h-[14px] w-[2px] -translate-y-[2px] animate-pulse bg-amber-600 align-middle dark:bg-amber-300" />
						)}
					</div>
					{phase === "searching" && (
						<div className="flex items-center gap-1" aria-hidden>
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 dark:bg-amber-300" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:120ms] dark:bg-amber-300" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:240ms] dark:bg-amber-300" />
						</div>
					)}
				</div>

				<AnimatePresence mode="wait">
					{status && (
						<motion.div
							key={phase}
							initial={{ opacity: 0, y: -6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ duration: 0.25 }}
							className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-md border border-amber-500/40 bg-white/85 px-2 py-1 text-[10px] font-medium tracking-wide text-amber-800 backdrop-blur-md sm:text-[11px] dark:border-amber-300/30 dark:bg-black/60 dark:text-amber-200"
							role="status"
						>
							<Sparkles className="h-3 w-3 shrink-0" aria-hidden />
							<span className="truncate">{status}</span>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<AnimatePresence>
				{showResults && (
					<motion.ul
						key={wide ? "side" : "bottom"}
						className={
							wide
								? "pointer-events-none absolute bottom-8 right-3 top-24 z-10 flex w-[46%] flex-col justify-center gap-2"
								: "pointer-events-none absolute inset-x-3 bottom-3 z-10 grid grid-cols-2 gap-1.5"
						}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.25 } }}
					>
						{visibleResults.map((r, i) => (
							<motion.li
								key={r.key}
								initial={{ opacity: 0, x: wide ? 24 : 0, y: wide ? 0 : 12 }}
								animate={{ opacity: 1, x: 0, y: 0 }}
								transition={{ duration: 0.45, delay: 0.9 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
								className="flex min-w-0 items-center gap-2 rounded-lg border border-amber-500/40 bg-white/90 px-2 py-1.5 shadow-[0_4px_20px_rgba(180,83,9,0.12)] backdrop-blur-md dark:border-amber-300/25 dark:bg-black/75 dark:shadow-[0_0_20px_rgba(255,180,60,0.12)]"
							>
								<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500/15 text-amber-700 dark:bg-amber-300/15 dark:text-amber-300 [&>svg]:h-3.5 [&>svg]:w-3.5">
									{r.icon}
								</span>
								<span className="flex min-w-0 flex-col">
									<span className="truncate text-[9px] uppercase tracking-wider text-zinc-500 sm:text-[10px] dark:text-zinc-400">
										{r.label}
									</span>
									<span className="line-clamp-2 text-[11px] font-medium leading-tight text-zinc-900 sm:text-xs dark:text-zinc-100">
										{r.value}
									</span>
								</span>
							</motion.li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>

			{!(showResults && !wide) && (
				<div className="pointer-events-none absolute bottom-2 left-3 z-10 font-mono text-[10px] uppercase tracking-wider text-amber-700/70 dark:text-amber-300/60">
					PostGIS · GeoPandas · LLM
				</div>
			)}
		</div>
	)
}
