"use client"

import { ReactNode, useEffect, useRef, useState } from "react"

interface LazyMountProps {
	children: ReactNode
	fallback?: ReactNode
	rootMargin?: string
}

// Mounts children only once the placeholder approaches the viewport, so heavy
// chunks and assets (e.g. 3D models) are not fetched on initial page load.
export default function LazyMount({ children, fallback = null, rootMargin = "300px 0px" }: LazyMountProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setVisible(true)
					observer.disconnect()
				}
			},
			{ rootMargin }
		)
		observer.observe(el)
		return () => observer.disconnect()
	}, [rootMargin])

	return (
		<div ref={ref} className="h-full w-full">
			{visible ? children : fallback}
		</div>
	)
}
