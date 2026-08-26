"use client";

import Link from "next/link";
import Image from "next/image";
import { ServiceData } from "@/lib/services";

function FAQSchema({ faqs }: { faqs: ServiceData["faqs"] }) {
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

function ServiceSchema({ service }: { service: ServiceData }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "The Lindley Team at Movement Mortgage",
      employee: [
        { "@type": "Person", name: "David Chandler", jobTitle: "Mortgage Loan Officer", identifier: "NMLS #265974" },
        { "@type": "Person", name: "Bri Lindley", jobTitle: "Mortgage Loan Officer", identifier: "NMLS #1367416" },
      ],
    },
    areaServed: [
      { "@type": "State", name: "Oregon" },
      { "@type": "State", name: "Washington" },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function ServicePageLayout({
  service,
  calculator,
}: {
  service: ServiceData;
  calculator?: React.ReactNode;
}) {
  return (
    <>
      <FAQSchema faqs={service.faqs} />
      <ServiceSchema service={service} />

      {/* Hero */}
      <section className="pt-40 pb-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-end">
            <div>
              <Link
                href="/services"
                className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-4 inline-flex items-center gap-2 hover:text-ink transition-colors"
              >
                ← Services
              </Link>
              <h1 className="font-serif font-semibold text-[clamp(3rem,7.5vw,6rem)] leading-[0.92] tracking-[-0.02em] mt-4 mb-6">
                {service.name.split(" ").map((word, i, arr) =>
                  i === arr.length - 1 ? (
                    <span key={i} className="italic font-medium text-orange">
                      {word}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </h1>
              <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[600px]">
                {service.tagline}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
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
            {/* Art-object style image with treatment */}
            <div className="rounded-[2rem] overflow-hidden aspect-square relative hidden lg:block">
              <Image
                src={service.heroImage}
                alt={service.name}
                fill
                className="object-cover"
                sizes="400px"
                priority
              />
              <div className="absolute inset-0 bg-[#ef44340d] mix-blend-multiply" />
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Overview
            </h2>
            <div className="max-w-[720px]">
              <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Who It&apos;s For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[720px]">
              {service.whoFor.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow mt-2 shrink-0" />
                  <span className="text-[0.95rem] text-ink-mid font-normal leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 border-t border-border bg-bg-alt">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[720px]">
              {service.process.map((step) => (
                <div key={step.step}>
                  <div className="font-display text-3xl font-extrabold text-border mb-2">
                    {step.step}
                  </div>
                  <h3 className="font-display text-lg font-bold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Requirements
            </h2>
            <div className="max-w-[720px]">
              {service.requirements.map((req, i) => (
                <div
                  key={i}
                  className="flex justify-between items-baseline py-4 border-b border-border"
                >
                  <span className="text-[0.88rem] font-semibold text-ink">
                    {req.label}
                  </span>
                  <span className="text-[0.88rem] text-ink-mid font-normal text-right max-w-[400px]">
                    {req.value}
                  </span>
                </div>
              ))}
              <p className="text-[0.78rem] text-ink-light font-normal leading-relaxed mt-5 border-l-2 border-border pl-4">
                These are general guidelines, not a quote or commitment to lend. Actual terms depend
                on credit approval, income, and underwriting — not all applicants will qualify, and
                programs and requirements are subject to change without notice. Through Movement
                Mortgage we have access to additional programs with different requirements.{" "}
                <a href="/contact" className="underline hover:text-ink transition-colors">
                  Contact David &amp; Bri
                </a>{" "}
                for options specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
              Pros & Cons
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-[720px]">
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-ink mb-4">
                  Advantages
                </h3>
                {service.pros.map((pro, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow mt-2 shrink-0" />
                    <span className="text-[0.88rem] text-ink-mid font-normal leading-relaxed">
                      {pro}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] text-ink mb-4">
                  Considerations
                </h3>
                {service.cons.map((con, i) => (
                  <div key={i} className="flex items-start gap-3 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                    <span className="text-[0.88rem] text-ink-mid font-normal leading-relaxed">
                      {con}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      {calculator && (
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Calculator
              </h2>
              <div className="max-w-[720px]">{calculator}</div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 border-t border-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
            <div>
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-1">
                FAQ
              </h2>
              <p className="text-[0.78rem] text-ink-light">
                {service.faqs.length} questions
              </p>
            </div>
            <div className="max-w-[720px]">
              {service.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-border"
                >
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
            Ready to explore{" "}
            <span className="font-serif italic font-medium text-orange text-[0.95em]">
              {service.shortName.toLowerCase()}
            </span>
            ?
          </h2>
          <p className="text-base text-ink-mid font-normal max-w-[440px] mx-auto mb-8">
            Schedule a complimentary consultation. We&apos;ll review your situation and
            tell you honestly whether this is the right move.
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
    </>
  );
}
