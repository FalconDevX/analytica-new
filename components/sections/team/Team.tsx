"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { User } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

type MemberSize = "default" | "lead" | "supervisor"

type TeamMemberConfig = {
	id: string
	image?: string
	size?: MemberSize
}

type TeamGroupConfig = {
	groupId: "supervisors" | "leadership" | "team"
	members: TeamMemberConfig[]
}

const TEAM_LAYOUT: TeamGroupConfig[] = [
	{
		groupId: "supervisors",
		members: [
			{ id: "opiekun_zietek", image: "/team/drS%C5%82awomirZi%C4%99tek.jpg", size: "supervisor" },
			{ id: "opiekun_grochot", image: "/team/drKrzysztofGrochot.jpg", size: "supervisor" }
		]
	},
	{
		groupId: "leadership",
		members: [
			{ id: "prezes", image: "/team/NorbertJarzmik.png", size: "lead" },
			{ id: "wiceprezes", image: "/team/%C5%81ukaszMusia%C5%82.png", size: "lead" },
			{ id: "sekretarz", image: "/team/WojciechKocemba.png", size: "lead" },
			{ id: "skarbnik", size: "lead" },
			{ id: "czlonek_4", image: "/team/PiotrBugiel.png", size: "lead" }
		]
	},
	{
		groupId: "team",
		members: [
			{ id: "koordynator_anna", image: "/team/AnnaNowosadzka.png" },
			{ id: "koordynator_olga", image: "/team/OlgaEhrenfeld.png" },
			{ id: "marketing_karolina" },
			{ id: "marketing_paulina" }
		]
	}
]

const sizeClasses: Record<MemberSize, { avatar: string; name: string }> = {
	default: {
		avatar: "h-24 w-24 sm:h-28 sm:w-28",
		name: "text-sm sm:text-base"
	},
	lead: {
		avatar: "h-28 w-28 sm:h-32 sm:w-32",
		name: "text-sm sm:text-base"
	},
	supervisor: {
		avatar: "h-28 w-28 sm:h-32 sm:w-32",
		name: "text-sm sm:text-base"
	}
}

const listVariants = {
	hidden: {},
	visible: { transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
	hidden: { opacity: 0, y: 18 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
}

function MemberAvatar({
	name,
	role,
	image,
	size = "default",
	highlight = false
}: {
	name: string
	role: string
	image?: string
	size?: MemberSize
	highlight?: boolean
}) {
	const [imgError, setImgError] = useState(false)
	const prefersReducedMotion = useReducedMotion()
	const showImage = Boolean(image) && !imgError
	const styles = sizeClasses[size]

	return (
		<motion.div
			className="group flex flex-col items-center gap-2.5 text-center"
			whileHover={prefersReducedMotion ? undefined : { y: -4 }}
			transition={{ type: "spring", stiffness: 400, damping: 22 }}
		>
			<motion.div
				className={cn(
					"relative shrink-0 overflow-hidden rounded-full transition-shadow duration-300",
					styles.avatar,
					highlight
						? "ring-2 ring-emerald-600/70 ring-offset-2 ring-offset-background dark:ring-emerald-500/60"
						: "ring-2 ring-border ring-offset-2 ring-offset-background",
					!showImage && "border-2 border-dashed border-muted-foreground/35 bg-muted",
					"group-hover:shadow-[0_0_18px_rgba(0,0,0,0.22)] dark:group-hover:shadow-[0_0_22px_rgba(255,255,255,0.15)]"
				)}
				whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
				transition={{ type: "spring", stiffness: 320, damping: 20 }}
			>
				{showImage ? (
					<img
						src={image}
						alt={`${name}, ${role}`}
						className="h-full w-full object-cover"
						onError={() => setImgError(true)}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<User
							className={cn(
								"text-muted-foreground/45",
								size === "supervisor" ? "h-11 w-11" : "h-9 w-9"
							)}
							strokeWidth={1.5}
							aria-hidden
						/>
					</div>
				)}

				<div
					className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-linear-to-r from-transparent via-black/20 to-transparent opacity-0 transition-[transform,opacity] duration-600 ease-out group-hover:translate-x-full group-hover:opacity-100 dark:via-white/12"
					aria-hidden
				/>
			</motion.div>

			<div className="max-w-44 sm:max-w-48">
				<p className={cn("font-semibold leading-snug text-foreground", styles.name)}>{name}</p>
				<p className="mt-0.5 text-xs leading-snug text-muted-foreground sm:text-sm">{role}</p>
			</div>
		</motion.div>
	)
}

function MemberGrid({
	groupId,
	members,
	t
}: {
	groupId: TeamGroupConfig["groupId"]
	members: TeamMemberConfig[]
	t: ReturnType<typeof useTranslations>
}) {
	const gridClass =
		groupId === "supervisors"
			? "grid-cols-2 max-w-md mx-auto gap-8"
			: groupId === "leadership"
				? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-6"
				: "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6"

	return (
		<motion.ul
			className={cn("grid w-full", gridClass)}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.15 }}
			variants={listVariants}
			role="list"
		>
			{members.map((member) => (
				<motion.li key={member.id} variants={itemVariants} className="flex justify-center">
					<MemberAvatar
						name={t(`members.${member.id}.name`)}
						role={t(`members.${member.id}.role`)}
						image={member.image}
						size={member.size}
						highlight={member.id === "prezes"}
					/>
				</motion.li>
			))}
		</motion.ul>
	)
}

const Team = () => {
	const t = useTranslations("team")

	return (
		<section
			id="team"
			className="appear flex w-full scroll-mt-20 flex-col items-center py-12 md:py-20"
			aria-labelledby="team-heading"
		>
			<motion.h2
				id="team-heading"
				className="text-balance px-6 text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
				initial={{ opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.6 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				{t("title")}
			</motion.h2>

			<div className="mt-12 flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-0">
				{TEAM_LAYOUT.map((group, index) => (
					<div key={group.groupId}>
						{index > 0 && (
							<div
								className="mx-auto mb-5 h-px w-full max-w-xs bg-linear-to-r from-transparent via-border to-transparent"
								aria-hidden
							/>
						)}
						<motion.h3
							className="mb-10 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4 }}
						>
							{t(`groups.${group.groupId}`)}
						</motion.h3>
						<MemberGrid groupId={group.groupId} members={group.members} t={t} />
					</div>
				))}
			</div>
		</section>
	)
}

export default Team
