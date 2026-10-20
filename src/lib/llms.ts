import { services, type ServiceData } from "@/lib/services";
import { neighborhoods, type NeighborhoodData } from "@/lib/neighborhoods";
import { CALCULATOR_TOOLS, type CalculatorTool } from "@/lib/calculator-tools";
import { getAiPages, aiPageMd } from "@/lib/ai-search-pages";
import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";

export const BASE = "https://thelindleyteam.com";

// Same wording the site footer carries.
export const COMPLIANCE =
  "The Lindley Team at Movement Mortgage, LLC. Movement Mortgage, LLC is an Equal Housing Lender. NMLS ID #39179 (www.nmlsconsumeraccess.org). David Chandler NMLS #265974 · Brianna Lindley NMLS #1367416. Interest rates and products are subject to change without notice and may not be available at the time of loan commitment or rate lock. This is not a commitment to lend; terms and conditions apply; not all applicants will qualify. Licensed in OR & WA.";

type PostRow = { title: string; slug: string; excerpt?: string };

export async function getPosts(): Promise<PostRow[]> {
  try {
    const rows = await client.fetch<PostRow[]>(postsQuery);
    return Array.isArray(rows) ? rows.filter((r) => r?.slug && r?.title) : [];
  } catch {
    return [];
  }
}

const one = (s: string) => s.replace(/\s+/g, " ").trim();

export function serviceMd(s: ServiceData): string {
  return [
    `# ${s.name}`,
    `Source: ${BASE}/services/${s.slug}`,
    "",
    s.description,
    "",
    "## Who it is for",
    ...s.whoFor.map((x) => `- ${x}`),
    "",
    "## Requirements",
    ...s.requirements.map((r) => `- ${r.label}: ${r.value}`),
    "",
    "## Pros",
    ...s.pros.map((x) => `- ${x}`),
    "",
    "## Cons",
    ...s.cons.map((x) => `- ${x}`),
    "",
    "## Process",
    ...s.process.map((p) => `${p.step}. ${p.title}: ${p.desc}`),
    "",
    "## FAQ",
    ...s.faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    COMPLIANCE,
    "",
  ].join("\n");
}

export function neighborhoodMd(n: NeighborhoodData): string {
  return [
    `# ${n.name}, ${n.city}, ${n.state}`,
    `Source: ${BASE}/neighborhoods/${n.slug}`,
    "",
    ...n.description,
    "",
    n.personality,
    "",
    `- Region: ${n.region}`,
    `- School district: ${n.schoolDistrict}`,
    `- Commute to downtown: ${n.commuteToDowntown}`,
    "",
    "## FAQ",
    ...n.faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    COMPLIANCE,
    "",
  ].join("\n");
}

export function calculatorMd(c: CalculatorTool): string {
  return [
    `# ${c.name}`,
    `Source: ${BASE}/calculators/${c.slug}`,
    "",
    c.intro,
    "",
    `## ${c.question}`,
    c.answer,
    "",
    COMPLIANCE,
    "",
  ].join("\n");
}

export function findMd(kind: string, slug: string): string | null {
  const ai = getAiPages().find((p) => p.slug === slug && (kind === "compare" || kind === "services"));
  if (ai && ((kind === "compare" && ai.kind === "compare") || (kind === "services" && ai.kind === "service")))
    return aiPageMd(ai);
  if (kind === "services") {
    const s = services.find((x) => x.slug === slug);
    return s ? serviceMd(s) : null;
  }
  if (kind === "neighborhoods") {
    const n = neighborhoods.find((x) => x.slug === slug);
    return n ? neighborhoodMd(n) : null;
  }
  if (kind === "calculators") {
    const c = CALCULATOR_TOOLS.find((x) => x.slug === slug);
    return c ? calculatorMd(c) : null;
  }
  return null;
}

const HEAD = [
  "# The Lindley Team at Movement Mortgage",
  "",
  "> Portland-area mortgage team (David Chandler and Bri Lindley) at Movement Mortgage, licensed in Oregon and Washington. Home purchase, refinance, divorce lending, self-employed (bank statement) and investor (DSCR) loans.",
  "",
  `Service, comparison, neighborhood and calculator pages are also available as clean markdown at the same URL with .md added (for example ${BASE}/services/divorce-lending.md).`,
  "",
];

export async function buildLlmsTxt(): Promise<string> {
  const posts = await getPosts();
  const out = [...HEAD];
  out.push("## Services");
  for (const s of services) {
    const ai = getAiPages().find((p) => p.kind === "service" && p.slug === s.slug);
    out.push(`- [${s.name}](${BASE}/services/${s.slug}): ${one(ai ? ai.description : s.seo.description)}`);
  }
  out.push("", "## Comparisons");
  for (const p of getAiPages().filter((x) => x.kind === "compare"))
    out.push(`- [${p.h1}](${BASE}${p.path}): ${one(p.description)}`);
  out.push("", "## Calculators");
  out.push(`- [All calculators](${BASE}/calculators): Mortgage calculators and tools.`);
  for (const c of CALCULATOR_TOOLS)
    out.push(`- [${c.name}](${BASE}/calculators/${c.slug}): ${one(c.metaDescription)}`);
  out.push("", "## Neighborhoods");
  out.push(`- [All neighborhoods](${BASE}/neighborhoods): Portland-area neighborhood guides.`);
  for (const n of neighborhoods)
    out.push(`- [${n.name}](${BASE}/neighborhoods/${n.slug}): ${one(n.seo.description)}`);
  out.push("", "## Market Read");
  out.push(
    `- [The Portland Market Read](${BASE}/market-read): A once-a-month read on what Portland's housing numbers did and where they came from.`
  );
  out.push("", "## Blog");
  out.push(`- [Blog](${BASE}/blog): Articles on mortgages, divorce lending and home buying.`);
  for (const p of posts)
    out.push(`- [${p.title}](${BASE}/blog/${p.slug})${p.excerpt ? `: ${one(p.excerpt)}` : ""}`);
  out.push("", "## Company", `- [About](${BASE}/about): The team.`, `- [Contact](${BASE}/contact): Reach the team.`, "", COMPLIANCE, "");
  return out.join("\n");
}

export async function buildLlmsFull(): Promise<string> {
  const parts = [HEAD.join("\n"), "Blog post bodies are not included here; see the blog index.", ""];
  parts.push("# Services\n");
  for (const s of services) {
    const ai = getAiPages().find((p) => p.kind === "service" && p.slug === s.slug);
    parts.push(ai ? aiPageMd(ai) : serviceMd(s), "---\n");
  }
  parts.push("# Comparisons\n");
  for (const p of getAiPages().filter((x) => x.kind === "compare")) parts.push(aiPageMd(p), "---\n");
  parts.push("# Calculators\n");
  for (const c of CALCULATOR_TOOLS) parts.push(calculatorMd(c), "---\n");
  parts.push("# Neighborhoods\n");
  for (const n of neighborhoods) parts.push(neighborhoodMd(n), "---\n");
  return parts.join("\n");
}
