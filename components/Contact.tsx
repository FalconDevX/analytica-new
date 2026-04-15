"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

const fieldClass = cn(
	"w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground shadow-sm",
	"placeholder:text-muted-foreground",
	"transition-[color,box-shadow,border-color]",
	"focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
)

const Contact = () => {
	const t = useTranslations("contact")
	const [username, setUsername] = useState("")
	const [email, setEmail] = useState("")
	const [message, setMessage] = useState("")
	const [status, setStatus] = useState<"success" | "error" | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		setIsSubmitting(true)
		setStatus(null)

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					name: username,
					email: email,
					message: message
				})
			})

			if (res.ok) {
				setStatus("success")
				setUsername("")
				setEmail("")
				setMessage("")
			} else {
				setStatus("error")
			}
		} catch {
			setStatus("error")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div
			id="contact"
			className="appear flex min-h-[70vh] w-full scroll-mt-20 flex-col items-center px-5 py-8 md:px-0"
		>
			<h1 className="p-6 text-2xl font-semibold tracking-tight text-foreground">{t("title")}</h1>
			<p className="mb-8 max-w-lg text-balance text-center text-sm text-muted-foreground md:text-base">
				{t("subtitle")}
			</p>

			<div className="w-full max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className={fieldClass}
						type="text"
						name="name"
						autoComplete="name"
						required
						placeholder={t("form.name")}
						aria-label={t("form.name")}
					/>
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={fieldClass}
						type="email"
						name="email"
						autoComplete="email"
						required
						placeholder={t("form.email")}
						aria-label={t("form.email")}
					/>
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className={cn(fieldClass, "min-h-28 resize-y")}
						name="message"
						required
						placeholder={t("form.message")}
						aria-label={t("form.message")}
					/>
					<Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
						{isSubmitting ? t("form.sending") : t("form.send")}
					</Button>
				</form>

				{status === "success" && (
					<p
						className="mt-4 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400"
						role="status"
					>
						{t("status.success")}
					</p>
				)}
				{status === "error" && (
					<p className="mt-4 text-center text-sm font-medium text-destructive" role="alert">
						{t("status.error")}
					</p>
				)}
			</div>
		</div>
	)
}

export default Contact
