import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Long-form answer pages. The copy lives, word for word, in content/ai-search/*.md.
// Each file: frontmatter (title, description, target_url), the page body, a Schema (JSON-LD)
// section that this loader drops (schema is rebuilt from the visible text below).

export const BASE = "https://thelindleyteam.com";
const DIR = path.join(process.cwd(), "content", "ai-search");

// Which file serves which route.
export const AI_PAGES = [
  { file: "divorce-lending-rewrite.md", kind: "service", slug: "divorce-lending" },
  { file: "dscr-vs-conventional.md", kind: "compare", slug: "dscr-vs-conventional" },
  { file: "bank-statement-vs-conventional.md", kind: "compare", slug: "bank-statement-vs-conventional" },
  { file: "payment-vs-rate.md", kind: "compare", slug: "payment-vs-rate" },
] as const;

export type AiPage = {
  kind: "service" | "compare";
  slug: string;
  path: string; // e.g. /compare/payment-vs-rate
  title: string; // frontmatter title (meta title)
  description: string;
  h1: string;
  authors: string[];
  updated: string; // ISO date from the visible "Last updated" line
  bodyMd: string; // markdown without frontmatter, h1 and schema block
  html: string;
  topHtml: string; // body before the FAQ section
  afterFaqHtml: string; // body after the FAQ section (call to action, sources, compliance)
  faqs: { q: string; a: string }[];
  confirmCount: number;
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseDate(s: string): string | null {
  const m = s.match(/([A-Z][a-z]+) (\d{1,2}), (\d{4})/);
  if (!m) return null;
  const mi = MONTHS.indexOf(m[1]);
  if (mi < 0) return null;
  return `${m[3]}-${String(mi + 1).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
}

function parseFile(raw: string) {
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) throw new Error("missing frontmatter");
  const meta: Record<string, string> = {};
  for (const line of fm[1].split("\n")) {
    const m = line.match(/^(\w+):\s*"?(.*?)"?\s*(#.*)?$/);
    if (m) meta[m[1]] = m[2];
  }
  let body = raw.slice(fm[0].length);
  const schemaAt = body.indexOf("\n## Schema (JSON-LD)");
  if (schemaAt >= 0) body = body.slice(0, schemaAt);
  const h1m = body.match(/^# (.+)\n/m);
  const h1 = h1m ? h1m[1].trim() : meta.title;
  if (h1m) body = body.replace(h1m[0], "");
  return { meta, h1, body: body.trim() + "\n" };
}

function parseFaqs(body: string): { q: string; a: string }[] {
  const at = body.indexOf("## Frequently asked questions");
  if (at < 0) return [];
  let section = body.slice(at + "## Frequently asked questions".length);
  const next = section.search(/\n## /);
  if (next >= 0) section = section.slice(0, next);
  const out: { q: string; a: string }[] = [];
  for (const block of section.trim().split(/\n\s*\n/)) {
    const m = block.match(/^\*\*(.+?)\*\*\n([\s\S]+)$/);
    if (m) out.push({ q: m[1].trim(), a: m[2].replace(/\s*\n\s*/g, " ").trim() });
  }
  return out;
}

let cache: AiPage[] | null = null;

export function getAiPages(): AiPage[] {
  if (cache) return cache;
  cache = AI_PAGES.map((p) => {
    const { meta, h1, body } = parseFile(fs.readFileSync(path.join(DIR, p.file), "utf8"));
    const by = body.match(/^\*By (.+?)\. Last updated ([^*]+?)\.\*/m);
    const authors = by
      ? by[1].replace(/, CDLP$/, "").split(/ and /).map((s) => s.trim())
      : [];
    const updated = (by && parseDate(by[2])) || "2026-10-19";
    marked.setOptions({ gfm: true });
    const html = marked.parse(body, { async: false }) as string;
    const faqAt = body.indexOf("## Frequently asked questions");
    let top = body;
    let after = "";
    if (faqAt >= 0) {
      top = body.slice(0, faqAt);
      const rest = body.slice(faqAt + 5);
      const nx = rest.search(/\n## /);
      after = nx >= 0 ? rest.slice(nx + 1) : "";
    }
    const topHtml = marked.parse(top, { async: false }) as string;
    const afterFaqHtml = after ? (marked.parse(after, { async: false }) as string) : "";
    return {
      kind: p.kind,
      slug: p.slug,
      path: p.kind === "compare" ? `/compare/${p.slug}` : `/services/${p.slug}`,
      title: meta.title,
      description: meta.description,
      h1,
      authors,
      updated,
      bodyMd: body,
      html,
      topHtml,
      afterFaqHtml,
      faqs: parseFaqs(body),
      confirmCount: (body.match(/\[CONFIRM/g) || []).length,
    };
  });
  return cache;
}

export function getAiPage(kind: "service" | "compare", slug: string): AiPage | undefined {
  return getAiPages().find((p) => p.kind === kind && p.slug === slug);
}

// Clean markdown copy for /<path>.md and llms-full.txt.
export function aiPageMd(p: AiPage): string {
  return [`# ${p.h1}`, `Source: ${BASE}${p.path}`, "", p.bodyMd].join("\n");
}
