import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About The Lindley Team at Movement Mortgage | Portland | NMLS #1367416 / #265974",
  description:
    "Two decades in the making: meet David Chandler & Bri Lindley, The Lindley Team at Movement Mortgage. Portland loan officers helping Oregon, Washington & Arizona families buy and refinance homes.",
};

const FAQS = [
  {
    q: "What areas does The Chandler/Lindley Lending Team serve?",
    a: "Our roots are in the Portland area, and we personally handle loans across Oregon, Washington, and Arizona. But if you're looking to buy outside of those states, you are still in excellent hands. We have a dedicated, in-house team at Movement Mortgage that handles our out-of-state clients. They work closely with us behind the scenes to guarantee you receive the exact same level of service and exactness you expect from our team.",
  },
  {
    q: "What is a Certified Divorce Lending Professional (CDLP®)?",
    a: "A CDLP® is specifically trained to help divorcing homeowners navigate property buyouts, refinances, and new-purchase financing. Bri Lindley uses this specialized training to work directly with clients and their attorneys to untangle complex shared real estate assets during life's most stressful transitions.",
  },
  {
    q: "What types of complex loans do you specialize in?",
    a: "David Chandler specializes in complex financial profiles, including Jumbo loans, construction loans, self-employed income verification, and investment properties. If your financial situation doesn't fit in a standard box, we have the experience to find the right lever to pull.",
  },
  {
    q: "Why MOVEMENT MORTGAGE?",
    a: "Most lenders scramble just to hit a deadline. Movement does the exact opposite. By underwriting your loan at the very beginning of the process, we eliminate the last-minute chaos typical of the mortgage industry. We aim to assess and clear your loan from underwriting within six hours,* process over 75% of our loans in seven business days or less — allowing us to send closing documents out weeks in advance — and coordinate the final paperwork and funds with the closing attorney early, so closing day is just the moment you get your keys. This commitment to a best-in-class experience with the resources of a major national lender, combined with our boutique, highly communicative team approach, is what sets us apart.",
  },
];

function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
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

