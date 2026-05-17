"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { NextIntlClientProvider } from "next-intl"

export type AppLocale = "pl" | "en"

type LocaleContextValue = {
	locale: AppLocale
	setLocale: (locale: AppLocale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useAppLocale() {
	const ctx = useContext(LocaleContext)
	if (!ctx) {
		throw new Error("useAppLocale must be used within LocaleProvider")
	}
	return ctx
}

function isAppLocale(value: string | null | undefined): value is AppLocale {
	return value === "pl" || value === "en"
}

function persistLocale(locale: AppLocale) {
	try {
		localStorage.setItem("NEXT_LOCALE", locale)
	} catch {
		// localStorage may be unavailable in rare privacy modes
	}

	const secure = typeof window !== "undefined" && window.location.protocol === "https:"
	const sameSite = secure ? "; SameSite=None; Secure" : ""
	document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000${sameSite}`
}

async function loadMessages(locale: AppLocale) {
	return (await import(`@/messages/${locale}.json`)).default
}

function readStoredLocale(): AppLocale | null {
	try {
		const stored = localStorage.getItem("NEXT_LOCALE")
		return isAppLocale(stored) ? stored : null
	} catch {
		return null
	}
}

function readLocaleFromUrl(): AppLocale | null {
	try {
		const fromUrl = new URLSearchParams(window.location.search).get("locale")
		return isAppLocale(fromUrl) ? fromUrl : null
	} catch {
		return null
	}
}

type LocaleProviderProps = {
	children: ReactNode
	initialLocale: string
	initialMessages: Record<string, unknown>
}

export function LocaleProvider({ children, initialLocale, initialMessages }: LocaleProviderProps) {
	const [locale, setLocaleState] = useState<AppLocale>(isAppLocale(initialLocale) ? initialLocale : "pl")
	const [messages, setMessages] = useState(initialMessages)

	const applyLocale = useCallback(async (next: AppLocale) => {
		persistLocale(next)
		const nextMessages = await loadMessages(next)
		setLocaleState(next)
		setMessages(nextMessages)
		document.documentElement.lang = next
	}, [])

	useEffect(() => {
		const preferred = readLocaleFromUrl() ?? readStoredLocale()
		if (preferred && preferred !== locale) {
			void applyLocale(preferred)
		}
		// Restore saved / URL locale once on mount (iframe-safe; no server cookie required).
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const setLocale = useCallback(
		(next: AppLocale) => {
			void applyLocale(next)
		},
		[applyLocale]
	)

	return (
		<LocaleContext.Provider value={{ locale, setLocale }}>
			<NextIntlClientProvider locale={locale} messages={messages}>
				{children}
			</NextIntlClientProvider>
		</LocaleContext.Provider>
	)
}
