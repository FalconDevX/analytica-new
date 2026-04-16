"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export type NavbarSectionIndicatorProps = {
	left: number
	width: number
	className?: string
}

export function NavbarSectionIndicator({ left, width, className }: NavbarSectionIndicatorProps) {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		const timeoutId = window.setTimeout(() => setIsVisible(true), 100)
		return () => window.clearTimeout(timeoutId)
	}, [])

	return (
		<div
			className={cn(
				"pointer-events-none absolute bottom-0 z-0 h-8 rounded-xl bg-black transition-opacity duration-300 ease-out dark:bg-white",
				isVisible ? "opacity-100" : "opacity-0",
				className
			)}
			style={{
				left: left - 8,
				width: width + 16,
				transform: "translateY(-30px)"
			}}
			aria-hidden
		/>
	)
}