export default function AboutPage() {
  return (
    <>
      <FAQSchema />
      <Nav />
      <main>

        {/* Hero */}
        <section className="pt-[clamp(24px,5vh,56px)] pb-20 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-tight mb-6">
              Two Decades<br />
              <span className="font-script font-normal text-orange text-[0.9em]">in the Making</span>
            </h1>
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[620px]">
              More than 20 years ago, David Chandler hired Tammi Lindley as a new loan officer with zero industry experience. It turned out to be one of the best decisions he ever made.
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

        {/* Our Story */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Our Story
              </h2>
              <div className="max-w-[720px] space-y-5">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  It turned out to be a lifelong friendship and what has become a defining partnership. Over the next two decades, Tammi — alongside her daughter, Bri — built one of the most trusted and premier mortgage lending teams in the Portland area. Tammi built her mortgage practice the right way: one straight conversation at a time, until half of Portland seemed to know someone she&apos;d taken care of.
                </p>
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                  Today, Tammi is enjoying a well-deserved retirement, but the standard that she set remains our baseline. David and Bri now lead the team together — bringing decades of combined lending expertise and meticulous operational systems to every client.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Your Guides */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Meet Your Guides
              </h2>
              <div className="max-w-[720px] space-y-14">

                <div>
                  <h3 className="font-display text-[1.3rem] font-bold text-ink mb-4">
                    David Chandler <span className="text-ink-light font-normal">| Mortgage Loan Officer</span>
                  </h3>
                  <div className="space-y-5">
                    <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                      David has done this for more than 20 years, and he explains it like someone with nothing to hide. Whether it&apos;s your first home, and the process feels overwhelming or when your loan isn&apos;t simple — you&apos;re self-employed, you&apos;re building a home, or the price tag requires a jumbo loan — he&apos;s closed a few hundred just like it and knows exactly which lever to pull.
                    </p>
                    <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                      As an active investor himself, with his own money on the line, he approaches your financing with the exactness of analyzing your options like a fellow buyer focused on real-world numbers, rather than a sales person selling a rate. Hundreds of five-star reviews suggest the approach works.
                    </p>
                  </div>
                  <div className="mt-5 space-y-1">
                    <p className="text-[0.82rem] text-ink-mid font-normal">
                      <span className="font-semibold text-ink">Focus:</span> Construction · Self-employed · Investment Property
                    </p>
                    <p className="text-[0.82rem] text-ink-mid font-normal">
                      <span className="font-semibold text-ink">Credentials:</span> NMLS #265974 | Licensed in OR, WA &amp; AZ
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-14">
                  <h3 className="font-display text-[1.3rem] font-bold text-ink mb-4">
                    Bri Lindley <span className="text-ink-light font-normal">| Mortgage Loan Officer &amp; CDLP&reg;</span>
                  </h3>
                  <div className="space-y-5">
                    <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                      Bri didn&apos;t find the mortgage business — she was raised in it. Keeping the team&apos;s standard of care isn&apos;t just a value statement for her; it&apos;s a family matter. Bri built the team&apos;s systems herself — the updates, the follow-ups, and the &ldquo;here&apos;s exactly where things stand&rdquo; messages — so clients never have to wonder what&apos;s happening with their file.
                    </p>
                    <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                      She is also a Certified Divorce Lending Professional (CDLP&reg;), a designation only a handful of Oregon lenders hold. When a &lsquo;house&rsquo; is caught in the middle of a divorce, Bri works alongside attorneys to untangle the buyout, the refinance, and provide a clear read on what each person can afford next. It&apos;s exacting work with a simple goal: ensuring that at the end of the process, someone keeps their footing with a next chapter that actually pencils.
                    </p>
                  </div>
                  <div className="mt-5 space-y-1">
                    <p className="text-[0.82rem] text-ink-mid font-normal">
                      <span className="font-semibold text-ink">Focus:</span> Divorce Lending · First Time Homebuyers
                    </p>
                    <p className="text-[0.82rem] text-ink-mid font-normal">
                      <span className="font-semibold text-ink">Credentials:</span> NMLS #1367416 | Licensed in OR &amp; WA | CDLP&reg; (Certified Divorce Lending Professional)
                    </p>
                  </div>
                </div>

                <p className="text-[0.7rem] text-ink-light leading-relaxed">
                  Both work through Movement Mortgage, NMLS ID&nbsp;#39179.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Work */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                How We Work
              </h2>
              <div className="max-w-[720px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-10">
                  We believe securing a mortgage should be simple and predictable. Here is how we ensure you have an experience you&apos;ll rave about to your friends and family:
                </p>
                <ol className="space-y-8">
                  {[
                    {
                      title: "Have a Straight Conversation",
                      body: "Schedule a call with us so we can understand your exact financial picture and goals without the jargon.",
                    },
                    {
                      title: "Get a Clear, Custom Read",
                      body: "We map out the numbers — down to the decimal — so you know exactly what you can afford, which levers to pull, and what to expect.",
                    },
                    {
                      title: "Close With Confidence",
                      body: "Rely on our best in class Underwriting, Processing and Funding teams as well as our proactive communication to cross the finish line smoothly and step into your new home.",
                    },
                  ].map((step, i) => (
                    <li key={step.title} className="flex gap-5">
                      <span className="font-display text-[1.5rem] font-extrabold text-orange shrink-0 leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-[1rem] font-bold text-ink mb-1">
                          {step.title}
                        </h3>
                        <p className="text-[0.95rem] leading-[1.7] text-ink-mid font-normal">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <a
                  href="/contact"
                  className="mt-10 px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] hover:shadow-xl transition-all inline-flex items-center gap-2 justify-center"
                >
                  Schedule Your Consultation Today <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <div>
                <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-1">
                  FAQ
                </h2>
                <p className="text-[0.78rem] text-ink-light">
                  {FAQS.length} questions
                </p>
              </div>
              <div className="max-w-[720px]">
                {FAQS.map((faq, i) => (
                  <details key={i} className="group border-b border-border">
                    <summary className="flex justify-between items-center gap-4 py-5 cursor-pointer list-none">
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
                <p className="text-[0.7rem] text-ink-light leading-relaxed mt-6">
                  *While it is Movement Mortgage&apos;s goal to provide underwriting results within six hours of receiving an application, process loans in seven days, and close in one day, extenuating circumstances may cause delays outside of this window.
                </p>
                <p className="text-[0.7rem] text-ink-light leading-relaxed mt-2">
                  CDLP&reg; is a registered certification mark of the Divorce Lending Association.
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
                { stat: "OR · WA · AZ", label: "Where the team is licensed" },
                { stat: "Hundreds", label: "of five-star client reviews" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-none mb-3">
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
