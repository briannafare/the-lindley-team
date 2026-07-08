import Link from "next/link";

const PEOPLE = [
  {
    src: "/team/david.jpg",
    name: "David Chandler",
    role: "Loan Officer · Movement Mortgage",
    meta: "NMLS 265974 · AZ · CA · GA · OR · WA",
    line: "4.85★ across 210 reviews — makes the whole thing feel straightforward, which in a mortgage is the rarest thing there is.",
  },
  {
    src: "/team/bri.jpg",
    name: "Bri Lindley",
    role: "Senior Loan Officer · Movement Mortgage",
    meta: "NMLS 1367416 · CDLP · OR · WA",
    line: "Portland born, six generations deep. Certified Divorce Lending Professional for the moments that need a steadier hand.",
  },
];

export default function MeetTheTeam() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(56px,8vw,120px)]">
      {/* section header */}
      <div className="flex items-baseline gap-3.5 border-t border-ink pt-4">
        <h2 className="font-grotesk font-extrabold text-[clamp(26px,3.4vw,46px)] leading-none tracking-[-0.02em]">
          Meet David &amp; Bri
        </h2>
        <sup className="font-body text-[12px] text-ink-light font-medium">(01)</sup>
        <span className="flex-1" />
        <Link
          href="/about"
          className="font-body text-[12px] tracking-[0.1em] uppercase font-semibold flex items-center gap-1.5 hover:text-orange transition-colors"
        >
          Our story <span className="w-1.5 h-1.5 rounded-full bg-orange inline-block" />
        </Link>
      </div>

      {/* lead statement */}
      <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-8 items-end mt-10">
        <p className="font-serif text-[clamp(28px,4.2vw,60px)] leading-[1.02] tracking-[-0.02em]">
          You&rsquo;re not working with a call center. You&rsquo;re working with{" "}
          <em className="italic text-orange">us.</em>
        </p>
        <p className="text-[clamp(15px,1.2vw,18px)] text-ink-mid leading-relaxed max-w-[46ch]">
          Two lenders, one team, under Movement Mortgage. We read Portland by the
          neighborhood, tell you the truth about buying here, and stay in it with
          you from the first call to the keys.
        </p>
      </div>

      {/* the faces — big, real, B&W → color on hover */}
      <div className="grid md:grid-cols-2 gap-[clamp(16px,2vw,32px)] mt-[clamp(28px,3.5vw,56px)]">
        {PEOPLE.map((p) => (
          <div key={p.name} className="group">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-ink/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.name}
                className="w-full h-full object-cover object-top img-bw transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-[clamp(26px,3vw,42px)] leading-none tracking-[-0.01em]">
                {p.name}
              </h3>
              <Link
                href="/apply"
                className="font-body text-[11px] tracking-[0.12em] uppercase font-semibold shrink-0 border-b border-ink pb-0.5 hover:text-orange hover:border-orange transition-colors"
              >
                Apply →
              </Link>
            </div>
            <p className="font-body text-[0.72rem] tracking-[0.12em] uppercase text-ink-light mt-2.5">
              {p.role}
            </p>
            <p className="font-body text-[0.72rem] tracking-[0.06em] uppercase text-orange mt-1">
              {p.meta}
            </p>
            <p className="text-[0.97rem] text-ink-mid leading-relaxed mt-3 max-w-[46ch]">
              {p.line}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
