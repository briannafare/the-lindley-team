"use client";

import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { NeighborhoodData } from "@/lib/neighborhoods";
import { neighborhoods } from "@/lib/neighborhoods";

/**
 * A field-guide entry: warm editorial prose colliding with a
 * precise monospace instrument panel. One vermilion mark per page.
 */

// ---------- helpers ----------

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}m`;
  return `$${(n / 1_000).toFixed(0)}k`;
}

const SERVICE_NAMES: Record<string, string> = {
  purchase: "Purchase Loans",
  refinance: "Refinancing",
  fha: "FHA Loans",
  va: "VA Loans",
  jumbo: "Jumbo Loans",
  "cash-out": "Cash-Out Refi",
  heloc: "HELOC",
  investment: "Investment Property",
  "reverse-mortgage": "Reverse Mortgage",
  "divorce-lending": "Divorce Lending",
};

// ---------- JSON-LD ----------

function BreadcrumbSchema({ neighborhood }: { neighborhood: NeighborhoodData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://thelindleyteam.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Neighborhoods",
        item: "https://thelindleyteam.com/neighborhoods",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: neighborhood.name,
        item: `https://thelindleyteam.com/neighborhoods/${neighborhood.slug}`,
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function FAQSchema({ faqs }: { faqs: NeighborhoodData["faqs"] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ---------- instrument pieces ----------

function GaugeRow({ label, score }: { label: string; score: number }) {
  return (
    <div className="py-2.5 border-b border-paper-200">
      <div className="flex justify-between gap-4 mb-1.5">
        <span className="instrument !text-paper-500">{label}</span>
        <span className="instrument">{score}/100</span>
      </div>
      <div className="h-[2px] bg-paper-200">
        <div className="h-full bg-paper-900" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 border-b border-paper-200">
      <span className="instrument !text-paper-500 shrink-0">{label}</span>
      <span className="instrument text-right">{value}</span>
    </div>
  );
}

function SectionIndex({ children }: { children: React.ReactNode }) {
  return <h2 className="instrument !text-paper-500 mb-6">{children}</h2>;
}

// ---------- Main Component ----------

export default function NeighborhoodPageLayout({
  neighborhood,
}: {
  neighborhood: NeighborhoodData;
}) {
  const entryIndex = neighborhoods.findIndex((n) => n.slug === neighborhood.slug);
  const entryNo = String(entryIndex + 1).padStart(2, "0");
  const total = neighborhoods.length;

  return (
    <>
      <BreadcrumbSchema neighborhood={neighborhood} />
      <FAQSchema faqs={neighborhood.faqs} />
      <Nav />

      {/* ── Entry masthead ─────────────────────────────────────── */}
      <header className="pt-28 lg:pt-32 pb-12 lg:pb-16">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <div className="border-y border-paper-200 py-2.5 flex items-baseline justify-between gap-4 mb-10 lg:mb-14">
            <Link
              href="/neighborhoods"
              className="instrument-label !text-paper-600 hover:!text-paper-900 transition-colors duration-200"
            >
              ← field notes
            </Link>
            <span className="instrument-label hidden sm:inline">
              {neighborhood.city.toLowerCase()}, {neighborhood.state.toLowerCase()}
            </span>
            <span className="instrument-label">
              entry no. {entryNo} of {total}
            </span>
          </div>

          <h1 className="font-display font-normal text-display-xl text-paper-900 mb-6 max-w-[14ch]">
            {neighborhood.name}
          </h1>
          <p className="text-body-xl font-body text-paper-600 leading-normal max-w-[44ch]">
            {neighborhood.personality}
          </p>
        </div>
      </header>

      {/* ── Entry body: prose vs. instrument panel ─────────────── */}
      <div className="max-w-container mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_21rem] gap-x-16 gap-y-14 items-start">
          {/* editorial column */}
          <div className="max-w-prose">
            <section className="mb-16">
              <SectionIndex>01 — the neighborhood</SectionIndex>
              <div className="prose-field">
                {neighborhood.description.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              <figure className="mt-10">
                <div className="relative aspect-[3/2] overflow-hidden rounded-sm border border-paper-200">
                  <Image
                    src="https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600&q=80"
                    alt={`Residential street scene — placeholder image for ${neighborhood.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42rem"
                    className="object-cover img-bw-locked"
                  />
                </div>
                <figcaption className="instrument-label mt-3">
                  placeholder — b&amp;w lindley team photography to come
                </figcaption>
              </figure>
            </section>

            <section className="mb-16">
              <SectionIndex>02 — getting around</SectionIndex>
              <div className="prose-field mb-8">
                <p>{neighborhood.commuteToDowntown}</p>
              </div>
              <figure>
                <div className="overflow-hidden rounded-sm border border-paper-200 map-bw">
                  <iframe
                    src={neighborhood.directionsSrc}
                    width="100%"
                    height="360"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Directions from ${neighborhood.name} to The Lindley Team`}
                  />
                </div>
                <figcaption className="instrument-label mt-3">
                  fig. — route from {neighborhood.name.toLowerCase()} to our office
                </figcaption>
              </figure>
            </section>

            <section className="mb-16">
              <SectionIndex>03 — local life</SectionIndex>
              <div className="space-y-10">
                {neighborhood.restaurants.length > 0 && (
                  <div>
                    <h3 className="font-display font-normal text-[1.25rem] text-paper-900 mb-4">
                      Where to eat
                    </h3>
                    <div className="border-t border-paper-200">
                      {neighborhood.restaurants.map((r, i) => (
                        <div key={i} className="py-4 border-b border-paper-200">
                          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                            <span className="font-medium text-paper-900">{r.name}</span>
                            {r.cuisine && (
                              <span className="instrument-label">
                                {r.cuisine.toLowerCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-[0.92rem] text-paper-600 leading-relaxed mt-1">
                            {r.vibe}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {neighborhood.coffee.length > 0 && (
                  <div>
                    <h3 className="font-display font-normal text-[1.25rem] text-paper-900 mb-4">
                      Coffee
                    </h3>
                    <div className="border-t border-paper-200">
                      {neighborhood.coffee.map((c, i) => (
                        <div key={i} className="py-4 border-b border-paper-200">
                          <span className="font-medium text-paper-900">{c.name}</span>
                          <p className="text-[0.92rem] text-paper-600 leading-relaxed mt-1">
                            {c.vibe}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {neighborhood.bars.length > 0 && (
                  <div>
                    <h3 className="font-display font-normal text-[1.25rem] text-paper-900 mb-4">
                      After dark
                    </h3>
                    <div className="border-t border-paper-200">
                      {neighborhood.bars.map((b, i) => (
                        <div key={i} className="py-4 border-b border-paper-200">
                          <span className="font-medium text-paper-900">{b.name}</span>
                          <p className="text-[0.92rem] text-paper-600 leading-relaxed mt-1">
                            {b.vibe}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="mb-16">
              <SectionIndex>04 — schools</SectionIndex>
              <p className="font-display font-normal text-[1.25rem] text-paper-900 mb-5">
                {neighborhood.schoolDistrict}
              </p>
              <div className="border-t border-paper-200">
                {neighborhood.schools.map((school, i) => (
                  <div key={i} className="py-4 border-b border-paper-200">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-2">
                      <span className="font-medium text-paper-900">{school.name}</span>
                      <span className="instrument-label">
                        {school.type} · grades {school.grades.toLowerCase()} ·{" "}
                        {school.rating}/10
                      </span>
                    </div>
                    <div className="h-[2px] bg-paper-200 max-w-[240px]">
                      <div
                        className="h-full bg-paper-900"
                        style={{ width: `${school.rating * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <SectionIndex>05 — parks &amp; green space</SectionIndex>
              <div className="border-t border-paper-200">
                {neighborhood.parks.map((park, i) => (
                  <div key={i} className="py-4 border-b border-paper-200">
                    <span className="font-medium text-paper-900">{park.name}</span>
                    <p className="instrument !text-paper-500 mt-1.5">
                      {park.amenities.join(" · ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-16">
              <SectionIndex>06 — the market</SectionIndex>
              <div className="font-display font-normal text-display-md text-paper-900 mb-1">
                {formatPrice(neighborhood.medianHomePrice)}
              </div>
              <p className="instrument !text-paper-500 mb-5">
                median · typical range {formatPrice(neighborhood.priceRange.low)}–
                {formatPrice(neighborhood.priceRange.high)}
              </p>
              <p className="text-[0.9rem] text-paper-500 leading-relaxed border-l border-paper-300 pl-4 max-w-[52ch]">
                Prices are estimates based on recent sales. Contact Bri for
                current market data.
              </p>
            </section>

            <section className="mb-4">
              <SectionIndex>07 — relevant loans</SectionIndex>
              <div className="border-t border-paper-200">
                {neighborhood.relatedServices.map((slug) => (
                  <Link
                    key={slug}
                    href={`/services/${slug}`}
                    className="group flex items-baseline justify-between gap-6 py-4 border-b border-paper-200 hover:bg-surface transition-colors duration-200"
                  >
                    <span className="font-medium text-paper-900 group-hover:underline underline-offset-4 decoration-paper-300">
                      {SERVICE_NAMES[slug] ?? formatSlug(slug)}
                    </span>
                    <span
                      className="text-paper-400 group-hover:text-paper-900 transition-colors duration-200"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* instrument panel — the precise counterweight */}
          <aside className="lg:sticky lg:top-28 order-first lg:order-none">
            <div className="border border-paper-300 rounded-sm bg-surface shadow-sm p-6">
              <div className="flex items-center gap-2.5 pb-4 border-b-2 border-paper-900 mb-2">
                {/* the one vermilion mark on this page */}
                <span
                  className="w-2.5 h-2.5 rounded-full bg-vermilion-500 shrink-0"
                  aria-hidden
                />
                <span className="instrument">
                  {neighborhood.slug.replace(/-/g, " ")}
                </span>
              </div>
              <GaugeRow label="walk score" score={neighborhood.walkScore} />
              <GaugeRow label="bike score" score={neighborhood.bikeScore} />
              <GaugeRow label="transit score" score={neighborhood.transitScore} />
              <DataRow label="median" value={formatPrice(neighborhood.medianHomePrice)} />
              <DataRow
                label="range"
                value={`${formatPrice(neighborhood.priceRange.low)}–${formatPrice(neighborhood.priceRange.high)}`}
              />
              <DataRow label="district" value={neighborhood.schoolDistrict.replace(" Schools", "").toLowerCase()} />
              <p className="instrument-label pt-4">
                surveyed by the lindley team · updated {new Date().getFullYear()}
              </p>
            </div>

            <figure className="mt-6 hidden lg:block">
              <div className="overflow-hidden rounded-sm border border-paper-200 map-bw">
                <iframe
                  src={neighborhood.mapEmbedSrc}
                  width="100%"
                  height="260"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${neighborhood.name}`}
                />
              </div>
              <figcaption className="instrument-label mt-3">
                fig. — survey area
              </figcaption>
            </figure>
          </aside>
        </div>
      </div>

      {/* ── What clients say ───────────────────────────────────── */}
      {neighborhood.testimonials.length > 0 && (
        <section className="py-20 border-t border-paper-200 bg-surface">
          <div className="max-w-container mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-14">
              {neighborhood.testimonials.map((t, i) => (
                <figure key={i}>
                  <blockquote className="font-display font-normal text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.45] text-paper-900 mb-5">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="instrument !text-paper-500">
                    — {t.author.toLowerCase()} · {t.context.toLowerCase()}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ────────────────────────────────────────────────── */}
      {neighborhood.faqs.length > 0 && (
        <section className="py-20 border-t border-paper-200">
          <div className="max-w-container mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_1fr] gap-x-16 gap-y-8">
              <h2 className="font-display font-normal text-display-md text-paper-900">
                Field questions
              </h2>
              <div className="border-t border-paper-200">
                {neighborhood.faqs.map((faq, i) => (
                  <details key={i} className="group border-b border-paper-200">
                    <summary className="flex items-baseline justify-between gap-8 py-5 cursor-pointer list-none">
                      <h3 className="font-display font-normal text-[1.1rem] leading-snug text-paper-900">
                        {faq.q}
                      </h3>
                      <span
                        className="instrument !text-paper-400 shrink-0 group-open:rotate-45 transition-transform duration-200 origin-center"
                        aria-hidden
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-6 pr-10 text-[0.95rem] leading-[1.75] text-paper-600 max-w-prose">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Nearby entries ─────────────────────────────────────── */}
      {neighborhood.adjacentNeighborhoods.length > 0 && (
        <section className="py-14 border-t border-paper-200">
          <div className="max-w-container mx-auto px-6 lg:px-10">
            <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
              <span className="instrument-label">adjacent entries</span>
              {neighborhood.adjacentNeighborhoods.map((adjSlug) => {
                const found = neighborhoods.find((n) => n.slug === adjSlug);
                const displayName = found ? found.name : formatSlug(adjSlug);
                return (
                  <Link
                    key={adjSlug}
                    href={`/neighborhoods/${adjSlug}`}
                    className="font-display text-[1.1rem] text-paper-900 underline underline-offset-4 decoration-paper-300 hover:decoration-paper-900 transition-colors duration-200"
                  >
                    {displayName}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-28 border-t border-paper-200 bg-surface">
        <div className="max-w-container mx-auto px-6 lg:px-10">
          <h2 className="font-display font-normal text-display-lg text-paper-900 mb-5 max-w-[20ch]">
            Buying in {neighborhood.name}?
          </h2>
          <p className="text-body-lg text-paper-600 max-w-[44ch] mb-9">
            Talk to a lender who has actually walked it. Bri Lindley, NMLS
            #1367416 — pre-approval in 24–48 hours.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Link
              href="https://mtgxps.mymortgage-online.com/loan-app/?siteId=1878266072&lar=blindley&workFlowId=71729"
              className="inline-flex items-center justify-center px-8 py-4 bg-paper-900 text-paper-50 rounded-sm text-[0.95rem] font-medium hover:bg-paper-800 transition-colors duration-200"
            >
              Get pre-approved
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-paper-900 underline underline-offset-4 decoration-paper-300 hover:decoration-paper-900 transition-colors duration-200"
            >
              Schedule a call <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
