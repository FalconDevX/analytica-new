"use client"

import { useTranslations } from "next-intl"
import ContactInfo from "./ContactInfo"

const Contact = () => {
	const t = useTranslations("contact")

	return (
		<section
			id="contact"
			className="appear flex w-full scroll-mt-20 flex-col items-center px-5 py-12 md:px-0 md:py-16"
			aria-labelledby="contact-heading"
		>
			<h2
				id="contact-heading"
				className="text-balance px-6 text-center text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
			>
				{t("title")}
			</h2>
			<p className="mt-4 mb-10 max-w-lg text-balance text-center text-sm text-muted-foreground md:text-base">
				{t("subtitle")}
			</p>

			<div className="w-full max-w-xl">
				<ContactInfo />
			</div>
		</section>
	)
}

export default Contact
