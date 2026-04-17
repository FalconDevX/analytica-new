import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getLocale } from "next-intl/server"
import { DeviceProvider } from "@/hooks/useDevice"
import LoadingScreen from "@/components/LoadingScreen"
import { LoadingProvider } from "@/components/LoadingProvider"
import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"]
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://analytica.agh.edu.pl"

const SITE_DESCRIPTION =
	"AGH Analytica – koło naukowe AGH w Krakowie zajmujące się analizą danych, GIS, uczeniem maszynowym i LLM. Realizujemy projekty z computer vision, analizy rynków finansowych i robotyki (RoboDog). Dołącz do rekrutacji."

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "AGH Analytica – Koło Naukowe Analizy Danych",
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
		canonical: "/",
		languages: {
			pl: "/",
			en: "/"
		}
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
		title: "AGH Analytica – Koło Naukowe Analizy Danych",
		description: SITE_DESCRIPTION,
		images: [
			{
				url: "/analytica_logo1-black.png",
				width: 1200,
				height: 1200,
				alt: "AGH Analytica – logo koła naukowego"
			}
		]
	},
	twitter: {
		card: "summary_large_image",
		title: "AGH Analytica – Koło Naukowe Analizy Danych",
		description: SITE_DESCRIPTION,
		images: ["/analytica_logo1-black.png"]
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
                try {
                  const theme = localStorage.getItem('theme') || 'system';
                  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
                try {
                  var device = new URLSearchParams(window.location.search).get('device');
                  if (device === 'mobile') document.documentElement.classList.add('device-mobile');
                  if (device === 'desktop') document.documentElement.classList.add('device-desktop');
                } catch (_) {}
              })();
            `
					}}
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100..900;1,100..900&family=Fira+Code:wght@300..700&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Questrial&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Winky+Sans:ital,wght@0,300..900;1,300..900&display=swap"
					rel="stylesheet"
				></link>
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
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme={false}>
						<LoadingProvider>
							<LoadingScreen />
							<DeviceProvider>{children}</DeviceProvider>
						</LoadingProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
