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
              Two decades. Two generations. One mission: get Portland families into their homes without drama.
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
                  Bri grew up in the Portland area. She knows the difference between a Sellwood bungalow and a Beaumont-Wilshire Tudor not from a listing sheet but from having driven those streets her entire life. That local knowledge isn&apos;t a selling point — it&apos;s just how she thinks about this work.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  She&apos;s been in the mortgage industry for over 20 years. In that time she&apos;s worked with first-time buyers who were terrified they&apos;d never qualify, with longtime homeowners trying to make smart equity decisions, and with people going through divorce who needed someone who genuinely understood both the financial and emotional weight of what they were navigating. She doesn&apos;t turn borrowers away for being complicated. She tends to find the complicated ones most interesting.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Bri holds the Certified Divorce Lending Professional (CDLP) designation — one of only a small number of lenders in Oregon to earn it. It means she&apos;s specifically trained to help divorcing couples untangle the mortgage from the divorce process: buyouts, refinances, understanding what each spouse actually qualifies for on their own. She works closely with family law attorneys and mediators and knows how to operate inside that process without making things harder than they already are.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Bri is a Senior Loan Officer with Movement Mortgage — not a big-bank call center. She has access to a wide range of loan programs, advocates directly for her clients, and works with a local team. She cares about Portland&apos;s housing landscape because she&apos;s watched it change over two decades. She wants the people who love this city to be able to stay in it.
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
              <div className="max-w-[720px]">
                <div className="border-b border-border">
                  {[
                    { label: "Title", value: "Senior Loan Officer — Movement Mortgage" },
                    { label: "NMLS", value: "#1367416" },
                    { label: "Licensed", value: "Oregon & Washington" },
                    { label: "Designation", value: "CDLP — Certified Divorce Lending Professional" },
                    { label: "Member", value: "Mortgage Bankers Association" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex justify-between items-baseline py-4 border-t border-border"
                    >
                      <span className="text-[0.88rem] font-semibold text-ink">
                        {row.label}
                      </span>
                      <span className="text-[0.88rem] text-ink-mid font-normal text-right max-w-[440px]">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed mt-6">
                  The CDLP designation means Bri is specifically trained to help divorcing homeowners navigate property buyouts, refinances, and new purchase financing during one of life&apos;s most stressful transitions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Mother-Daughter Story */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                The Team
              </p>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Tammi Lindley came into the mortgage industry first. She built a reputation in Portland the old-fashioned way — one client at a time, with enough local knowledge and honesty that people kept referring their friends. When her daughter Bri followed her into the business, it wasn&apos;t a grand plan. It was just what made sense.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  They built something together. Tammi brought the foundation — years of relationships, a clear-eyed view of the Portland market through multiple cycles, and a way of talking to clients that put people at ease. Bri brought fresh energy, an appetite for continuing education, and eventually a specialization in divorce lending that opened up a whole category of clients who had nowhere else to turn.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Tammi is largely retired now. Bri carries the work forward. But Tammi still picks up the occasional call, still shows up when it matters, and still has opinions about Portland real estate that are worth hearing. Some teams you inherit. Some you build. The Lindley Team is a little of both.
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
                Our Lender
              </p>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  David and Bri originate through Movement Mortgage, a direct lender and servicer — meaning loans are underwritten, funded, and often serviced in-house rather than handed off to a faceless third party. That matters more than most borrowers realize: when the lender controls the process, conditions get cleared faster and your loan officer can actually advocate for your file.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Movement offers a full range of loan programs — conventional, FHA, VA, USDA, jumbo, and more — so the team isn&apos;t locked into one product shelf. They find the right fit for your situation, not the one that&apos;s easiest to push through.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  The relationship doesn&apos;t end at closing. Clients come back when they refinance, when they upgrade, when life changes and they need to think through their options again. That&apos;s not a sales pitch — it&apos;s just how David and Bri work.
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
                { stat: "20+", label: "Years in Portland mortgage" },
                { stat: "OR + WA", label: "Licensed states" },
                { stat: "Hundreds", label: "of Portland families helped" },
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
