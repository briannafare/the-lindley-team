import type { MetadataRoute } from "next";
import { neighborhoods } from "@/lib/neighborhoods";
import { blogPosts } from "@/lib/blog-posts";

const BASE = "https://thelindleyteam.com";

// 10 mortgage service pages (individual static routes under /services/*)
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
];

export default function sitemap(): MetadataRoute.Sitemap {
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
