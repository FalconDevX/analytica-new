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
			className="w-11 h-11 flex items-center justify-center border border-black dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-950 transition cursor-pointer"
		>
			{theme === "dark" ? <Sun className="flex w-5 h-5 text-white" /> : <Moon className="flex w-5 h-5 text-black" />}
		</button>
	)
}
