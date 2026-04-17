"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, motion } from "framer-motion"
import { useTranslations } from "next-intl"

type Stat = {
	value: number
	key: "members" | "fields" | "faculties" | "events" | "projects" | "grants"
}

const STATS: Stat[] = [
	{ value: 24, key: "members" },
	{ value: 4, key: "fields" },
	{ value: 3, key: "faculties" },
	{ value: 5, key: "events" },
	{ value: 3, key: "projects" },
	{ value: 1, key: "grants" }
]

function AnimatedNumber({ value, start, durationMs = 1600 }: { value: number; start: boolean; durationMs?: number }) {
	const [display, setDisplay] = useState(0)
	const rafRef = useRef<number | null>(null)

	useEffect(() => {
		if (!start) return
		const t0 = performance.now()
		const from = 0
		const to = value

		const tick = (now: number) => {
			const elapsed = now - t0
			const t = Math.min(1, elapsed / durationMs)
			const eased = 1 - Math.pow(1 - t, 3)
			setDisplay(Math.round(from + (to - from) * eased))
			if (t < 1) {
				rafRef.current = requestAnimationFrame(tick)
			}
		}
		rafRef.current = requestAnimationFrame(tick)
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
		}
	}, [start, value, durationMs])

	return <>{display}</>
}

export default function StatsCounter() {
	const t = useTranslations("aboutStats")
	const ref = useRef<HTMLDivElement | null>(null)
	const inView = useInView(ref, { once: true, amount: 0.3 })

	return (
		<div
			ref={ref}
			className="w-full grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 py-4"
			aria-label="Statystyki koła"
		>
			{STATS.map((stat, i) => (
				<motion.div
					key={stat.key}
					initial={{ opacity: 0, y: 12 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
					className="flex flex-col items-start gap-0.5"
				>
					<div className="flex items-baseline text-2xl sm:text-3xl font-bold tracking-tight leading-none text-foreground">
						<AnimatedNumber value={stat.value} start={inView} />
						<span className="ml-0.5">+</span>
					</div>
					<span className="text-[11px] sm:text-xs text-muted-foreground leading-snug">
						{t(stat.key)}
					</span>
				</motion.div>
			))}
		</div>
	)
}
