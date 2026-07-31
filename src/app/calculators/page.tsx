import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Btn from "@/components/Btn";
import { CALCULATOR_TOOLS } from "@/lib/calculator-tools";

export const metadata: Metadata = {
  title: "Mortgage Calculators — Portland, Oregon | The Lindley Team",
  description:
    "Free mortgage calculators for Portland buyers and owners: affordability, rent vs buy, cash to close, house hacking, debt consolidation, payoff strategy, tax deduction, CLTV, and more.",
  alternates: { canonical: "/calculators" },
};

// Loan-product calculators live on their service pages; surface them here too so
// this hub is the single entry point for every tool on the site.
const ON_SERVICE_PAGES = [
  { label: "FHA loan calculator", href: "/services/fha" },
  { label: "VA loan calculator", href: "/services/va" },
  { label: "USDA loan calculator", href: "/services/usda" },
  { label: "Conventional loan calculator", href: "/services/conventional" },
  { label: "DSCR / rental income calculator", href: "/services/dscr" },
  { label: "Investment property calculator", href: "/services/investment" },
  { label: "Refinance calculator", href: "/services/refinance" },
];

const LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Mortgage calculators — The Lindley Team, Portland Oregon",
  itemListElement: CALCULATOR_TOOLS.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "WebApplication",
      name: t.name,
      url: `https://thelindleyteam.com/calculators/${t.slug}`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description: t.metaDescription,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": "https://thelindleyteam.com/#lindleyteam" },
    },
  })),
};

export default function CalculatorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-[clamp(40px,6vw,80px)] pb-[clamp(40px,5vw,64px)]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4">
              Tools
            </p>
            <h1 className="font-serif text-[clamp(2.6rem,6vw,4.6rem)] font-semibold leading-[0.94] tracking-[-0.03em] mb-6">
              Mortgage{" "}
              <em className="italic font-medium text-orange">calculators</em>
            </h1>
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[680px]">
              The Lindley Team offers free mortgage calculators for buyers and homeowners
              across the Portland metro — affordability, rent versus buy, cash to close,
              house hacking, debt consolidation, payoff strategy, and more. No sign-up,
              no credit pull.
            </p>
          </div>
        </section>

        {/* Tool grid */}
        <section className="pb-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CALCULATOR_TOOLS.map((t) => (
                <Link
                  key={t.slug}
                  href={`/calculators/${t.slug}`}
                  aria-label={`Open the ${t.name}`}
                  className="group border border-border rounded-[1.25rem] bg-paper p-6 hover:border-ink transition-colors flex flex-col"
                >
                  <p className="font-body text-[0.62rem] tracking-[0.16em] uppercase text-ink-light mb-3">
                    {t.short}
                  </p>
                  <h2 className="font-serif text-[1.3rem] leading-tight tracking-[-0.01em] text-ink group-hover:text-orange transition-colors">
                    {t.name}
                  </h2>
                  <p className="text-[0.9rem] text-ink-mid leading-relaxed mt-3 flex-1">
                    {t.intro}
                  </p>
                  <span className="mt-5 text-[0.78rem] font-semibold text-ink group-hover:text-orange transition-colors">
                    Open calculator →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Loan-type calculators, which live on their service pages */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                By loan type
              </h2>
              <div className="max-w-[720px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-6">
                  Calculators for a specific loan program sit on that program&apos;s page,
                  alongside the requirements and the fine print they depend on.
                </p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {ON_SERVICE_PAGES.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="text-[0.92rem] text-ink border-b border-border pb-2 hover:text-orange hover:border-orange transition-colors"
                    >
                      {s.label} →
                    </Link>
                  ))}
                  <Link
                    href="/calculator"
                    className="text-[0.92rem] text-ink border-b border-border pb-2 hover:text-orange hover:border-orange transition-colors"
                  >
                    Standard monthly payment calculator →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Then talk to a person
              </h2>
              <div className="max-w-[640px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-7">
                  These give you an estimate. A Mortgage Cost Analysis gives you the
                  real number — your options side by side, explained down to the decimal.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Btn href="/contact#schedule" variant="accent" size="lg">
                    Get Your Free Mortgage Cost Analysis
                  </Btn>
                  <Btn href="/apply" variant="outline" size="lg">
                    Apply now
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
