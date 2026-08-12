type Faq = { question: string; answer: string }

export default function FaqSection({ faqs }: { faqs?: Faq[] }) {
  if (!faqs?.length) return null

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
          <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
            Common questions
          </h2>
          <div className="max-w-[720px] divide-y divide-border">
            {faqs.map((f, i) => (
              <details key={i} className="group py-5" open={i === 0}>
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none font-display font-bold text-ink text-[1.05rem] leading-snug">
                  {f.question}
                  <span
                    aria-hidden
                    className="mt-1 shrink-0 text-ink-light transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-ink-mid leading-[1.8] text-[1.0rem]">
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
