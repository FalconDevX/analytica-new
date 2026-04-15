"use client"
import useTilt from "@/hooks/useTilt"
import { useTranslations } from "next-intl"
import StockChart from "./StockChart"
import { ProjectTechTags } from "./ProjectTechTags"
import { GithubIcon } from "lucide-react"
import { motion } from "framer-motion"

const TECH_DEVELOPERS_CHAT = ["Python", "LangChain", "LLM / OpenAI", "GeoPandas", "PostGIS", "FastAPI", "React"]

const TECH_TRADE = ["Python", "TensorFlow", "Pandas", "yfinance", "FastAPI", "React", "WebSocket"]

const TECH_ROBO_DOG = ["Python", "ROS 2", "PyTorch", "LiDAR", "YOLOv8", "Reinforcement Learning", "Raspberry Pi"]

const Projects = () => {
	useTilt()
	const t = useTranslations("projects")
	return (
		<div id="projects" className="appear w-full min-h-[90vh] flex flex-col items-center justify-start scroll-mt-20">
			<h1 className="text-2xl p-6">{t("title")}</h1>
			<div className="flex flex-col gap-5">
				<motion.div 
					className="w-full px-5 sm:px-0"
					initial={{ x: -100, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 1, ease: "easeOut" }}
				>
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-6xl">
						<div className="relative w-full md:w-1/2 p-3">
							<img src="project-geo.png" className="w-full h-auto object-contain rounded-lg" />
						</div>

						<div className="w-full md:w-1/2">
							<h3 className="text-black dark:text-white text-lg mb-3">{t("developersChat.title")}</h3>
							<p className=" text-black dark:text-white text-md whitespace-pre-line">
								{t("developersChat.description")}
							</p>
							<ProjectTechTags tags={TECH_DEVELOPERS_CHAT} />
							<div className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-card-foreground transition-colors duration-300 hover:bg-muted">
								<GithubIcon className="h-5 w-5" />
								<p className="font-medium">Github</p>
							</div>
						</div>
					</div>
				</motion.div>
				<motion.div className="w-full px-5 sm:px-0"
					initial={{ x: 100, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 1, ease: "easeOut" }}
				>
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-6xl">
						<div className="w-full md:w-1/2">
							<h3 className="text-black dark:text-white text-lg mb-3">{t("tradeAnalysis.title")}</h3>
							<p className=" text-md whitespace-pre-line text-black dark:text-white">
								{t("tradeAnalysis.description")}
							</p>
							<ProjectTechTags tags={TECH_TRADE} />
							<div className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-card-foreground transition-colors duration-300 hover:bg-muted">
								<p className="font-medium">Github</p>
								<GithubIcon className="h-5 w-5" />
							</div>
						</div>
						<div className="w-full md:w-1/2">
							<div className="relative w-full h-[300px] p-3">
								<div className="h-full w-full">
									<StockChart />
								</div>
							</div>
						</div>
					</div>
				</motion.div>
				<motion.div className="w-full px-5 sm:px-0"
					initial={{ x: -100, opacity: 0 }}
					whileInView={{ x: 0, opacity: 1 }}
					viewport={{ once: true, amount: 0.4 }}
					transition={{ duration: 1, ease: "easeOut" }}
				>
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full max-w-6xl">
						<div className="w-full md:w-1/2">
							<div className="relative w-full h-[300px] p-3">
								<div className="h-full w-full overflow-hidden rounded-lg">
									<img src="unitree_go2.png" alt="" className="h-full w-full object-cover object-center" />
								</div>
							</div>
						</div>
						<div className="w-full md:w-1/2">
							<h3 className="text-black dark:text-white text-lg mb-3">{t("roboDog.title")}</h3>
							<p className=" text-md whitespace-pre-line text-black dark:text-white">{t("roboDog.description")}</p>
							<ProjectTechTags tags={TECH_ROBO_DOG} />
							<div className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-card-foreground transition-colors duration-300 hover:bg-muted">
								<p className="font-medium">Github</p>
								<GithubIcon className="h-5 w-5" />
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default Projects
