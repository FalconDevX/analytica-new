"use client"

import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

// true on the client after hydration, false during SSR and the hydration render.
export default function useMounted() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false
	)
}
