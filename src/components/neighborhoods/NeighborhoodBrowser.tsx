"use client";

import { useMemo, useState } from "react";
import NeighborhoodTile from "@/components/neighborhoods/NeighborhoodTile";
import { NeighborhoodData } from "@/lib/neighborhoods";

// Preferred display order — west-to-east-ish, matching how Bri talks through
// the metro with clients. Any region present in the data but missing here
// gets appended (alphabetically) so nothing silently disappears.
const REGION_ORDER = [
  "Inner Southeast",
  "Outer Southeast",
  "Northeast",
  "North Portland",
  "Northwest & Pearl",
  "Southwest & Downtown",
  "Clackamas & East County",
  "Washington County",
  "SW Washington",
];

type PriceFilter = "All prices" | "Under $500k" | "$500k–$750k" | "$750k+";

const PRICE_FILTERS: { label: PriceFilter; test: (price: number) => boolean }[] = [
  { label: "All prices", test: () => true },
  { label: "Under $500k", test: (p) => p < 500_000 },
  { label: "$500k–$750k", test: (p) => p >= 500_000 && p <= 750_000 },
  { label: "$750k+", test: (p) => p > 750_000 },
];

function chipClass(active: boolean): string {
  return [
    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-[0.72rem] font-bold tracking-[0.04em] uppercase transition-colors",
    active
      ? "bg-ink text-white border-ink"
      : "bg-transparent text-ink-mid border-border hover:border-ink hover:text-ink",
  ].join(" ");
}

export default function NeighborhoodBrowser({
  neighborhoods,
}: {
  neighborhoods: NeighborhoodData[];
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("All");
  const [price, setPrice] = useState<PriceFilter>("All prices");

  const regions = useMemo(() => {
    const present = new Set<string>(neighborhoods.map((n) => n.region));
    const ordered = REGION_ORDER.filter((r) => present.has(r));
    const extras = Array.from(present)
      .filter((r) => !REGION_ORDER.includes(r))
      .sort((a, b) => a.localeCompare(b));
    return [...ordered, ...extras];
  }, [neighborhoods]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of neighborhoods) counts[n.region] = (counts[n.region] ?? 0) + 1;
    return counts;
  }, [neighborhoods]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const priceTest = PRICE_FILTERS.find((f) => f.label === price)?.test ?? (() => true);
    return neighborhoods.filter((n) => {
      if (region !== "All" && n.region !== region) return false;
      if (!priceTest(n.medianHomePrice)) return false;
      if (q && !n.name.toLowerCase().includes(q) && !n.city.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [neighborhoods, query, region, price]);

  const grouped = useMemo(() => {
    const byRegion = new Map<string, NeighborhoodData[]>();
    for (const n of filtered) {
      const list = byRegion.get(n.region) ?? [];
      list.push(n);
      byRegion.set(n.region, list);
    }
    return regions
      .map((r) => ({ region: r, items: byRegion.get(r) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, [filtered, regions]);

  let tileIndex = 0;

  return (
    <section className="border-t border-border" id="browse">
      {/* Controls */}
      <div className="sticky top-0 z-30 bg-paper/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:max-w-[300px]">
              <label htmlFor="neighborhood-search" className="sr-only">
                Search neighborhoods by name or city
              </label>
              <input
                id="neighborhood-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or city…"
                className="w-full rounded-full border border-border bg-white px-5 py-3 text-[0.85rem] text-ink placeholder:text-ink-light focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              {PRICE_FILTERS.map((f) => (
                <button
                  key={f.label}
                  type="button"
                  aria-pressed={price === f.label}
                  onClick={() => setPrice(f.label)}
                  className={chipClass(price === f.label)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              aria-pressed={region === "All"}
              onClick={() => setRegion("All")}
              className={chipClass(region === "All")}
            >
              All <span className="opacity-60">{neighborhoods.length}</span>
            </button>
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={region === r}
                onClick={() => setRegion(r)}
                className={chipClass(region === r)}
              >
                {r} <span className="opacity-60">{regionCounts[r] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-8">
          {filtered.length} {filtered.length === 1 ? "neighborhood" : "neighborhoods"}
        </p>

        {grouped.length === 0 ? (
          <div className="py-20 px-6 text-center border border-dashed border-border rounded-2xl">
            <p className="font-serif text-[1.6rem] font-semibold text-ink mb-2">
              No neighborhoods match.
            </p>
            <p className="text-[0.9rem] text-ink-mid font-normal max-w-[420px] mx-auto mb-6">
              Try a different search or filter — or call Bri directly. She knows
              Portland block by block, even the ones not listed here yet.
            </p>
            <a
              href="tel:9717541771"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-ink text-white rounded-full text-[0.75rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all"
            >
              Call 971-754-1771 <span>→</span>
            </a>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {grouped.map((g) => (
              <div key={g.region}>
                <div className="flex items-baseline gap-3 mb-5">
                  <h3 className="font-grotesk text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light whitespace-nowrap">
                    {g.region}
                  </h3>
                  <span className="text-[0.68rem] font-bold text-ink-light whitespace-nowrap">
                    {g.items.length}
                  </span>
                  <span className="flex-1 h-px bg-border" aria-hidden />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {g.items.map((n) => (
                    <NeighborhoodTile key={n.slug} neighborhood={n} index={tileIndex++} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
