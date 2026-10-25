#!/usr/bin/env node
// Notify IndexNow (Bing and other engines) about new or changed URLs.
// Usage:
//   node scripts/indexnow.mjs                      # reads the live sitemap
//   node scripts/indexnow.mjs https://thelindleyteam.com/a https://thelindleyteam.com/b
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HOST = "thelindleyteam.com";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const CHUNK = 10000;

// The key is the name of the 32-char hex .txt file in public/.
const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const keyFile = readdirSync(publicDir).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("No IndexNow key file found in public/");
  process.exit(1);
}
const key = keyFile.replace(".txt", "");
const keyLocation = `https://${HOST}/${keyFile}`;

async function urlsFromSitemap(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  // Follow a sitemap index one level down.
  if (/<sitemapindex/i.test(xml)) {
    const nested = [];
    for (const loc of locs) nested.push(...(await urlsFromSitemap(loc)));
    return nested;
  }
  return locs;
}

const args = process.argv.slice(2);
const urlList = [...new Set(args.length ? args : await urlsFromSitemap(SITEMAP))];
if (!urlList.length) {
  console.error("No URLs to submit.");
  process.exit(1);
}

let failed = false;
for (let i = 0; i < urlList.length; i += CHUNK) {
  const chunk = urlList.slice(i, i + CHUNK);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList: chunk }),
  });
  console.log(`Submitted ${chunk.length} URLs: HTTP ${res.status}`);
  if (res.status !== 200 && res.status !== 202) failed = true;
}
process.exit(failed ? 1 : 0);
