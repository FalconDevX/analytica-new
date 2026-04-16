"use client"

import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ModeToggle() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null

	return (
		<button
			type="button"
			aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent cursor-pointer"
		>
			{theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
		</button>
	)
}
