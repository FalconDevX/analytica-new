import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const LOCALES = ["pl", "en"] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get("NEXT_LOCALE")?.value;
  // Never trust the cookie as an import path — unknown values fall back to Polish.
  const locale: Locale = isLocale(fromCookie) ? fromCookie : "pl";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
