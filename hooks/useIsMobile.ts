"use client"

import { useCallback, useSyncExternalStore } from "react"

// Returns false during SSR and hydration, then the real media-query result, so the
// server and first client render always match.
export default function useIsMobile(breakpoint = 768) {
	const query = `(max-width: ${breakpoint - 1}px)`

	const subscribe = useCallback(
		(onChange: () => void) => {
			const mql = window.matchMedia(query)
			mql.addEventListener("change", onChange)
			return () => mql.removeEventListener("change", onChange)
		},
		[query]
	)

	return useSyncExternalStore(
		subscribe,
		() => window.matchMedia(query).matches,
		() => false
	)
}
