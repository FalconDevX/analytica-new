"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Ruler, Tag, Route, TreePine } from "lucide-react"

const QUERY = "szukam działki w Zwierzyńcu w Krakowie, 1500 m², budowlana, blisko drogi"

type Phase = "typing" | "searching" | "district" | "parcel" | "reset"

const GeoSearchMap = dynamic(() => import("./GeoSearchMap"), {
	ssr: false,
	loading: () => <div className="absolute inset-0 bg-[#07080b]" />
})

function phaseToMap(phase: Phase): "overview" | "searching" | "district" | "parcel" {
	if (phase === "searching") return "searching"
	if (phase === "district") return "district"
	if (phase === "parcel") return "parcel"
	return "overview"
}

export default function GeoSearch() {
	const [phase, setPhase] = useState<Phase>("typing")
	const [typed, setTyped] = useState("")
	const cancelledRef = useRef(false)

	useEffect(() => {
		cancelledRef.current = false
		const timeouts: ReturnType<typeof setTimeout>[] = []
		const wait = (ms: number) =>
			new Promise<void>((resolve) => {
				const id = setTimeout(resolve, ms)
				timeouts.push(id)
			})

		const run = async () => {
			while (!cancelledRef.current) {
				setPhase("typing")
				setTyped("")
				for (let i = 1; i <= QUERY.length; i++) {
					if (cancelledRef.current) return
					await wait(28 + Math.random() * 55)
					setTyped(QUERY.slice(0, i))
				}
				await wait(550)
				if (cancelledRef.current) return

				setPhase("searching")
				await wait(1200)
				if (cancelledRef.current) return

				setPhase("district")
				await wait(1800)
				if (cancelledRef.current) return

				setPhase("parcel")
				await wait(4500)
				if (cancelledRef.current) return

				setPhase("reset")
				await wait(1400)
			}
		}
		run()

		return () => {
			cancelledRef.current = true
			timeouts.forEach(clearTimeout)
		}
	}, [])

	const searching = phase === "searching"
	const showResults = phase === "parcel"

	return (
		<div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-[#f5f6f8] ring-1 ring-zinc-300/60 shadow-xl dark:bg-[#07080b] dark:ring-white/10 dark:shadow-2xl">
			<GeoSearchMap phase={phaseToMap(phase)} />

			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,200,120,0.08),transparent_60%)]" />

			<div className="absolute inset-x-3 top-3 z-500">
				<div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white/90 px-3 py-2 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-black/70 dark:shadow-lg">
					<Search className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-300/80" />
					<div className="relative flex-1 truncate font-mono text-[12px] text-zinc-800 sm:text-sm dark:text-zinc-100">
						{typed || <span className="text-zinc-400 dark:text-zinc-500">zapytaj o działkę...</span>}
						{phase === "typing" && (
							<span className="ml-0.5 inline-block h-[14px] w-[2px] -translate-y-[2px] animate-pulse bg-amber-600 align-middle dark:bg-amber-300" />
						)}
					</div>
					{searching && (
						<div className="flex items-center gap-1">
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:0ms] dark:bg-amber-300" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:120ms] dark:bg-amber-300" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:240ms] dark:bg-amber-300" />
						</div>
					)}
				</div>
			</div>

			<AnimatePresence>
				{showResults && (
					<motion.div
						key="results"
						className="pointer-events-none absolute inset-y-0 right-0 z-500 flex w-[62%] sm:w-[48%] flex-col justify-center gap-1.5 sm:gap-2 px-2 sm:px-3"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.25 } }}
						transition={{ duration: 0.3 }}
					>
						<InfoCard
							delay={0.35}
							icon={<Ruler className="h-3.5 w-3.5" />}
							label="Powierzchnia"
							value="1 520 · 1 480 m²"
						/>
						<InfoCard delay={0.5} icon={<Tag className="h-3.5 w-3.5" />} label="Cena" value="312 · 298 tys. PLN" />
						<InfoCard delay={0.65} icon={<MapPin className="h-3.5 w-3.5" />} label="Dzielnica" value="Zwierzyniec" />
						<InfoCard delay={0.8} icon={<Route className="h-3.5 w-3.5" />} label="Dostęp" value="Droga asfaltowa" />
						<InfoCard delay={0.95} icon={<TreePine className="h-3.5 w-3.5" />} label="Klasa" value="Budowlana MN" />
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showResults && (
					<motion.div
						key="badge"
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.3, delay: 0.2 }}
						className="absolute left-3 top-14 z-500 rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2 py-1 text-[10px] font-medium tracking-wide text-emerald-700 backdrop-blur-md dark:border-emerald-400/30 dark:text-emerald-200"
					>
						Znaleziono 2 dopasowania
					</motion.div>
				)}
			</AnimatePresence>

			<div className="pointer-events-none absolute bottom-2 left-3 z-500 font-mono text-[10px] sm:text-[9px] uppercase tracking-wider text-amber-700/70 dark:text-amber-300/60">
				PostGIS · GeoPandas · LLM
			</div>
			<div className="pointer-events-none hidden sm:block absolute bottom-2 right-3 z-500 font-mono text-[8px] text-zinc-500 dark:text-zinc-500">
				© OpenStreetMap · CARTO
			</div>
		</div>
	)
}

type InfoCardProps = {
	icon: React.ReactNode
	label: string
	value: string
	delay: number
}

function InfoCard({ icon, label, value, delay }: InfoCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 24, scale: 0.92 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			exit={{ opacity: 0, x: 16, transition: { duration: 0.2 } }}
			transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
			className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-white/90 px-2.5 py-1.5 shadow-[0_4px_20px_rgba(180,83,9,0.12)] backdrop-blur-md dark:border-amber-300/25 dark:bg-black/75 dark:shadow-[0_0_20px_rgba(255,180,60,0.15)]"
		>
			<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-amber-500/15 text-amber-700 dark:bg-amber-300/15 dark:text-amber-300">
				{icon}
			</div>
			<div className="flex min-w-0 flex-col">
				<span className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</span>
				<span className="truncate text-[11px] sm:text-xs font-medium text-zinc-900 dark:text-zinc-100">{value}</span>
			</div>
		</motion.div>
	)
}
