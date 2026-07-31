import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Btn from "@/components/Btn";
import BuyNowVsWaitCalculator from "@/components/calculators/BuyNowVsWaitCalculator";
import { getToolBySlug } from "@/lib/calculator-tools";

const tool = getToolBySlug("buy-now-vs-wait")!;

export const metadata: Metadata = {
  title: tool.metaTitle,
  description: tool.metaDescription,
  alternates: { canonical: "/calculators/buy-now-vs-wait" },
};

// FAQPage + WebApplication: the question/answer pair is the quotable claim, and
// the tool itself is a free, no-login application — both worth stating plainly.
const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: tool.name,
      url: `https://thelindleyteam.com/calculators/buy-now-vs-wait`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description: tool.metaDescription,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@id": "https://thelindleyteam.com/#lindleyteam" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: tool.question,
          acceptedAnswer: { "@type": "Answer", text: tool.answer },
        },
      ],
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="pt-[clamp(40px,6vw,80px)] pb-[clamp(28px,4vw,48px)]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link
              href="/calculators"
              className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light hover:text-orange transition-colors"
            >
              ← Calculators
            </Link>
            <h1 className="font-serif text-[clamp(2.3rem,5.2vw,4rem)] font-semibold leading-[0.98] tracking-[-0.03em] mt-5 mb-5 max-w-[18ch]">
              {tool.name}
            </h1>
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[640px]">
              {tool.intro}
            </p>
          </div>
        </section>

        {/* The tool */}
        <section className="pb-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <BuyNowVsWaitCalculator />
          </div>
        </section>

        {/* The answer — plain prose, so it can be read and quoted */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                The short answer
              </h2>
              <div className="max-w-[720px]">
                <p className="font-serif text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug tracking-[-0.01em] text-ink mb-5">
                  {tool.question}
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  {tool.answer}
                </p>

                {tool.related && tool.related.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                    {tool.related.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        className="text-[0.85rem] font-semibold text-ink border-b border-ink/25 pb-0.5 hover:text-orange hover:border-orange transition-colors"
                      >
                        {r.label} →
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Run your numbers with us
              </h2>
              <div className="max-w-[640px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-7">
                  A calculator gives you an estimate. A conversation gives you the
                  number you can actually plan around — David and Bri will walk you
                  through it down to the decimal.
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
