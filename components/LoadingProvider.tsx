"use client"

import { createContext, useContext, useEffect, useState } from "react"

type LoadingContextValue = {
	isLoading: boolean
}

const LoadingContext = createContext<LoadingContextValue>({ isLoading: true })

const MIN_DISPLAY_MS = 1800

export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const startedAt = Date.now()

		const finish = () => {
			const elapsed = Date.now() - startedAt
			const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed)
			setTimeout(() => setIsLoading(false), remaining)
		}

		if (document.readyState === "complete") {
			finish()
		} else {
			window.addEventListener("load", finish, { once: true })
			return () => window.removeEventListener("load", finish)
		}
	}, [])

	return <LoadingContext.Provider value={{ isLoading }}>{children}</LoadingContext.Provider>
}

export function useLoading() {
	return useContext(LoadingContext)
}
