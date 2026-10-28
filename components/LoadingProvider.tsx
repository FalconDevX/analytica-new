"use client"

import { createContext, useContext, useEffect, useState } from "react"

type LoadingContextValue = {
	isLoading: boolean
}

const LoadingContext = createContext<LoadingContextValue>({ isLoading: true })

const MIN_DISPLAY_MS = 900
// Never block the page longer than this, even if images or other assets are still loading.
const MAX_WAIT_MS = 2500

export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const startedAt = Date.now()

		let hideTimer: ReturnType<typeof setTimeout> | undefined
		let done = false
		const finish = () => {
			if (done) return
			done = true
			const elapsed = Date.now() - startedAt
			const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
			hideTimer = setTimeout(() => setIsLoading(false), remaining)
		}

		const maxTimer = setTimeout(finish, MAX_WAIT_MS)
		if (document.readyState === "complete") finish()
		else window.addEventListener("load", finish, { once: true })

		return () => {
			clearTimeout(maxTimer)
			clearTimeout(hideTimer)
			window.removeEventListener("load", finish)
		}
	}, [])

	return <LoadingContext.Provider value={{ isLoading }}>{children}</LoadingContext.Provider>
}

export function useLoading() {
	return useContext(LoadingContext)
}
