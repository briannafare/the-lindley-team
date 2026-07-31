const STEPS = [
  {
    no: "01",
    title: "We talk numbers",
    body: "Yours, real ones — before you fall for a house you can't swing. No credit pull to start, and no pitch.",
  },
  {
    no: "02",
    title: "You get a real answer",
    body: "Usually inside 24–48 hours. If you qualify, it's the kind of pre-approval letter a Portland seller doesn't squint at.",
  },
  {
    no: "03",
    title: "We close on time",
    body: "When we said we would. We handle the paperwork and the moving parts; you handle picking a couch.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(76px,9vw,148px)]">
      {/* section header */}
      <div className="border-t border-ink pt-5">
        <h2 className="font-serif font-semibold text-[clamp(30px,3.8vw,52px)] leading-none tracking-[-0.025em]">
          How it actually goes
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-[clamp(20px,3vw,48px)] mt-12">
        {STEPS.map((s, i) => (
          <div key={s.no} className={i > 0 ? "md:pl-[clamp(20px,3vw,48px)] md:border-l border-border" : ""}>
            <div className="font-serif text-[clamp(40px,5vw,72px)] leading-none text-border">
              {s.no}
            </div>
            <h3 className="font-serif text-[clamp(24px,2.6vw,38px)] leading-none tracking-[-0.01em] mt-5">
              {s.title}
            </h3>
            <p className="text-[clamp(15px,1.1vw,17px)] text-ink-mid leading-relaxed mt-4 max-w-[36ch]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
