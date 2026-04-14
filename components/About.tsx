import React from "react"
import { useTranslations } from "next-intl"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import AboutUs from "./AboutUs"

const About = () => {
	const t = useTranslations("about")
	return (
		<div id="about" className="appear w-full min-h-[60vh] flex flex-col items-center scroll-mt-15">
			<h1 className="text-black dark:text-white text-2xl p-6">{t("title")}</h1>
			<div className="flex flex-col md:flex-row gap-8 justify-center max-w-6xl mx-auto">
				<div className="w-full md:w-1/2 px-5 flex flex-col md:justify-start">
					<div className="w-full h-auto object-cover mb-10">
						<img src="neural_network.png" className="w-full h-auto object-contain" />
					</div>
					<p className="dark:text-white text-black text-md max-w-xl whitespace-pre-line">{t("description")}</p>
					<div
						className="mt-5 flex w-fit max-w-full flex-row flex-wrap items-center gap-3 self-start rounded-xl border border-zinc-200 bg-zinc-50/90 px-4 py-3 dark:border-zinc-600 dark:bg-zinc-900/40"
						role="group"
						aria-label="Social media"
					>
						<a
							href="https://www.instagram.com/agh_analytica/"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center gap-2 text-zinc-700 transition-colors duration-300 hover:text-[#E1306C] dark:text-white"
						>
							<Instagram className="h-7 w-7 stroke-2 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(131,58,180,0.9)_drop-shadow(0_0_15px_rgba(253,29,29,0.6))]" />
						</a>

						<a
							href="https://www.facebook.com/p/AGH-Analytica-61569784207839/"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center gap-2 text-zinc-700 transition-colors duration-300 hover:text-[#5865F2] dark:text-white"
						>
							<Facebook className="h-7 w-7 stroke-2 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(88,101,242,0.9)]" />
						</a>

						<a
							href="https://www.linkedin.com/company/agh-analytica/"
							target="_blank"
							rel="noopener noreferrer"
							className="group flex items-center gap-2 text-zinc-700 transition-colors duration-300 hover:text-[#0A66C2] dark:text-white"
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
