import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://analytica.agh.edu.pl"

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date()
	return [
		{
			url: SITE_URL,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1
		},
		{
			url: `${SITE_URL}/#about`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8
		},
		{
			url: `${SITE_URL}/#projects`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8
		},
		{
			url: `${SITE_URL}/#recruitment`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 0.9
		},
		{
			url: `${SITE_URL}/#contact`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.6
		}
	]
}
