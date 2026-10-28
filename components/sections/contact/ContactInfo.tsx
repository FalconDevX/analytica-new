"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Copy, Mail, Send, Instagram, Facebook, Linkedin, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const EMAIL = "analytica@agh.edu.pl"

const SOCIAL_LINKS: Array<{
	name: string
	href: string
	icon: LucideIcon
	hoverClass: string
}> = [
	{
		name: "Instagram",
		href: "https://www.instagram.com/agh_analytica/",
		icon: Instagram,
		hoverClass: "hover:text-[#E1306C] hover:border-[#E1306C]"
	},
	{
		name: "Facebook",
		href: "https://www.facebook.com/p/AGH-Analytica-61569784207839/",
		icon: Facebook,
		hoverClass: "hover:text-[#5865F2] hover:border-[#5865F2]"
	},
	{
		name: "LinkedIn",
		href: "https://www.linkedin.com/company/agh-analytica/",
		icon: Linkedin,
		hoverClass: "hover:text-[#0A66C2] hover:border-[#0A66C2]"
	}
]

const ContactInfo = () => {
	const t = useTranslations("contact.info")
	const [copied, setCopied] = useState(false)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
		}
	}, [])

	const handleCopy = async () => {
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(EMAIL)
			} else {
				const textarea = document.createElement("textarea")
				textarea.value = EMAIL
				textarea.style.position = "fixed"
				textarea.style.opacity = "0"
				document.body.appendChild(textarea)
				textarea.select()
				document.execCommand("copy")
				document.body.removeChild(textarea)
			}
			setCopied(true)
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			timeoutRef.current = setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error("copy email error", err)
		}
	}

	return (
		<div className="flex w-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm md:p-10">
			<div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
				<Mail className="h-5 w-5 text-foreground" aria-hidden="true" />
			</div>

			<p className="mt-4 break-all text-lg font-semibold tracking-tight text-foreground sm:text-xl">{EMAIL}</p>

			<div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
				<Button asChild size="lg" className="w-full sm:w-auto">
					<a href={`mailto:${EMAIL}`}>
						<Send className="h-4 w-4" aria-hidden="true" />
						{t("writeEmail")}
					</a>
				</Button>
				<button
					type="button"
					onClick={handleCopy}
					aria-live="polite"
					className={cn(
						"inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors cursor-pointer sm:w-auto",
						copied
							? "border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-400"
							: "border-border bg-background text-foreground hover:border-ring hover:bg-accent"
					)}
				>
					{copied ? (
						<Check className="h-4 w-4 shrink-0" aria-hidden="true" />
					) : (
						<Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
					)}
					{copied ? t("copied") : t("copyEmail")}
				</button>
			</div>

			<div className="my-8 h-px w-full max-w-xs bg-linear-to-r from-transparent via-border to-transparent" aria-hidden />

			<p className="text-sm text-muted-foreground">{t("subtitle")}</p>
			<p className="mt-4 mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("followUs")}</p>
			<ul className="flex flex-wrap justify-center gap-2">
				{SOCIAL_LINKS.map(({ name, href, icon: Icon, hoverClass }) => (
					<li key={name}>
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={name}
							className={cn(
								"inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors duration-300",
								hoverClass
							)}
						>
							<Icon className="h-4 w-4" aria-hidden="true" />
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}

export default ContactInfo
