"use client"

import { useRouter } from "next/navigation"

export default function Flags() {
	const router = useRouter()

	function setLang(locale: "pl" | "en") {
		document.cookie = `NEXT_LOCALE=${locale}; path=/;`
		router.refresh()
	}

	return (
		<div className="flex gap-1">
			<button
				type="button"
				onClick={() => setLang("pl")}
				aria-label="Polski"
				className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-accent"
			>
				<img
					src="/PL.jpg"
					className="w-6 h-4"
					style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.9))" }}
					alt="PL"
				/>
			</button>
			<button
				type="button"
				onClick={() => setLang("en")}
				aria-label="English"
				className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-accent"
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
