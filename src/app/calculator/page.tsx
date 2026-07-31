import { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portland Mortgage Calculator — Estimate Your Monthly Payment | The Lindley Team",
  description:
    "Portland mortgage calculator. Estimate your monthly payment including principal, interest, taxes, insurance, and PMI. Updated for current Oregon rates.",
  keywords: [
    "Portland mortgage calculator",
    "Oregon mortgage calculator",
    "home loan calculator Portland",
    "mortgage payment calculator",
    "how much house can I afford Portland",
    "monthly mortgage payment Oregon",
  ],
};

const faqs = [
  {
    q: "How do I calculate my mortgage payment?",
    a: "Your monthly mortgage payment is calculated using the loan amount, interest rate, and loan term. The formula uses amortization to spread the principal and interest evenly across the life of the loan. Our calculator above also includes property taxes, homeowners insurance, and PMI (if applicable) to give you the full monthly cost.",
  },
  {
    q: "What is included in a mortgage payment?",
    a: "A typical mortgage payment includes four components, often called PITI: Principal (paying down your loan balance), Interest (the cost of borrowing), Taxes (property taxes collected monthly and paid annually), and Insurance (homeowners insurance). If your down payment is less than 20%, you'll also pay Private Mortgage Insurance (PMI).",
  },
  {
    q: "How much house can I afford in Portland?",
    a: "A common guideline is that your total housing payment (mortgage + taxes + insurance) shouldn't exceed 28-31% of your gross monthly income. In Portland, where the median home price is around $500,000-$550,000, a household income of approximately $120,000-$140,000 is typically needed for a conventional loan. Our calculator can help you find your specific number.",
  },
  {
    q: "What are current mortgage rates in Portland Oregon?",
    a: "Mortgage rates change daily based on market conditions, your credit score, down payment, and loan type. Rather than publishing rates that will be outdated by tomorrow, we encourage you to contact us for a personalized rate quote based on your specific financial situation. We'll compare options — including products we fund in-house — to find the most competitive rate for your situation.",
  },
  {
    q: "How much is PMI and when can I remove it?",
    a: "PMI typically costs 0.3-1.5% of your loan amount annually, added to your monthly payment. On a $400,000 loan, that's roughly $100-$500/month. You can request PMI removal once you reach 20% equity in your home, and it's automatically removed at 22% equity. One strategy: make a 20% down payment to avoid PMI entirely.",
  },
  {
    q: "What are property taxes in Portland Oregon?",
    a: "Portland property tax rates vary by neighborhood and taxing district, but typically range from 1.0-1.3% of assessed value. On a $500,000 home, expect approximately $5,000-$6,500 per year. Note that assessed value in Oregon is often lower than market value due to Measure 50 limits on annual increases.",
  },
  {
    q: "Should I choose a 15-year or 30-year mortgage?",
    a: "A 30-year mortgage has lower monthly payments but you pay more total interest. A 15-year mortgage has higher monthly payments but saves tens of thousands in interest and builds equity faster. Try both options in our calculator above to see the difference for your specific loan amount.",
  },
  {
    q: "How does my down payment affect my monthly payment?",
    a: "A larger down payment reduces your loan amount (lower monthly payment), may get you a better interest rate, and eliminates PMI at 20% or more. Use the slider in our calculator to see exactly how different down payment amounts change your monthly payment.",
  },
];

export default function CalculatorPage() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section className="pt-40 pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4">
            Tools
          </p>
          <h1 className="font-display text-[clamp(3rem,7vw,5rem)] font-extrabold leading-[0.95] tracking-tight mb-6">
            Portland Mortgage{" "}
            <span className="font-script font-normal text-orange text-[0.85em]">
              Calculator
            </span>
          </h1>
          <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[600px]">
            Estimate your monthly mortgage payment for a home in Portland, Oregon.
            Includes principal, interest, property taxes, insurance, and PMI.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="pb-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="max-w-[700px]">
            <MortgageCalculator variant="full" />
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              How It Works
            </p>
            <div className="max-w-[720px] space-y-4">
              <h2 className="font-display text-2xl font-bold">
                How to use the Portland mortgage calculator
              </h2>
              <p className="text-[0.95rem] text-ink-mid leading-relaxed">
                Start by entering the home price you&apos;re considering. The Portland
                metro area median home price is approximately $500,000-$550,000, but
                prices vary significantly by neighborhood — from the low $300,000s in
                East Portland to well over $1 million in the West Hills, Dunthorpe,
                and Lake Oswego.
              </p>
              <p className="text-[0.95rem] text-ink-mid leading-relaxed">
                Adjust the down payment slider to see how different amounts affect
                your monthly payment. Notice that putting less than 20% down adds
                PMI to your payment. Then fine-tune the interest rate and loan term.
                We default to a 30-year term, but try 15 and 20 years to see the
                tradeoff between monthly payment and total interest paid.
              </p>
              <p className="text-[0.95rem] text-ink-mid leading-relaxed">
                This calculator provides estimates only. Your actual rate, payment,
                and costs depend on your credit score, down payment, loan type, and
                current market conditions. For exact numbers based on today&apos;s
                rates and your specific situation,{" "}
                <Link href="/contact" className="text-orange font-semibold hover:underline">
                  schedule a complimentary consultation
                </Link>{" "}
                with Bri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Calculators / Tools */}
      <section className="py-16 border-t border-border bg-bg-alt">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              More Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[720px]">
              {[
                { name: "Refinance Break-Even", href: "/services/refinance", desc: "Should you refinance? Calculate your break-even point." },
                { name: "FHA Payment Estimator", href: "/services/fha", desc: "Estimate FHA payments with MIP included." },
                { name: "Cash-Out Equity Calculator", href: "/services/cash-out", desc: "How much equity can you access?" },
              ].map((tool) => (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group p-5 bg-white rounded-[1.5rem] border border-border hover:border-ink/20 transition-all"
                >
                  <h3 className="font-display text-sm font-bold mb-1 group-hover:text-orange transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-[0.78rem] text-ink-light leading-snug">
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <div>
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-1">
                FAQ
              </h2>
              <p className="text-[0.78rem] text-ink-light">
                {faqs.length} questions
              </p>
            </div>
            <div className="max-w-[720px]">
              {faqs.map((faq, i) => (
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

      {/* CTA */}
      <section className="py-20 bg-yellow text-center">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight text-ink mb-4">
            Want exact numbers based on{" "}
            <span className="font-script font-normal text-[0.9em]">
              today&apos;s rates
            </span>
            ?
          </h2>
          <p className="text-base text-ink-mid font-normal max-w-[440px] mx-auto mb-8">
            Our calculator gives estimates. A conversation with Bri gives you
            real numbers based on your specific financial situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apply"
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

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      <Footer />
    </>
  );
}
