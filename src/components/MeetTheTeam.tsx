import Link from "next/link";

const PEOPLE: {
  src: string;
  hover: string | null;
  bw: boolean;
  name: string;
  role: string;
  meta: string;
  bio: string;
  width: number;
  height: number;
}[] = [
  // Met treatment: composed B&W first → warm/fun color on hover.
  {
    src: "/team/david-serious.webp",
    hover: "/team/david-fun.webp",
    bw: true,
    name: "David Chandler",
    role: "Mortgage Loan Officer",
    meta: "NMLS 265974 · Movement",
    bio: "Twenty-plus years in, and David explains a mortgage like someone with nothing to hide — plain, patient, down to the decimal. Most loans are simpler than the internet makes them look, and he'll tell you so; when yours isn't — self-employed, building, the price says jumbo — he's closed a few hundred like it. He invests in real estate himself, so he reads a deal like a buyer, not a brochure.",
    width: 1024,
    height: 1024,
  },
  {
    src: "/team/bri-serious.webp",
    hover: "/team/bri-fun.webp",
    bw: true,
    name: "Bri Lindley",
    role: "Mortgage Loan Officer · CDLP®",
    meta: "NMLS 1367416 · Movement",
    bio: "A Southwest Portland local and one of the few Certified Divorce Lending Professionals in Oregon — the person attorneys call when a house is stuck in the middle of a divorce. She got into this because nothing sets people up for long-term wealth like owning where they live: it turns a necessity into an investment without much extra effort, and almost nobody says that part out loud. Before mortgages she trained surgeons on medical devices, which is about how she reads your file — carefully, out loud, until it makes sense.",
    width: 800,
    height: 1280,
  },
];

export default function MeetTheTeam() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(76px,9vw,148px)]">
      {/* header */}
      <div className="flex items-baseline justify-between gap-5 border-t border-ink pt-5">
        <h2 className="font-serif font-semibold text-[clamp(30px,3.8vw,52px)] leading-none tracking-[-0.025em]">
          Meet David &amp; Bri
        </h2>
        <Link
          href="/about"
          className="shrink-0 font-body text-[14px] font-medium underline decoration-ink/20 underline-offset-4 hover:text-orange hover:decoration-orange transition-colors"
        >
          Our story →
        </Link>
      </div>

      {/* statement */}
      <p className="font-serif text-[clamp(30px,5vw,72px)] leading-[1.0] tracking-[-0.02em] max-w-[20ch] mt-10">
        You get David or Bri. That&rsquo;s the{" "}
        <em className="italic text-orange">whole org chart.</em>
      </p>

      {/* two real faces, clean */}
      <div className="grid md:grid-cols-2 gap-[clamp(16px,2vw,32px)] mt-[clamp(28px,3.5vw,52px)]">
        {PEOPLE.map((p) => (
          <div key={p.name} data-scroll-active className="group">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-ink/5 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.name}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] group-data-[active=true]:scale-[1.03] ${p.bw ? "img-bw" : ""}`}
              />
              {p.hover && (
                /* eslint-disable-next-line @next/next/no-img-element */
                /* Color version fades in on hover (desktop) or when the card scrolls
                   through center on touch (via ScrollActiveController). */
                <img
                  src={p.hover}
                  alt=""
                  aria-hidden
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:scale-[1.03] group-data-[active=true]:opacity-100 group-data-[active=true]:scale-[1.03]"
                />
              )}
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-3">
              <h3 className="font-serif text-[clamp(26px,3vw,42px)] leading-none tracking-[-0.01em]">
                {p.name}
              </h3>
              <Link
                href="/apply"
                className="font-body text-[14px] font-medium shrink-0 underline decoration-ink/20 underline-offset-4 hover:text-orange hover:decoration-orange transition-colors"
              >
                Apply →
              </Link>
            </div>
            <p className="font-body text-[13px] text-ink-light mt-2.5">
              {p.role} · {p.meta}
            </p>
            <p className="font-body text-[14px] text-ink-mid leading-relaxed mt-3 max-w-[46ch]">
              {p.bio}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[clamp(15px,1.2vw,18px)] text-ink-mid leading-relaxed max-w-[52ch] mt-12">
        Between them: 35 years on Portland mortgages, and a client list that&rsquo;s
        mostly referrals.
      </p>
    </section>
  );
}
