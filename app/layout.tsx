import type { Metadata } from "next"
import { Fira_Code } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { getMessages, getLocale } from "next-intl/server"
import { LocaleProvider } from "@/components/providers/LocaleProvider"
import { DeviceProvider } from "@/hooks/useDevice"
import LoadingScreen from "@/components/LoadingScreen"
import { LoadingProvider } from "@/components/LoadingProvider"
import { SITE_URL } from "@/lib/site"
import "./globals.css"

// The whole site is set in Fira Code; self-hosted by next/font (no render-blocking Google Fonts request).
const firaCode = Fira_Code({
	variable: "--font-fira-code",
	subsets: ["latin", "latin-ext"],
	display: "swap"
})

const SITE_DESCRIPTION =
	"Studenckie koło naukowe AGH rozwijające projekty z obszaru AI, analizy danych, GIS, computer vision i robotyki."

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "AGH Analytica — AI, Data Science i GIS",
		template: "%s | AGH Analytica"
	},
	description: SITE_DESCRIPTION,
	applicationName: "AGH Analytica",
	keywords: [
		"AGH Analytica",
		"koło naukowe AGH",
		"analiza danych",
		"data science",
		"machine learning",
		"uczenie maszynowe",
		"GIS",
		"LLM",
		"computer vision",
		"Kraków",
		"AGH",
		"Akademia Górniczo-Hutnicza",
		"studenckie koło naukowe"
	],
	authors: [{ name: "AGH Analytica", url: SITE_URL }],
	creator: "AGH Analytica",
	publisher: "AGH Analytica",
	category: "technology",
	alternates: {
		canonical: "/"
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-snippet": -1,
			"max-image-preview": "large",
			"max-video-preview": -1
		}
	},
	openGraph: {
		type: "website",
		locale: "pl_PL",
		alternateLocale: ["en_US"],
		url: SITE_URL,
		siteName: "AGH Analytica",
		title: "AGH Analytica — AI, Data Science i GIS",
		description: SITE_DESCRIPTION,
		images: [
			{
				url: "/project-geo.png",
				width: 1920,
				height: 1080,
				type: "image/png",
				alt: "AGH Analytica — koło naukowe AI, Data Science i GIS"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "AGH Analytica — AI, Data Science i GIS",
		description: SITE_DESCRIPTION,
		images: ["/project-geo.png"]
	},
	icons: {
		icon: [
			{ url: "/favicons/favicon.ico", sizes: "any" },
			{ url: "/favicons/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			{ url: "/favicons/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
			{ url: "/favicons/web-app-manifest-512x512.png", sizes: "512x512", type: "image/png" }
		],
		shortcut: "/favicons/favicon.ico",
		apple: "/favicons/apple-touch-icon.png"
	},
	manifest: "/favicons/site.webmanifest"
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const locale = await getLocale()
	const messages = await getMessages()
	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `
              (function() {
                // Theme class is applied by next-themes' own blocking script (defaultTheme="dark").
                try {
                  var device = new URLSearchParams(window.location.search).get('device');
                  if (device === 'mobile') document.documentElement.classList.add('device-mobile');
                  if (device === 'desktop') document.documentElement.classList.add('device-desktop');
                } catch (_) {}
              })();
            `
					}}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@graph": [
								{
									"@type": "Organization",
									"@id": `${SITE_URL}/#organization`,
									name: "AGH Analytica",
									alternateName: "Koło Naukowe AGH Analytica",
									url: SITE_URL,
									logo: `${SITE_URL}/analytica_logo1-black.png`,
									description: SITE_DESCRIPTION,
									email: "analytica@agh.edu.pl",
									foundingDate: "2024",
									parentOrganization: {
										"@type": "CollegeOrUniversity",
										name: "Akademia Górniczo-Hutnicza im. Stanisława Staszica w Krakowie",
										url: "https://www.agh.edu.pl"
									},
									address: {
										"@type": "PostalAddress",
										addressLocality: "Kraków",
										addressCountry: "PL"
									},
									sameAs: [
										"https://www.instagram.com/agh_analytica/",
										"https://www.facebook.com/p/AGH-Analytica-61569784207839/",
										"https://www.linkedin.com/company/agh-analytica/"
									]
								},
								{
									"@type": "WebSite",
									"@id": `${SITE_URL}/#website`,
									url: SITE_URL,
									name: "AGH Analytica",
									description: SITE_DESCRIPTION,
									publisher: { "@id": `${SITE_URL}/#organization` },
									inLanguage: ["pl-PL", "en-US"]
								}
							]
						})
					}}
				/>
			</head>
			<body className={`${firaCode.variable} antialiased`}>
				<LocaleProvider initialLocale={locale} initialMessages={messages}>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme={false}>
						<LoadingProvider>
							<LoadingScreen />
							<DeviceProvider>{children}</DeviceProvider>
						</LoadingProvider>
					</ThemeProvider>
				</LocaleProvider>
			</body>
		</html>
	)
}
