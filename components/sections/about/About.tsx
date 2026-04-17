"use client"
import { useTranslations } from "next-intl"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import AboutUs from "./AboutUs"
import StatsCounter from "./StatsCounter"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

const About = () => {
	const t = useTranslations("about")
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	const isLight = mounted && resolvedTheme === "light"

	return (
		<div id="about" className="appear w-full min-h-[60vh] flex flex-col items-center scroll-mt-20">
			<h1 className="text-black dark:text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight py-6 px-6 text-center">
				{t("title")}
			</h1>
			<div className="flex flex-col md:flex-row gap-8 justify-center max-w-6xl mx-auto">
				<div className="w-full md:w-1/2 px-5 flex flex-col md:justify-start">
					<div className="w-full h-auto object-cover mb-4" suppressHydrationWarning>
						{mounted && (
							<img
								src={isLight ? "neural_network_white.png" : "neural_network2.png"}
								className="w-full h-[260px] sm:h-[300px] md:h-[400px] object-contain"
								style={{
									WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
									maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)"
								}}
							/>
						)}
					</div>
					<StatsCounter />
					<p className="dark:text-white text-black text-md max-w-xl whitespace-pre-line mt-2">{t("description")}</p>
					<div
						className="mt-5 flex w-fit max-w-full flex-row flex-wrap items-center gap-1 self-start rounded-xl border border-zinc-200 bg-zinc-50/90 px-2 py-2 dark:border-zinc-600 dark:bg-zinc-900/40"
						role="group"
						aria-label="Social media"
					>
						<a
							href="https://www.instagram.com/agh_analytica/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram"
							className="group flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-zinc-700 transition-colors duration-300 hover:text-[#E1306C] dark:text-white"
						>
							<Instagram className="h-7 w-7 stroke-2 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(131,58,180,0.9)_drop-shadow(0_0_15px_rgba(253,29,29,0.6))]" />
						</a>

						<a
							href="https://www.facebook.com/p/AGH-Analytica-61569784207839/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Facebook"
							className="group flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-zinc-700 transition-colors duration-300 hover:text-[#5865F2] dark:text-white"
						>
							<Facebook className="h-7 w-7 stroke-2 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(88,101,242,0.9)]" />
						</a>

						<a
							href="https://www.linkedin.com/company/agh-analytica/"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="LinkedIn"
							className="group flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 text-zinc-700 transition-colors duration-300 hover:text-[#0A66C2] dark:text-white"
						>
							<Linkedin className="h-7 w-7 stroke-2 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(10,102,194,0.9)]" />
						</a>
					</div>
				</div>

				<div className="w-full md:w-1/2 px-5">
					<div className="relative inline-block p-3">
						<AboutUs />
					</div>
				</div>
			</div>
		</div>
	)
}

export default About
