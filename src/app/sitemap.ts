import type { MetadataRoute } from "next";
import { neighborhoods } from "@/lib/neighborhoods";
import { client } from "@/sanity/lib/client";
import { sitemapQuery } from "@/sanity/lib/queries";

const BASE = "https://thelindleyteam.com";

// Mortgage service pages (individual static routes under /services/*)
const SERVICE_SLUGS = [
  "purchase",
  "refinance",
  "divorce-lending",
  "fha",
  "va",
  "jumbo",
  "heloc",
  "cash-out",
  "investment",
  "reverse-mortgage",
  "conventional",
  "usda",
  "new-construction",
  "bank-statement",
  "dscr",
  "down-payment-assistance",
];

const STATIC = [
  { path: "", priority: 1.0, freq: "weekly" as const },
  { path: "/about", priority: 0.8, freq: "monthly" as const },
  { path: "/services", priority: 0.9, freq: "weekly" as const },
  { path: "/neighborhoods", priority: 0.9, freq: "weekly" as const },
  { path: "/blog", priority: 0.7, freq: "weekly" as const },
  { path: "/calculator", priority: 0.6, freq: "monthly" as const },
  { path: "/contact", priority: 0.8, freq: "monthly" as const },
  { path: "/apply", priority: 0.8, freq: "monthly" as const },
  { path: "/first-time-buyer", priority: 0.9, freq: "monthly" as const },
  { path: "/privacy", priority: 0.3, freq: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await client.fetch<
    { slug: string; date: string; updatedAt?: string }[]
  >(sitemapQuery);

  const now = new Date();

  const staticRoutes = STATIC.map((s) => ({
    url: `${BASE}${s.path}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));

  const serviceRoutes = SERVICE_SLUGS.map((slug) => ({
    url: `${BASE}/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const neighborhoodRoutes = neighborhoods.map((n) => ({
    url: `${BASE}/neighborhoods/${n.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...neighborhoodRoutes, ...blogRoutes];
}
