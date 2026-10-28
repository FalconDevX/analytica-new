"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import useMounted from "@/hooks/useMounted"

export default function ModeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const mounted = useMounted()

	if (!mounted) return <span className="inline-flex h-11 w-11" aria-hidden />

	const isDark = resolvedTheme === "dark"

	return (
		<button
			type="button"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent cursor-pointer"
		>
			{isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
		</button>
	)
}
