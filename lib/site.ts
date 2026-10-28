// Single source of truth for the public site URL (metadata, robots, sitemap).
// Set NEXT_PUBLIC_SITE_URL when the site moves to its final domain.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://analytica-new.vercel.app").replace(/\/$/, "")
