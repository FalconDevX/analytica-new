"use client"
import { useTranslations } from "next-intl"
import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react"
import ModeToggle from "./ModeToggle"
import Flags from "./Flags"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavbarSectionIndicator } from "./NavbarSectionIndicator"
import { useDevice } from "@/hooks/useDevice"
import { cn } from "@/lib/utils"

const navLinkBase =
	"relative inline-block px-4 py-2 rounded-lg transition-all duration-300 text-md cursor-pointer whitespace-nowrap hover:bg-gray-100 dark:hover:bg-white/10"

const navLinkClassDesktop = (activeSection: string, section: string) =>
	`${navLinkBase} ${
		activeSection === section ? "font-medium text-black dark:text-white" : "opacity-70 hover:opacity-100"
	}`

const navLinkClassMobile = (activeSection: string, section: string) =>
	`w-full px-3 py-2 rounded-md transition-colors duration-200 text-sm cursor-pointer whitespace-nowrap ${
		activeSection === section
			? "bg-primary text-primary-foreground font-medium shadow-sm"
			: "text-foreground hover:bg-accent hover:text-accent-foreground"
	}`

const sections = ["home", "about", "projects", "recruitment", "contact"] as const
type SectionId = (typeof sections)[number]

const Navbar = () => {
	const t = useTranslations("navbar")
	const { isForcedMobile } = useDevice()
	const [isOpen, setIsOpen] = useState(false)
	const [activeSection, setActiveSection] = useState<SectionId>("home")
	const [indicator, setIndicator] = useState({ left: 0, width: 0 })
	const navShellRef = useRef<HTMLDivElement>(null)
	const desktopNavRef = useRef<HTMLDivElement>(null)
	const pendingSectionRef = useRef<SectionId | null>(null)
	const sectionVisibilityRef = useRef<Record<SectionId, number>>({
		home: 0,
		about: 0,
		projects: 0,
		recruitment: 0,
		contact: 0
	})

	const applyActiveSection = useCallback((section: SectionId) => {
		setActiveSection((current) => (current === section ? current : section))
	}, [])

	const selectSection = useCallback(
		(section: SectionId) => {
			pendingSectionRef.current = section
			applyActiveSection(section)
		},
		[applyActiveSection]
	)

	const updateIndicator = useCallback(() => {
		const shell = navShellRef.current
		const parent = desktopNavRef.current
		if (!shell || !parent) return
		const el = parent.querySelector<HTMLAnchorElement>(`a[href="#${activeSection}"]`)
		if (!el) return
		const rect = el.getBoundingClientRect()
		const shellRect = shell.getBoundingClientRect()
		setIndicator({
			left: rect.left - shellRect.left,
			width: rect.width
		})
	}, [activeSection])

	useLayoutEffect(() => {
		updateIndicator()
		window.addEventListener("resize", updateIndicator)
		return () => window.removeEventListener("resize", updateIndicator)
	}, [updateIndicator])

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsOpen(false)
			}
		}

		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const id = entry.target.id as SectionId
					sectionVisibilityRef.current[id] = entry.isIntersecting ? entry.intersectionRatio : 0
				})

				const pendingSection = pendingSectionRef.current
				if (pendingSection) {
					const pendingVisibility = sectionVisibilityRef.current[pendingSection] ?? 0
					if (pendingVisibility < 0.35) return
					pendingSectionRef.current = null
					applyActiveSection(pendingSection)
					return
				}

				const bestSection = sections.reduce((currentBest, section) =>
					sectionVisibilityRef.current[section] > sectionVisibilityRef.current[currentBest] ? section : currentBest
				)

				if (sectionVisibilityRef.current[bestSection] > 0) {
					applyActiveSection(bestSection)
				}
			},
			{
				threshold: [0.2, 0.35, 0.5, 0.65],
				rootMargin: "-64px 0px -20% 0px"
			}
		)

		sections.forEach((id) => {
			const el = document.getElementById(id)
			if (el) observer.observe(el)
		})

		return () => observer.disconnect()
	}, [applyActiveSection])
	return (
		<div ref={navShellRef} className="fixed top-0 left-0 right-0 z-50 h-16">
			<NavbarSectionIndicator
				left={indicator.left}
				width={indicator.width}
				className={cn("hidden lg:block", isForcedMobile && "lg:hidden")}
			/>
			<div
				className="pointer-events-none absolute inset-0 z-1 bg-white/30 backdrop-blur-lg dark:bg-black/30"
				aria-hidden
			/>
			<div className="relative z-10 flex h-full w-full items-center justify-center gap-2 sm:gap-4 lg:gap-8">
				<div className="flex min-w-0 flex-1 lg:w-1/3 flex-row pl-3 lg:pl-10">
					<div
						onClick={() => {
							window.location.href = "/"
						}}
						className="flex min-w-0 items-center justify-center cursor-pointer"
					>
						<img
							src="/analytica_logo1-white.png"
							alt="logo"
							className="w-10 h-10 hidden dark:block object-cover shrink-0"
						/>
						<img
							src="/text-logo-white.png"
							alt="logo"
							className="w-auto h-10 pt-1 hidden dark:sm:block object-cover shrink-0"
						/>

						<img src="/analytica_logo1-black.png" alt="logo" className="w-10 h-10 dark:hidden object-cover shrink-0" />
						<img
							src="/text-logo-black.png"
							alt="logo"
							className="w-auto h-10 pt-1 hidden sm:block dark:hidden object-cover shrink-0"
						/>
					</div>
				</div>
				<div
					ref={desktopNavRef}
					className={cn(
						"relative hidden lg:flex lg:w-1/3 items-center justify-center gap-2",
						isForcedMobile && "lg:hidden"
					)}
				>
					<a href="#home" className={navLinkClassDesktop(activeSection, "home")} onClick={() => selectSection("home")}>
						{t("home")}
					</a>
					<a
						href="#about"
						className={navLinkClassDesktop(activeSection, "about")}
						onClick={() => selectSection("about")}
					>
						{t("about")}
					</a>
					<a
						href="#projects"
						className={navLinkClassDesktop(activeSection, "projects")}
						onClick={() => selectSection("projects")}
					>
						{t("projects")}
					</a>
					<a
						href="#recruitment"
						className={navLinkClassDesktop(activeSection, "recruitment")}
						onClick={() => selectSection("recruitment")}
					>
						{t("recruitment")}
					</a>
					<a
						href="#contact"
						className={navLinkClassDesktop(activeSection, "contact")}
						onClick={() => selectSection("contact")}
					>
						{t("contact")}
					</a>
				</div>

				<div className="flex cursor-default flex-row items-center justify-end gap-2 sm:gap-3 lg:gap-4 pr-3 lg:pr-10 lg:w-1/3 shrink-0">
					<Flags />

					<ModeToggle />

					<DropdownMenu modal={false} open={isOpen} onOpenChange={setIsOpen}>
						<DropdownMenuTrigger asChild>
							<Button
								className={cn("lg:hidden min-h-11 min-w-11 cursor-pointer", isForcedMobile && "lg:inline-flex")}
							>
								<MenuIcon className="w-4 h-4" />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end" sideOffset={8} className="min-w-44 flex flex-col gap-1 p-2">
							<DropdownMenuItem
								className={navLinkClassMobile(activeSection, "home")}
								onClick={() => {
									selectSection("home")
									window.location.href = "/"
								}}
							>
								{t("home")}
							</DropdownMenuItem>
							<DropdownMenuItem
								className={navLinkClassMobile(activeSection, "about")}
								onClick={() => {
									selectSection("about")
									window.location.href = "/#about"
								}}
							>
								{t("about")}
							</DropdownMenuItem>
							<DropdownMenuItem
								className={navLinkClassMobile(activeSection, "projects")}
								onClick={() => {
									selectSection("projects")
									window.location.href = "/#projects"
								}}
							>
								{t("projects")}
							</DropdownMenuItem>
							<DropdownMenuItem
								className={navLinkClassMobile(activeSection, "recruitment")}
								onClick={() => {
									selectSection("recruitment")
									window.location.href = "/#recruitment"
								}}
							>
								{t("recruitment")}
							</DropdownMenuItem>
							<DropdownMenuItem
								className={navLinkClassMobile(activeSection, "contact")}
								onClick={() => {
									selectSection("contact")
									window.location.href = "/#contact"
								}}
							>
								{t("contact")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	)
}

export default Navbar
