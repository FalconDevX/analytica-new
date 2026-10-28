"use client"
import { useTranslations } from "next-intl"
import StockChart from "./StockChart"
import EmotionFace from "./EmotionFace"
import GeoSearch from "./GeoSearch"
import { ProjectTechTags } from "./ProjectTechTags"
import { ArrowRight, GithubIcon } from "lucide-react"
import dynamic from "next/dynamic"
import LazyMount from "@/components/common/LazyMount"
import type { ReactNode } from "react"

const RoboDogViewer = dynamic(() => import("./RoboDogViewer"), {
	ssr: false,
	loading: () => <div className="h-full w-full animate-pulse rounded-lg bg-muted/60" />
})

const TECH_DEVELOPERS_CHAT = ["Python", "LangChain", "LLM / OpenAI", "GeoPandas", "PostGIS", "FastAPI", "React"]

const TECH_TRADE = ["Python", "TensorFlow", "Pandas", "yfinance", "FastAPI", "React", "WebSocket"]

const TECH_EMOTION_AI = ["Python", "PyTorch", "OpenCV", "CNN", "Deep Learning", "Computer Vision"]

const TECH_ROBO_DOG = ["Python", "ROS 2", "PyTorch", "LiDAR", "YOLOv8", "Reinforcement Learning", "Raspberry Pi"]

type ProjectCardProps = {
	title: string
	description: string
	tech: string[]
	visual: ReactNode
	visualHeight?: string
	mediaOnLeft?: boolean
	direction?: "left" | "right"
	githubUrl?: string
	/** Highlight pill above the title, e.g. linking to recruitment. */
	badge?: { label: string; href: string }
}

const ProjectCard = ({
	title,
	description,
	tech,
	visual,
	visualHeight = "h-[320px]",
	mediaOnLeft = true,
	direction = "left",
	githubUrl,
	badge
}: ProjectCardProps) => {
	const slideClass = direction === "left" ? "project-slide-left" : "project-slide-right"

	return (
		<article className={`w-full ${slideClass}`}>
			<div className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 md:backdrop-blur-sm shadow-sm md:transition-all md:duration-300 md:hover:shadow-lg md:hover:border-border/80">
				<div className="flex flex-col md:flex-row gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
					<div
						className={`w-full md:w-1/2 ${mediaOnLeft ? "md:order-1" : "md:order-2"}`}
					>
						<div className={`relative w-full ${visualHeight} overflow-hidden rounded-xl`}>
							{visual}
						</div>
					</div>

					<div
						className={`w-full md:w-1/2 flex flex-col ${mediaOnLeft ? "md:order-2" : "md:order-1"}`}
					>
						{badge && (
							<a
								href={badge.href}
								className="group/badge mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-600/30 bg-violet-600/8 px-3 py-1 text-xs font-medium text-violet-700 transition-colors hover:bg-violet-600/15 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300"
							>
								<span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
								{badge.label}
								<ArrowRight className="h-3 w-3 transition-transform group-hover/badge:translate-x-0.5" aria-hidden />
							</a>
						)}
						<h3 className="text-black dark:text-white text-xl sm:text-2xl font-bold tracking-tight mb-3">
							{title}
						</h3>
						<p className="text-zinc-700 dark:text-zinc-300 text-[15px] leading-relaxed whitespace-pre-line">
							{description}
						</p>
						<div className="mt-4">
							<ProjectTechTags tags={tech} />
						</div>
						{githubUrl && (
						<div className="mt-5 flex flex-wrap gap-3">
							<a
								href={githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-2 text-sm text-foreground transition-all duration-300 hover:bg-muted hover:border-foreground/30 hover:-translate-y-0.5"
							>
								<GithubIcon className="h-5 w-5" />
								<span className="font-medium">Github</span>
							</a>
						</div>
						)}
					</div>
				</div>
			</div>
		</article>
	)
}

const Projects = () => {
	const t = useTranslations("projects")
	return (
		<div
			id="projects"
			className="appear w-full min-h-[90vh] flex flex-col items-center justify-start scroll-mt-20"
		>
			<h2 className="text-black dark:text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight py-6 px-6 text-center">
				{t("title")}
			</h2>

			<div className="w-full max-w-6xl px-4 sm:px-6 lg:px-0 flex flex-col gap-8">
				<ProjectCard
					title={t("emotionAI.title")}
					description={t("emotionAI.description")}
					tech={TECH_EMOTION_AI}
					badge={{ label: t("emotionAI.badge"), href: "#recruitment" }}
					visual={
						<div className="h-full w-full sm:p-3">
							<EmotionFace />
						</div>
					}
					visualHeight="h-[380px] sm:h-[400px]"
					mediaOnLeft={false}
					direction="right"
				/>

				<ProjectCard
					title={t("developersChat.title")}
					description={t("developersChat.description")}
					tech={TECH_DEVELOPERS_CHAT}
					visual={
						<div className="h-full w-full sm:p-3">
							<GeoSearch />
						</div>
					}
					visualHeight="h-[340px] sm:h-[360px]"
					mediaOnLeft={true}
					direction="left"
				/>

				<ProjectCard
					title={t("tradeAnalysis.title")}
					description={t("tradeAnalysis.description")}
					tech={TECH_TRADE}
					visual={
						<div className="h-full w-full sm:p-3">
							<StockChart />
						</div>
					}
					visualHeight="h-[300px]"
					mediaOnLeft={false}
					direction="right"
				/>

				<ProjectCard
					title={t("roboDog.title")}
					description={t("roboDog.description")}
					tech={TECH_ROBO_DOG}
					visual={
						<div className="h-full w-full overflow-hidden rounded-lg">
							<LazyMount fallback={<div className="h-full w-full animate-pulse rounded-lg bg-muted/60" />}>
								<RoboDogViewer />
							</LazyMount>
						</div>
					}
					visualHeight="h-[360px] sm:h-[400px]"
					mediaOnLeft={true}
					direction="left"
				/>
			</div>
		</div>
	)
}

export default Projects
