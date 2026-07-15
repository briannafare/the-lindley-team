import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About The Lindley Team at Movement Mortgage | Portland | NMLS #1367416 / #265974",
  description:
    "Meet David Chandler & Bri Lindley — The Lindley Team at Movement Mortgage. Portland loan officers helping Oregon & Washington families buy and refinance homes. NMLS #1367416 / #265974.",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="pt-[clamp(24px,5vh,56px)] pb-20 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-tight mb-6">
              About the<br />
              <span className="font-script font-normal text-orange text-[0.9em]">Team</span>
            </h1>
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[620px]">
              Two loan officers who answer their own emails, one Portland team, and 35 years of deals between them. Here&apos;s the honest version of who you&apos;d be working with.
            </p>
          </div>
        </section>

        {/* Bri's Story */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Bri Lindley
              </p>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Bri grew up around here, which is why she can tell you a Sellwood bungalow and a Beaumont-Wilshire Tudor age — and price — very differently, without opening a comp sheet. Local knowledge isn&apos;t a line on her website. It&apos;s just how she reads a deal.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  She&apos;s a Senior Loan Officer and a Certified Divorce Lending Professional — a designation only a handful of Oregon lenders hold. In plain terms: when a house is tangled up in a divorce, she untangles it. The buyout, the refinance, a clear read on what each person can afford on their own. Done right, that work means someone walks out of a hard year with their footing — the house, the credit, a plan. That&apos;s the part Bri is in it for.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* David's Story */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                David Chandler
              </p>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  David has done this for more than 20 years, and he explains it like someone with nothing to hide — plain, patient, down to the decimal. Most loans are simpler than the internet makes them look, and he&apos;ll tell you so. When yours isn&apos;t — you&apos;re self-employed, you&apos;re building, the price tag says jumbo — he&apos;s closed a few hundred like it and knows exactly which lever to pull.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  He invests in real estate himself, so he reads a deal like a buyer, not a brochure. Hundreds of five-star reviews suggest the approach works. Licensed in Arizona, Georgia, Oregon, and Washington.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications & Credentials */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Credentials
              </p>
              <div className="max-w-[720px] grid md:grid-cols-2 gap-10">
                <div>
                  <p className="text-[0.78rem] font-bold tracking-[0.14em] uppercase text-ink mb-1">Bri Lindley</p>
                  <div className="border-b border-border">
                    {[
                      { label: "Title", value: "Senior Loan Officer" },
                      { label: "NMLS", value: "#1367416" },
                      { label: "Licensed", value: "OR & WA" },
                      { label: "Designation", value: "CDLP — Certified Divorce Lending Professional" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-baseline py-3 border-t border-border gap-4">
                        <span className="text-[0.82rem] font-semibold text-ink shrink-0">{row.label}</span>
                        <span className="text-[0.82rem] text-ink-mid font-normal text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[0.78rem] font-bold tracking-[0.14em] uppercase text-ink mb-1">David Chandler</p>
                  <div className="border-b border-border">
                    {[
                      { label: "Title", value: "Mortgage Loan Officer" },
                      { label: "NMLS", value: "#265974" },
                      { label: "Licensed", value: "AZ, GA, OR & WA" },
                      { label: "Focus", value: "Jumbo · Construction · Self-employed · Investment" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-baseline py-3 border-t border-border gap-4">
                        <span className="text-[0.82rem] font-semibold text-ink shrink-0">{row.label}</span>
                        <span className="text-[0.82rem] text-ink-mid font-normal text-right">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed md:col-span-2">
                  Bri&apos;s CDLP designation means she&apos;s specifically trained to help divorcing homeowners navigate property buyouts, refinances, and new-purchase financing during one of life&apos;s most stressful transitions. Both work through Movement Mortgage, NMLS ID&nbsp;#39179.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder note + today's team */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Our Story
              </p>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  The Lindley Team started with Tammi Lindley. She built the name the slow way — one straight conversation at a time, until half of Portland seemed to know someone she&apos;d taken care of. She&apos;s the founder, and the standard is still hers.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  The two people you&apos;ll actually work with now are David and Bri. Same standard. More horsepower behind it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Movement Mortgage */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Why Movement
              </p>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Short version: David and Bri didn&apos;t change — their toolbox got bigger. At Movement, more loan programs sit in-house instead of getting shopped out to a wholesale lender, which means quicker answers, more control when a file gets hairy, and room to sharpen your pricing.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Bigger company, deeper bench, same two people on your deal. It&apos;s also an Impact Lender — a slice of every loan goes back into the community. Not the reason you&apos;d pick us. Just a nice thing to be able to say about where your loan came from.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Numbers / Stats Band */}
        <section className="py-20 bg-ink text-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
              {[
                { stat: "35+", label: "Combined years lending" },
                { stat: "OR + WA", label: "Where the team is licensed" },
                { stat: "Hundreds", label: "of five-star client reviews" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-display text-[clamp(2.5rem,6vw,4rem)] font-extrabold leading-none mb-3">
                    {item.stat}
                  </div>
                  <p className="text-[0.72rem] font-bold tracking-[0.18em] uppercase text-white/50">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-yellow text-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-ink mb-4">
              Ready to{" "}
              <span className="font-script font-normal text-orange text-[0.9em]">
                talk?
              </span>
            </h2>
            <p className="text-base text-ink-mid font-normal max-w-[440px] mx-auto mb-8">
              No pressure, no scripts. Just a real conversation about your situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/apply"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] hover:shadow-xl transition-all inline-flex items-center gap-2 justify-center"
              >
                Get Pre-Approved <span>→</span>
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 border-[1.5px] border-ink text-ink rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:bg-ink hover:text-white transition-all inline-flex items-center gap-2 justify-center"
              >
                Schedule a Call <span>→</span>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
