"use client"
import Sphere from "./Sphere"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import LogoRiveLight from "./LogoRiveLight"
import LogoRiveDark from "./LogoRiveDark"
import { Button } from "@/components/ui/button"
import { RocketIcon, ZapIcon } from "lucide-react"

const Welcome = () => {
	const { theme } = useTheme()
	const t = useTranslations("welcome")
	return (
		<div id="home" className="w-full h-screen relative overflow-hidden bg-transparent scroll-mt-20">
			<img
				src="/background.png"
				alt="Background"
				className="w-full h-full absolute inset-0 object-cover z-0 pointer-events-none hidden dark:block [@media(max-height:500px)]:dark:hidden"
			/>
			<img
				src="/background-white.png"
				alt="Background"
				className="w-full h-full absolute inset-0 object-cover z-0 pointer-events-none dark:hidden [@media(max-height:500px)]:hidden"
			/>

			<div className="[@media(max-height:500px)]:hidden">
				<Sphere />
			</div>

			{/* glow pod logo */}
			<div
				className="absolute inset-0 m-auto pointer-events-none z-20 hidden dark:block [@media(max-height:500px)]:dark:hidden"
				style={{
					width: "300px",
					height: "300px",
					borderRadius: "80%",
					background: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 190%)",
					filter: "blur(20px)"
				}}
			/>

			<div
				className="absolute inset-0 m-auto pointer-events-none z-20 block dark:hidden [@media(max-height:500px)]:hidden"
				style={{
					width: "300px",
					height: "300px",
					borderRadius: "80%",
					background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 190%)",
					filter: "blur(20px)"
				}}
			/>

			{/* Rive.app logo */}
			<div className="absolute inset-0 m-auto z-30 flex items-center justify-center pointer-events-none sm:pr-9 [@media(max-height:500px)]:hidden">
				<div className="w-60 sm:w-72 md:w-80 lg:w-[350px] aspect-square">
					{theme === "light" ? <LogoRiveDark /> : <LogoRiveLight />}
				</div>
			</div>

			<div className="pointer-events-auto absolute bottom-6 [@media(min-height:700px)]:bottom-16 [@media(min-height:900px)]:bottom-30 left-0 right-0 z-40 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 px-4">
				<Button asChild variant="default" size="lg" className="w-full sm:w-auto sm:min-w-42 shadow-md">
					<a href="#recruitment">
						<RocketIcon className="h-4 w-4" />
						{t("join")}
					</a>
				</Button>
				<Button
					asChild
					variant="outline"
					size="lg"
					className="w-full sm:w-auto sm:min-w-42 border-border bg-background/85 text-foreground shadow-md backdrop-blur-md hover:bg-accent/80 dark:bg-background/45"
				>
					<a href="#projects">
						<ZapIcon className="h-4 w-4" />
						{t("viewProjects")}
					</a>
				</Button>
			</div>
		</div>
	)
}

export default Welcome
