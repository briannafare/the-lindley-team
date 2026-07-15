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

        {/* Team image band */}
        <section className="pb-4">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="overflow-hidden rounded-[1.25rem] bg-ink/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/team/team-duo.jpg"
                alt="David Chandler and Bri Lindley — The Lindley Team"
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="font-body text-[0.68rem] tracking-[0.14em] uppercase text-ink-light mt-3">
              David Chandler &amp; Bri Lindley · The Lindley Team
            </p>
          </div>
        </section>

        {/* David's Story */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                David Chandler
              </h2>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  David has done this for more than 20 years, and he explains it like someone with nothing to hide — plain, patient, down to the decimal. Most loans are simpler than the internet makes them look, and he&apos;ll tell you so. When yours isn&apos;t — you&apos;re self-employed, you&apos;re building, the price tag says jumbo — he&apos;s closed a few hundred like it and knows exactly which lever to pull.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  He invests in real estate himself, so he reads a deal like a buyer, not a brochure.{" "}
                  <a
                    href="https://www.google.com/maps/place/The+Lindley+Team,+Mortgage+Lenders/@45.4103477,-122.7485929,17z/data=!3m1!5s0x549572d77efb8a81:0x63fc125e4a98e43b!4m8!3m7!1s0x54950af83cdf8bdd:0x40316c8aabaf0907!8m2!3d45.4103477!4d-122.7485929!9m1!1b1!16s%2Fg%2F1tj45m7v"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-ink transition-colors"
                  >
                    Hundreds of five-star reviews
                  </a>{" "}
                  suggest the approach works. Licensed in Arizona, Georgia, Oregon, and Washington.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bri's Story */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Bri Lindley
              </h2>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Bri didn&apos;t find the mortgage business — she was raised in it. Her mom built The Lindley Team, and Bri grew up watching what it looks like when a lender actually takes care of people. When she took over the name, keeping that standard stopped being a value statement and became a family matter.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  She&apos;s a Senior Loan Officer and a Certified Divorce Lending Professional (CDLP&reg;) — a designation only a handful of Oregon lenders hold. When a house is caught in a divorce, Bri works alongside the attorneys to untangle it: the buyout, the refinance, a clear read on what each person can afford next. It&apos;s exacting work, and the reason she does it is simple. At the end, someone keeps their footing — a home, a credit score, a next chapter that actually pencils.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  She&apos;s also why clients never wonder what&apos;s happening with their file. Bri builds the team&apos;s systems herself — the updates, the follow-ups, the &ldquo;here&apos;s exactly where things stand&rdquo; messages — because silence from a lender is its own kind of stress, and she refuses to be that lender.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications & Credentials */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Credentials
              </h2>
              <div className="max-w-[720px] grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-[0.78rem] font-bold tracking-[0.14em] uppercase text-ink mb-1">David Chandler</h3>
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
                <div>
                  <h3 className="text-[0.78rem] font-bold tracking-[0.14em] uppercase text-ink mb-1">Bri Lindley</h3>
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
                <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed md:col-span-2">
                  Bri&apos;s CDLP&reg; designation means she&apos;s specifically trained to help divorcing homeowners navigate property buyouts, refinances, and new-purchase financing during one of life&apos;s most stressful transitions. Both work through Movement Mortgage, NMLS ID&nbsp;#39179.
                </p>
                <p className="text-[0.7rem] text-ink-light leading-relaxed md:col-span-2">
                  CDLP&reg; is a registered certification mark of the Divorce Lending Association.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Founder note + today's team */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Our Story
              </h2>
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
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Why Movement
              </h2>
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
