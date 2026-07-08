"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { NeighborhoodData } from "@/lib/neighborhoods";
import { neighborhoods } from "@/lib/neighborhoods";

// ---------- helpers ----------

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
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

const SCHOOL_TYPE_COLORS: Record<string, string> = {
  elementary: "bg-blue/10 text-blue",
  middle: "bg-orange/10 text-orange",
  high: "bg-ink/10 text-ink",
  private: "bg-yellow text-ink",
  charter: "bg-green-100 text-green-700",
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

// ---------- Score Bar ----------

function ScoreBar({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className={`font-display text-3xl font-extrabold ${color} w-14 shrink-0`}>
        {score}
      </div>
      <div className="flex-1">
        <div className="text-[0.72rem] font-bold tracking-[0.1em] uppercase text-ink-light mb-1.5">
          {label}
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${color === "text-orange" ? "bg-orange" : color === "text-blue" ? "bg-blue" : "bg-green-500"}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------- Rating Dots ----------

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < rating ? "bg-orange" : "bg-border"}`}
        />
      ))}
      <span className="ml-1.5 text-[0.72rem] text-ink-light font-normal">{rating}/10</span>
    </div>
  );
}

// ---------- Main Component ----------

export default function NeighborhoodPageLayout({
  neighborhood,
}: {
  neighborhood: NeighborhoodData;
}) {
  const words = neighborhood.name.split(" ");
  const lastWord = words[words.length - 1];
  const leadWords = words.slice(0, words.length - 1).join(" ");

  return (
    <>
      <BreadcrumbSchema neighborhood={neighborhood} />
      <FAQSchema faqs={neighborhood.faqs} />
      <Nav />

      {/* ── 1. Hero ─────────────────────────────────────────────── */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-end">
            <div>
              <Link
                href="/neighborhoods"
                className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4 inline-flex items-center gap-2 hover:text-ink transition-colors"
              >
                ← Neighborhoods
              </Link>
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mt-4 mb-3">
                {neighborhood.city}, {neighborhood.state}
              </p>
              <h1 className="font-serif font-semibold text-[clamp(3rem,7.5vw,6rem)] leading-[0.92] tracking-[-0.02em] mb-4">
                {leadWords && <span>{leadWords} </span>}
                <span className="italic font-medium text-orange">
                  {lastWord}
                </span>
              </h1>
              <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[560px] mb-8">
                {neighborhood.personality}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/apply"
                  className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] hover:shadow-xl transition-all inline-flex items-center gap-2 justify-center"
                >
                  Get Pre-Approved <span>→</span>
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 border-[1.5px] border-ink text-ink rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:bg-ink hover:text-white transition-all inline-flex items-center gap-2 justify-center"
                >
                  Schedule a Call <span>→</span>
                </Link>
              </div>
            </div>
            {/* Emotional hero image — leads with feeling, not a map */}
            <ImagePlaceholder
              seed={`hero-${neighborhood.slug}`}
              tone="color"
              className="rounded-[1.5rem] hidden lg:block aspect-[4/3]"
              label={`Editorial hero — ${neighborhood.name}: a real street, home, or moment that sells the feeling of living here.`}
            />
          </div>
        </div>
      </section>

      {/* ── 1.5 Feeling band — emotion first, full-bleed ───────── */}
      <section className="px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <ImagePlaceholder
            seed={`feel-${neighborhood.slug}`}
            tone="bw"
            className="rounded-[1.5rem] aspect-[21/9]"
            overlayTitle={`“${neighborhood.personality}”`}
            label={`Wide editorial photo — the mood of ${neighborhood.name}, warm and lived-in.`}
          />
        </div>
      </section>

      {/* ── 2. Overview ─────────────────────────────────────────── */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Overview
            </p>
            <div className="max-w-[720px]">
              <div className="space-y-4 mb-10">
                {neighborhood.description.map((para, i) => (
                  <p key={i} className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                    {para}
                  </p>
                ))}
              </div>
              <div className="space-y-5">
                <ScoreBar label="Walk Score" score={neighborhood.walkScore} color="text-orange" />
                <ScoreBar label="Bike Score" score={neighborhood.bikeScore} color="text-blue" />
                <ScoreBar label="Transit Score" score={neighborhood.transitScore} color="text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Commute ─────────────────────────────────────────── */}
      <section className="py-16 border-t border-border bg-bg-alt">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Getting Around
            </p>
            <div className="max-w-[720px]">
              <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-6">
                {neighborhood.commuteToDowntown}
              </p>
              <div className="rounded-[1.25rem] overflow-hidden">
                <iframe
                  src={neighborhood.mapEmbedSrc}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${neighborhood.name}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Local Life ──────────────────────────────────────── */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Local Life
            </p>
            <div className="max-w-[720px] space-y-10">
              {/* Restaurants */}
              {neighborhood.restaurants.length > 0 && (
                <div>
                  <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4">
                    Restaurants
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.restaurants.map((r, i) => (
                      <div key={i} className="py-3 border-b border-border">
                        <div className="font-display text-[0.95rem] font-semibold text-ink">
                          {r.name}
                        </div>
                        {r.cuisine && (
                          <div className="text-[0.75rem] text-ink-light uppercase tracking-[0.08em] mt-0.5">
                            {r.cuisine}
                          </div>
                        )}
                        <div className="text-[0.85rem] text-ink-mid font-normal mt-1">
                          {r.vibe}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Coffee */}
              {neighborhood.coffee.length > 0 && (
                <div>
                  <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4">
                    Coffee
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.coffee.map((c, i) => (
                      <div key={i} className="py-3 border-b border-border">
                        <div className="font-display text-[0.95rem] font-semibold text-ink">
                          {c.name}
                        </div>
                        <div className="text-[0.85rem] text-ink-mid font-normal mt-1">
                          {c.vibe}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Bars */}
              {neighborhood.bars.length > 0 && (
                <div>
                  <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4">
                    Bars &amp; Nightlife
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {neighborhood.bars.map((b, i) => (
                      <div key={i} className="py-3 border-b border-border">
                        <div className="font-display text-[0.95rem] font-semibold text-ink">
                          {b.name}
                        </div>
                        <div className="text-[0.85rem] text-ink-mid font-normal mt-1">
                          {b.vibe}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Schools ─────────────────────────────────────────── */}
      <section className="py-16 border-t border-border bg-bg-alt">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Schools
            </p>
            <div className="max-w-[720px]">
              <p className="font-display text-[1.1rem] font-semibold text-ink mb-6">
                {neighborhood.schoolDistrict}
              </p>
              <div className="space-y-5">
                {neighborhood.schools.map((school, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-3 py-4 border-b border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-display text-[0.95rem] font-semibold text-ink">
                          {school.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[0.06em] ${SCHOOL_TYPE_COLORS[school.type] ?? "bg-border text-ink"}`}
                        >
                          {school.type}
                        </span>
                      </div>
                      <div className="text-[0.78rem] text-ink-light mb-2">
                        Grades {school.grades}
                      </div>
                      <RatingDots rating={school.rating} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Parks ───────────────────────────────────────────── */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Parks &amp; Green Space
            </p>
            <div className="max-w-[720px] space-y-6">
              {neighborhood.parks.map((park, i) => (
                <div key={i}>
                  <h3 className="font-display text-[1rem] font-semibold text-ink mb-2">
                    {park.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {park.amenities.map((amenity, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 border border-border rounded-full text-[0.72rem] font-medium text-ink-mid"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Home Prices ─────────────────────────────────────── */}
      <section className="py-16 border-t border-border bg-bg-alt">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              The Market
            </p>
            <div className="max-w-[720px]">
              <div className="font-display text-4xl font-extrabold text-ink mb-2">
                {formatPrice(neighborhood.medianHomePrice)}
              </div>
              <div className="text-[0.78rem] text-ink-light uppercase tracking-[0.08em] mb-1">
                Median Home Price
              </div>
              <div className="text-[0.88rem] text-ink-mid mt-3 mb-6">
                Typical range:{" "}
                <span className="font-semibold text-ink">
                  {formatPrice(neighborhood.priceRange.low)} – {formatPrice(neighborhood.priceRange.high)}
                </span>
              </div>
              <p className="text-[0.82rem] text-ink-light font-normal leading-relaxed border-l-2 border-border pl-4">
                Prices shown are estimates based on recent sales. Contact David &amp; Bri for current market data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Related Services ────────────────────────────────── */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Relevant Loans
            </p>
            <div className="max-w-[720px] grid grid-cols-1 sm:grid-cols-2 gap-3">
              {neighborhood.relatedServices.map((slug) => (
                <Link
                  key={slug}
                  href={`/services/${slug}`}
                  className="flex items-center justify-between py-4 px-5 border border-border rounded-xl hover:border-ink transition-colors group"
                >
                  <span className="font-display text-[0.9rem] font-semibold text-ink">
                    {SERVICE_NAMES[slug] ?? formatSlug(slug)}
                  </span>
                  <span className="text-ink-light group-hover:text-ink transition-colors">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8.5 Personal moment — David & Bri (emotional/human) ── */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-10 items-center">
          <ImagePlaceholder
            seed="david-bri-portrait"
            tone="bw"
            className="rounded-[1.5rem] aspect-[4/5]"
            label="Personal portrait — David & Bri (studio-editorial, neutral backdrop, some B&W). Real photoshoot — cannot be AI-generated."
          />
          <div className="max-w-[520px]">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4">
              Your team
            </p>
            <p className="font-serif text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.15] text-ink mb-5">
              We actually know {neighborhood.name}&nbsp;&mdash; and we&rsquo;ll tell you the truth about buying here.
            </p>
            <p className="text-[1rem] text-ink-mid leading-relaxed">
              David &amp; Bri, Movement Mortgage. Portland born, Portland based &mdash; the local read no rate sheet gives you.
            </p>
          </div>
        </div>
      </section>

      {/* ── 9. CTA ─────────────────────────────────────────────── */}
      <section className="py-20 bg-yellow text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-ink mb-4">
            Buying in{" "}
            <span className="font-serif italic font-medium text-orange text-[0.95em]">
              {neighborhood.name}
            </span>
            ?
          </h2>
          <p className="text-base text-ink-mid font-normal max-w-[480px] mx-auto mb-8">
            Get expert guidance from a Portland team that knows this market — David &amp; Bri, Movement Mortgage. NMLS #1367416 / #265974.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="https://mtgxps.mymortgage-online.com/loan-app/?siteId=1878266072&lar=blindley&workFlowId=71729"
              className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] transition-all inline-flex items-center gap-2 justify-center"
            >
              Get Pre-Approved <span>→</span>
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-[1.5px] border-ink text-ink rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:bg-ink hover:text-white transition-all inline-flex items-center gap-2 justify-center"
            >
              Schedule a Call <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10. Testimonials ───────────────────────────────────── */}
      {neighborhood.testimonials.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                What Clients Say
              </p>
              <div className="max-w-[720px] space-y-8">
                {neighborhood.testimonials.map((t, i) => (
                  <blockquote key={i} className="py-6 border-b border-border">
                    <p className="text-[1.05rem] leading-[1.75] text-ink font-normal mb-4">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer>
                      <span className="font-display text-[0.88rem] font-semibold text-ink">
                        {t.author}
                      </span>
                      <span className="text-[0.82rem] text-ink-light font-normal italic ml-2">
                        {t.context}
                      </span>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 11. FAQ ────────────────────────────────────────────── */}
      {neighborhood.faqs.length > 0 && (
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <div>
                <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-1">
                  FAQ
                </p>
                <p className="text-[0.78rem] text-ink-light">
                  {neighborhood.faqs.length} questions
                </p>
              </div>
              <div className="max-w-[720px]">
                {neighborhood.faqs.map((faq, i) => (
                  <details key={i} className="group border-b border-border">
                    <summary className="flex justify-between items-center py-5 cursor-pointer list-none">
                      <h3 className="font-display text-[1rem] font-semibold text-ink pr-8 leading-snug">
                        {faq.q}
                      </h3>
                      <span className="text-ink-light text-xl shrink-0 group-open:rotate-45 transition-transform duration-300">
                        +
                      </span>
                    </summary>
                    <div className="pb-5 pr-12">
                      <p className="text-[0.9rem] text-ink-mid font-normal leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 12. Adjacent Neighborhoods ─────────────────────────── */}
      {neighborhood.adjacentNeighborhoods.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Nearby
              </p>
              <div className="max-w-[720px] grid grid-cols-2 sm:grid-cols-3 gap-3">
                {neighborhood.adjacentNeighborhoods.map((adjSlug) => {
                  const found = neighborhoods.find((n) => n.slug === adjSlug);
                  const displayName = found ? found.name : formatSlug(adjSlug);
                  return (
                    <Link
                      key={adjSlug}
                      href={`/neighborhoods/${adjSlug}`}
                      className="py-4 px-5 border border-border rounded-xl hover:border-orange hover:text-orange transition-colors text-center"
                    >
                      <span className="font-display text-[0.88rem] font-semibold">
                        {displayName}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
