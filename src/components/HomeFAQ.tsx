"use client";

/** Field questions — answers adapted from the services guide. */
const FAQS = [
  {
    q: "How much do I need for a down payment in Portland?",
    a: "Anywhere from 0% (VA) to 3% (Conventional) to 3.5% (FHA). Twenty percent avoids PMI, but most Portland buyers put down far less — and Oregon has assistance programs like OHCS that can cover part of your upfront costs. We'll walk you through every option.",
  },
  {
    q: "Should I get pre-approved before house hunting?",
    a: "Yes. In Portland's market, listing agents expect a pre-approval letter with your offer — without one, you won't be taken seriously. It also tells you what you can actually afford, so you're not touring homes outside your range.",
  },
  {
    q: "How long does the whole process take?",
    a: "Pre-approval takes 24–48 hours. From accepted offer to keys is typically 30–45 days. The biggest variable is finding the right house — once you're under contract, we move fast.",
  },
  {
    q: "What credit score do I need?",
    a: "580 for FHA, 620 for most Conventional loans, and no set minimum for VA. Below those thresholds, we can talk through strategies to improve your score before you apply.",
  },
  {
    q: "What makes you different from a bank?",
    a: "A bank can only sell you its own products. We fund most loans in-house as a correspondent lender — faster closings, more control — and when a different product genuinely fits better, we can broker that instead. Either way, the structure follows your goals.",
  },
];

export default function HomeFAQ() {
  return (
    <section className="py-24 lg:py-32 border-t border-paper-200">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_1fr] gap-x-16 gap-y-10">
          <h2 className="font-display font-normal text-display-lg text-paper-900">
            Field questions
          </h2>
          <div className="border-t border-paper-200">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group border-b border-paper-200">
                <summary className="flex items-baseline justify-between gap-8 py-5 cursor-pointer list-none">
                  <h3 className="font-display font-normal text-[1.15rem] leading-snug text-paper-900">
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
  );
}
