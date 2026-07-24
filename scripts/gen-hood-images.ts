/**
 * Batch-generate photorealistic editorial hero images for every neighborhood
 * that doesn't have one yet, via Ideogram on fal.ai. Each neighborhood's real
 * landmark/street/housing (from its data) grounds the prompt, so 85 images read
 * as one publication (per the Lindley imagery brief: Portra 400, documentary,
 * no posed people). The detail page reuses each hero for the B&W feeling band.
 *
 *   Dry run (writes all prompts to scripts/hood-prompts.md, no API calls, no cost):
 *     npx tsx scripts/gen-hood-images.ts
 *   Live run (needs a valid FAL_KEY in the framework .env):
 *     LIVE=1 npx tsx scripts/gen-hood-images.ts
 *
 * Output: public/img/hood-<slug>.webp per neighborhood + scripts/generated-hoods.json.
 * Wiring is automatic once `image` is set in neighborhoods.ts (see patch step at end).
 */
import { neighborhoods, NeighborhoodData } from "../src/lib/neighborhoods";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";
import { homedir } from "os";

const LIVE = process.env.LIVE === "1";
const MODEL = process.env.FAL_MODEL || "fal-ai/ideogram/v3";
const CONCURRENCY = Number(process.env.CONCURRENCY || 3);
const OUT = "public/img";

function falKey(): string {
  const env = readFileSync(`${homedir()}/tools/eighty5labs-ai-framework/.env`, "utf8");
  const m = env.match(/^FAL_KEY=(.*)$/m);
  if (!m) throw new Error("FAL_KEY not found in framework .env");
  return m[1].trim().replace(/^["']|["']$/g, "");
}

/** Ground the prompt in the neighborhood's own first sentences so each is specific. */
function heroPrompt(n: NeighborhoodData): string {
  const scene = (n.description?.[0] || "")
    .split(/(?<=\.)\s/)
    .slice(0, 2)
    .join(" ")
    .slice(0, 260)
    .trim();
  return [
    `Editorial documentary photograph of the ${n.name} neighborhood, ${n.city}, Oregon.`,
    scene,
    `Soft overcast morning light, warm muted tones, shot on Kodak Portra 400, gentle film grain, candid and lived-in, no posed people, wide establishing frame with negative space at the top.`,
    `In the spirit of Kintzing and Death to Stock: authentic editorial photography, real and characterful, natural light, film grain — absolutely not generic stock.`,
  ]
    .filter(Boolean)
    .join(" ");
}

const targets = neighborhoods.filter((n) => !n.image);

async function genOne(n: NeighborhoodData): Promise<string | null> {
  const prompt = heroPrompt(n);
  const res = await fetch(`https://fal.run/${MODEL}`, {
    method: "POST",
    headers: { Authorization: `Key ${falKey()}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      rendering_speed: "QUALITY",
      style: "REALISTIC",
      aspect_ratio: "4:3",
      num_images: 1,
      expand_prompt: false,
    }),
  });
  if (!res.ok) {
    console.error(`✗ ${n.slug}: ${res.status} ${(await res.text()).slice(0, 160)}`);
    return null;
  }
  const data: any = await res.json();
  const url = data.images?.[0]?.url;
  if (!url) {
    console.error(`✗ ${n.slug}: no image url in response`);
    return null;
  }
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const src = `${OUT}/hood-${n.slug}.src`;
  const webp = `${OUT}/hood-${n.slug}.webp`;
  writeFileSync(src, buf);
  execSync(`sips -s format webp "${src}" --out "${webp}"`, { stdio: "ignore" });
  execSync(`rm -f "${src}"`);
  console.log(`✓ ${n.slug}`);
  return n.slug;
}

async function main() {
  if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });
  console.log(`${targets.length} neighborhoods need an image. LIVE=${LIVE} MODEL=${MODEL}`);

  if (!LIVE) {
    const md = targets
      .map((n, i) => `### ${i + 1}. ${n.name} (${n.slug}) — ${n.city}\n\n${heroPrompt(n)}\n`)
      .join("\n");
    writeFileSync("scripts/hood-prompts.md", `# Neighborhood image prompts (${targets.length})\n\n${md}`);
    console.log(`Wrote scripts/hood-prompts.md with ${targets.length} prompts. Two samples:`);
    console.log(`\n${heroPrompt(targets[0])}\n\n${heroPrompt(targets[1])}\n`);
    console.log("Dry run only — no images generated, no cost. Set LIVE=1 to generate.");
    return;
  }

  const done: string[] = [];
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const batch = targets.slice(i, i + CONCURRENCY);
    const r = await Promise.all(batch.map(genOne));
    done.push(...(r.filter(Boolean) as string[]));
    console.log(`  ...${Math.min(i + CONCURRENCY, targets.length)}/${targets.length}`);
  }
  writeFileSync("scripts/generated-hoods.json", JSON.stringify(done, null, 2));
  console.log(`\nDone: ${done.length}/${targets.length} generated. Next: run the wiring patch.`);
}

main();
