"use client"

import { ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface HorizontalRevealProps {
	children: ReactNode | ((visible: boolean) => ReactNode)
	delay?: number
	direction?: "right" | "left"
}

export default function HorizontalReveal({ children, delay = 0, direction = "right" }: HorizontalRevealProps) {
	const ref = useRef(null)
	const isInView = useInView(ref, {
		once: true,
		amount: 0.2
	})
	return (
		<motion.div
			ref={ref}
			className="horizontal-reveal"
			initial={{ opacity: 0, scale: 0.85, y: 0, x: direction === "right" ? -100 : 100 }}
			animate={
				isInView
					? { opacity: 1, scale: 1, y: 0, x: 0 }
					: { opacity: 0, scale: 0.85, y: 30, x: direction === "right" ? -100 : 100 }
			}
			transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
		>
			{typeof children === "function" ? children(isInView) : children}
		</motion.div>
	)
}
