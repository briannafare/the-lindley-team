import Link from "next/link";

const STEPS = [
  {
    no: "01",
    title: "Talk",
    body: "A real conversation about where you are, where you want to go, and the numbers behind it. No pressure, no jargon.",
  },
  {
    no: "02",
    title: "Get pre-approved",
    body: "We pull it together fast so you can shop your neighborhood with an offer sellers take seriously.",
  },
  {
    no: "03",
    title: "Get the keys",
    body: "We handle the paperwork, coordinate the moving parts, and stay in it with you all the way to the closing table.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(56px,8vw,120px)]">
      {/* section header */}
      <div className="flex items-baseline gap-3.5 border-t border-ink pt-4">
        <h2 className="font-grotesk font-extrabold text-[clamp(26px,3.4vw,46px)] leading-none tracking-[-0.02em]">
          How it works
        </h2>
        <sup className="font-body text-[12px] text-ink-light font-medium">(03)</sup>
        <span className="flex-1" />
        <Link
          href="/apply"
          className="font-body text-[12px] tracking-[0.1em] uppercase font-semibold flex items-center gap-1.5 hover:text-orange transition-colors"
        >
          Start <span className="w-1.5 h-1.5 rounded-full bg-orange inline-block" />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-[clamp(20px,3vw,48px)] mt-12">
        {STEPS.map((s, i) => (
          <div key={s.no} className={i > 0 ? "md:pl-[clamp(20px,3vw,48px)] md:border-l border-border" : ""}>
            <div className="font-grotesk font-extrabold text-[clamp(40px,5vw,72px)] leading-none text-orange">
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
