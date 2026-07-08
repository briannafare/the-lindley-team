import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";

const PEOPLE = [
  {
    seed: "david-chandler",
    name: "David Chandler",
    role: "Loan Officer · Movement Mortgage",
    meta: "NMLS 265974 · AZ · CA · GA · OR · WA",
    line: "4.85★ across 210 reviews. Makes the whole thing feel straightforward — which, in a mortgage, is the rarest thing there is.",
    tone: "bw" as const,
  },
  {
    seed: "bri-lindley",
    name: "Bri Lindley",
    role: "Senior Loan Officer · Movement Mortgage",
    meta: "NMLS 1367416 · CDLP · OR · WA",
    line: "Portland born, six generations deep. Certified Divorce Lending Professional for the situations that need a steadier hand.",
    tone: "color" as const,
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

      {/* lead: statement + big duo portrait */}
      <div className="grid lg:grid-cols-[1fr_minmax(360px,42%)] gap-[clamp(24px,4vw,64px)] mt-10 items-center">
        <div>
          <p className="font-serif text-[clamp(28px,4.4vw,64px)] leading-[1.02] tracking-[-0.02em]">
            You&rsquo;re not working with a call center. You&rsquo;re working with{" "}
            <em className="italic text-orange">us.</em>
          </p>
          <p className="text-[clamp(15px,1.2vw,18px)] text-ink-mid leading-relaxed max-w-[46ch] mt-6">
            Two lenders, one team, under Movement Mortgage. We read Portland by the
            neighborhood, tell you the truth about buying here, and stay in it with
            you from the first call to the keys.
          </p>
          <Link
            href="/about"
            className="inline-block mt-8 font-grotesk font-bold text-[15px] border border-ink px-6 py-3.5 rounded-[2px] hover:bg-ink hover:text-paper transition-colors"
          >
            Meet the team
          </Link>
        </div>
        <ImagePlaceholder
          seed="david-bri-duo"
          tone="bw"
          className="rounded-[1.5rem] aspect-[4/5]"
          label="Duo portrait — David & Bri, studio-editorial, neutral backdrop. Real photoshoot."
        />
      </div>

      {/* individual, credited */}
      <div className="grid md:grid-cols-2 gap-[clamp(14px,1.6vw,28px)] mt-[clamp(24px,3vw,44px)]">
        {PEOPLE.map((p) => (
          <div key={p.seed} className="grid grid-cols-[clamp(120px,32%,200px)_1fr] gap-5 items-end">
            <ImagePlaceholder
              seed={p.seed}
              tone={p.tone}
              className="rounded-[1rem] aspect-[4/5]"
              label={`Portrait — ${p.name}. Real photoshoot.`}
            />
            <div className="pb-1">
              <h3 className="font-serif text-[clamp(22px,2.4vw,34px)] leading-none tracking-[-0.01em]">
                {p.name}
              </h3>
              <p className="font-body text-[0.72rem] tracking-[0.12em] uppercase text-ink-light mt-2">
                {p.role}
              </p>
              <p className="font-body text-[0.72rem] tracking-[0.06em] uppercase text-orange mt-1">
                {p.meta}
              </p>
              <p className="text-[0.95rem] text-ink-mid leading-relaxed mt-3">{p.line}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
