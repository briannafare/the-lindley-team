import type { MetadataRoute } from "next";

const BASE = "https://thelindleyteam.com";

// Allow all major search + answer/generative-engine crawlers; point them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Named explicitly so no one narrows "*" later and shuts out AI search crawlers by accident.
      { userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot"], allow: "/" },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
