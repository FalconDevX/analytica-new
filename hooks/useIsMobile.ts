"use client"

import { useEffect, useState } from "react"

function getIsMobile(breakpoint: number) {
	if (typeof window === "undefined") return false
	return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
}

export default function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState<boolean>(() => getIsMobile(breakpoint))

	useEffect(() => {
		if (typeof window === "undefined") return
		const query = `(max-width: ${breakpoint - 1}px)`
		const mql = window.matchMedia(query)
		const update = () => setIsMobile(mql.matches)
		update()
		mql.addEventListener("change", update)
		return () => mql.removeEventListener("change", update)
	}, [breakpoint])

	return isMobile
}
