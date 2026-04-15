"use client"

import React from "react"
import HorizontalReveal from "./HorizontalReveal"
import { MapIcon, ChartBarIcon, BrainIcon, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"

const items = [
	{
		icon: <MapIcon className="w-6 h-6" />,
		titleKey: "gis.title",
		textKey: "gis.text",
		side: "left",
		delay: 0.4
	},
	{
		icon: <ChartBarIcon className="w-6 h-6" />,
		titleKey: "stock.title",
		textKey: "stock.text",
		side: "right",
		delay: 0.8
	},
	{
		icon: <BrainIcon className="w-6 h-6" />,
		titleKey: "llm.title",
		textKey: "llm.text",
		side: "left",
		delay: 1.0
	},
	{
		icon: <ImageIcon className="w-6 h-6" />,
		titleKey: "vision.title",
		textKey: "vision.text",
		side: "right",
		delay: 1.4
	}
]

const AboutUs = () => {
	const t = useTranslations("aboutUs.items")

	return (
		<div className="h-full flex flex-col items-center relative">
			<div className="relative w-full max-w-4xl flex flex-col">
				<motion.div
					className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-neutral-400/50 origin-top"
					initial={{ scaleY: 0 }}
					whileInView={{ scaleY: 1 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 1, ease: "easeOut" }}
				/>
				{items.map((item, i) => (
					<div
						key={i}
						className={`w-full min-h-[130px] flex ${item.side === "right" ? "justify-end" : "justify-start"}`}
					>
						<div className="w-1/2 mx-[-30px]">
							<HorizontalReveal delay={item.delay} direction={item.side === "right" ? "right" : "left"}>
								<div
									className={
										item.side === "right"
											? "flex justify-start items-center gap-2 mb-4"
											: "flex justify-end items-center gap-2 mb-4"
									}
								>
									<h2 className="text-lg font-bold">{t(item.titleKey)}</h2>
									<div className="dark:text-stone-400 text-stone-600 flex items-center justify-center w-10 h-10">
										{item.icon}
									</div>
								</div>
								<p className={item.side === "right" ? "text-left" : "text-right"}>{t(item.textKey)}</p>
							</HorizontalReveal>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default AboutUs
