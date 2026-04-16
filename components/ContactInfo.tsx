"use client"

import React, { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { Check, Mail, Instagram, Facebook, Linkedin, type LucideIcon } from "lucide-react"
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
		<div className="flex h-full w-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
			<h2 className="text-lg font-semibold tracking-tight text-foreground">{t("title")}</h2>
			<p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>

			<button
				type="button"
				onClick={handleCopy}
				aria-label={copied ? t("copied") : t("copyEmail")}
				aria-live="polite"
				className={cn(
					"mt-4 inline-flex min-h-11 items-center gap-3 rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer",
					copied
						? "border-green-500/60 bg-green-500/10 text-green-700 dark:text-green-400"
						: "border-border bg-background text-foreground hover:border-ring hover:bg-accent"
				)}
			>
				{copied ? (
					<Check className="h-4 w-4 shrink-0" aria-hidden="true" />
				) : (
					<Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
				)}
				<span className="break-all">{copied ? t("copied") : EMAIL}</span>
			</button>

			<div className="mt-4">
				<p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("followUs")}</p>
				<ul className="flex flex-wrap gap-2">
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
		</div>
	)
}

export default ContactInfo
