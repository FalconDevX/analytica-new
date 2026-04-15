import { getTranslations } from "next-intl/server"
import { Button } from "./ui/button"
import { Check, ClipboardList, ExternalLink, FileText, Lock } from "lucide-react"

const RECRUITMENT_FORM_URL =
	"https://forms.office.com/pages/responsepage.aspx?id=PwOxgOAhgkq7wPBf3M07yB8HzU5gEPdPonFPkvWv1hJUMTM3R1QzVFI2SzNVMEhTNTJPUjZTSEdLTS4u&route=shorturl"

export default async function Recruitment() {
	const t = await getTranslations("recruitment")
	const benefits = [1, 2, 3, 4, 5, 6].map((n) => t(`benefit_${n}`))

	return (
		<section
			id="recruitment"
			className="appear flex w-full scroll-mt-20 flex-col items-center px-5 py-12 sm:px-0"
			aria-labelledby="recruitment-heading"
		>
			<div className="grid w-full max-w-6xl gap-10 md:grid-cols-2 md:items-start md:gap-12">
				<div className="flex flex-col gap-5">
					<span className="w-fit rounded-full border border-emerald-600/25 bg-emerald-600/8 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
						{t("badge")}
					</span>
					<h2
						id="recruitment-heading"
						className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
					>
						<span>{t("title_lead")} </span>
						<span className="font-bold">{t("title_accent")}</span>
					</h2>
					<p className="max-w-xl whitespace-pre-line text-base leading-relaxed text-muted-foreground">
						{t("description")}
					</p>
					<ul className="flex max-w-xl flex-col gap-3" role="list">
						{benefits.map((line) => (
							<li key={line} className="flex gap-3 text-sm text-foreground md:text-base">
								<span
									className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-muted"
									aria-hidden
								>
									<Check className="h-3 w-3 text-foreground" strokeWidth={2.5} />
								</span>
								<span>{line}</span>
							</li>
						))}
					</ul>
				</div>

				<div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
					<div className="mb-5 flex justify-center">
						<div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted">
							<ClipboardList className="h-6 w-6 text-foreground" aria-hidden />
						</div>
					</div>
					<h3 className="text-center text-lg font-semibold text-card-foreground">{t("card_title")}</h3>
					<div className="mt-6 grid grid-cols-3 gap-3 text-center">
						{[1, 2, 3].map((step) => (
							<div key={step} className="flex flex-col items-center gap-2">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
									{step}
								</div>
								<p className="text-balance text-xs leading-snug text-muted-foreground">{t(`step_${step}`)}</p>
							</div>
						))}
					</div>
					<Button asChild variant="default" size="lg" className="mt-8 w-full rounded-md shadow-sm">
						<a href={RECRUITMENT_FORM_URL} target="_blank" rel="noopener noreferrer" className="gap-2">
							<ExternalLink className="h-4 w-4" aria-hidden />
							{t("cta")}
						</a>
					</Button>
					<div className="mt-5 flex flex-col items-center gap-3 text-center text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-1">
						<span className="inline-flex max-w-sm items-start justify-center gap-1.5 sm:max-w-none">
							<Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
							{t("privacy")}
						</span>
						<a
							href="/Regulamin.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 underline underline-offset-2 transition-colors hover:text-foreground"
						>
							<FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
							{t("regulations_link")}
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}
