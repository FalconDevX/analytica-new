"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Mail, Instagram, Facebook, Linkedin, type LucideIcon } from "lucide-react"
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
		hoverClass: "hover:text-[#E1306C] hover:border-[#E1306C]",
	},
	{
		name: "Facebook",
		href: "https://www.facebook.com/p/AGH-Analytica-61569784207839/",
		icon: Facebook,
		hoverClass: "hover:text-[#5865F2] hover:border-[#5865F2]",
	},
	{
		name: "LinkedIn",
		href: "https://www.linkedin.com/company/agh-analytica/",
		icon: Linkedin,
		hoverClass: "hover:text-[#0A66C2] hover:border-[#0A66C2]",
	},
]

const ContactInfo = () => {
	const t = useTranslations("contact.info")

	return (
		<div className="flex h-full w-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
			<h2 className="text-lg font-semibold tracking-tight text-foreground">{t("title")}</h2>
			<p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>

			<a
				href={`mailto:${EMAIL}`}
				className="mt-4 inline-flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-ring hover:bg-accent"
			>
				<Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
				<span className="truncate">{EMAIL}</span>
			</a>

			<div className="mt-4">
				<p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
					{t("followUs")}
				</p>
				<ul className="flex flex-wrap gap-2">
					{SOCIAL_LINKS.map(({ name, href, icon: Icon, hoverClass }) => (
						<li key={name}>
							<a
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={name}
								className={cn(
									"inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors duration-300",
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
