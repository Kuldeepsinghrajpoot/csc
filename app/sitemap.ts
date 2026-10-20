import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

// Public pages only (dashboard, request, payment and api are left out on purpose)
const routes: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/about", priority: 0.7 },
  { path: "/services", priority: 0.8 },
  { path: "/govtPortal", priority: 0.8 },
  { path: "/mergeTwoImage", priority: 0.8 },
  { path: "/multiScan", priority: 0.8 },
  { path: "/passbook", priority: 0.6 },
  { path: "/contact", priority: 0.7 },
  { path: "/gallery", priority: 0.5 },
  { path: "/faq", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  }));
}
