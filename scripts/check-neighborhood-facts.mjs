// Fails the build if neighborhoods.ts regrows the kind of unsourced claim that
// shipped 188 fake testimonials, 90 invented Walk Scores and 306 made-up school
// ratings to production. Every rule below is something that was actually live.
//
// ponytail: a grep, not a schema validator. Escalate only if a real claim needs
// to pass — then add it to verified-facts and exempt it here by name.
import { readFileSync } from "node:fs";

const FILE = "src/lib/neighborhoods.ts";
const src = readFileSync(FILE, "utf8");

const RULES = [
  {
    name: "dollar figures",
    re: /\$\s?[\d,]+/g,
    why: "No price survived sourcing. Describe where a neighborhood sits in the market instead, and route the number to David & Bri for live comps.",
  },
  {
    name: "Walk/Bike/Transit Scores",
    re: /(walk|bike|transit)\s*scores?\s*(is|of|around|typically|:)?\s*\d+/gi,
    why: "Walk Score is a trademarked product. Republishing a number needs their API and the attribution their terms require — not an estimate.",
  },
  {
    name: "named rating services",
    re: /\b(GreatSchools|Niche)\b/g,
    why: "Attaching a fabricated figure to a real company's name is worse than a vague claim. Use directional language.",
  },
  {
    name: "graduation / proficiency percentages",
    re: /\d+%\s*(graduation|proficiency|math|reading)/gi,
    why: "These were generated, not measured. Say 'above state averages' or cite the district's own published report.",
  },
  {
    name: "testimonials",
    re: /quote:\s*"/g,
    why: "Only real, client-supplied quotes belong here — verbatim, with a name the person agreed to. Never write one.",
  },
];

let failed = false;
for (const { name, re, why } of RULES) {
  const hits = src.match(re);
  if (!hits) continue;
  failed = true;
  console.error(`\n✗ ${hits.length} ${name} in ${FILE}`);
  console.error(`  ${why}`);
  console.error(`  e.g. ${[...new Set(hits)].slice(0, 4).join("  ·  ")}`);
}

if (failed) {
  console.error("\nIf a claim here is genuinely sourced, say so in the commit and exempt it by name.\n");
  process.exit(1);
}
console.log(`✓ ${FILE}: no unsourced claims`);
