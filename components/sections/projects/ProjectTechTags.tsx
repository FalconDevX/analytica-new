import { cn } from "@/lib/utils"

type ProjectTechTagsProps = {
	tags: string[]
	className?: string
}

export function ProjectTechTags({ tags, className }: ProjectTechTagsProps) {
	return (
		<ul className={cn("mt-4 flex flex-wrap gap-2", className)} role="list">
			{tags.map((tag) => (
				<li
					key={tag}
					className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-1.5 font-mono text-[0.8125rem] leading-tight text-zinc-600 dark:border-border dark:bg-muted dark:text-muted-foreground"
				>
					{tag}
				</li>
			))}
		</ul>
	)
}
