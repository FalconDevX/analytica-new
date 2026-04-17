"use client"

import { useEffect, useState } from "react"
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas"
import { useTheme } from "next-themes"
import { useLoading } from "./LoadingProvider"

function RiveLoader({ src }: { src: string }) {
	const { RiveComponent } = useRive({
		src,
		stateMachines: "State Machine 1",
		autoplay: true,
		layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center })
	})

	return <RiveComponent />
}

export default function LoadingScreen() {
	const { resolvedTheme } = useTheme()
	const { isLoading } = useLoading()
	const [isMounted, setIsMounted] = useState(false)
	const [shouldRender, setShouldRender] = useState(true)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		if (!isLoading) {
			const t = setTimeout(() => setShouldRender(false), 500)
			return () => clearTimeout(t)
		}
	}, [isLoading])

	if (!shouldRender) return null

	const isDarkTheme = isMounted ? resolvedTheme === "dark" : true
	const riveSrc = isDarkTheme ? "/analyticalogo.riv" : "/analyticalogo-dark.riv"

	return (
		<div
			aria-hidden="true"
			className="fixed inset-0 z-9999 flex items-center justify-center pointer-events-none transition-opacity duration-500"
			style={{
				backgroundColor: isDarkTheme ? "#000" : "#fff",
				opacity: isLoading ? 1 : 0,
				pointerEvents: isLoading ? "auto" : "none"
			}}
		>
			<div className="w-20 sm:w-24 md:w-28 aspect-square">{isMounted && <RiveLoader src={riveSrc} />}</div>
		</div>
	)
}
