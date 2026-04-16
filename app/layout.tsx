import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "next-themes"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getLocale } from "next-intl/server"
import { DeviceProvider } from "@/hooks/useDevice"
import "./globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"]
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
})

export const metadata: Metadata = {
	title: "AGH Analytica",
	description: "AGH Analytica - Koło Naukowe",
	icons: {
		icon: [
			{ url: "/analytica_logo1-black.png", media: "(prefers-color-scheme: light)" },
			{ url: "/analytica_logo1-white.png", media: "(prefers-color-scheme: dark)" }
		],
		shortcut: "/analytica_logo1-black.png",
		apple: "/analytica_logo1-black.png"
	}
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
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="dark" enableSystem enableColorScheme={false}>
						<DeviceProvider>{children}</DeviceProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
