"use client"

import { useAppLocale } from "@/components/providers/LocaleProvider"

export default function Flags() {
	const { setLocale } = useAppLocale()

	return (
		<div className="flex gap-1">
			<button
				type="button"
				onClick={() => setLocale("pl")}
				aria-label="Polski"
				className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-accent cursor-pointer"
			>
				<img src="/PL.jpg" className="w-6 h-4" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.9))" }} alt="PL" />
			</button>
			<button
				type="button"
				onClick={() => setLocale("en")}
				aria-label="English"
				className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-accent cursor-pointer"
			>
				<img
					src="/GB.jpg"
					className="w-6 h-4 drop-shadow-lg"
					style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.9))" }}
					alt="EN"
				/>
			</button>
		</div>
	)
}
