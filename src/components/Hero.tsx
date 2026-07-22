import Link from "next/link";
import Btn from "@/components/Btn";
import { GOOGLE_REVIEWS } from "@/lib/links";

const PATHWAYS = [
  {
    title: "Buy a home",
    desc: "First one, next one, or the one you'll actually stay in.",
    href: "/services/purchase",
    img: "/img/home-buy.webp",
    treatment: "",
    offset: "",
  },
  {
    title: "Refinance",
    desc: "Lower the payment, pull cash out, drop the PMI.",
    href: "/services/refinance",
    img: "/img/home-refinance.webp",
    treatment: "img-bw",
    offset: "md:mt-10",
  },
  {
    title: "Divorce lending",
    desc: "Untangle the house from the divorce — cleanly.",
    href: "/services/divorce-lending",
    img: "/img/home-divorce.webp",
    treatment: "",
    offset: "md:mt-4",
  },
];

export default function Hero() {
  return (
    <section className="bg-paper pt-[clamp(24px,4.5vh,56px)] pb-[clamp(72px,9vw,132px)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        {/* SPLIT HERO — text column carries the whole story (headline, proof,
            CTAs) so it's guaranteed above the fold on every device. The image
            sits beside it as a contained, framed visual — never a full-bleed
            band with text stacked on top of it. */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-9 lg:gap-14 items-center">
          {/* TEXT COLUMN */}
          <div>
            <h1 className="font-serif font-semibold text-ink text-[clamp(40px,5vw,96px)] leading-[0.96] tracking-[-0.03em] pb-[0.06em]">
              <span className="hero-line block">
                Nobody{" "}
                <em className="not-italic relative inline-block">
                  <span className="font-medium italic text-orange">dreams</span>
                  <svg className="hero-underline absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden>
                    <path d="M2 9 C30 2, 90 2, 118 8" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </em>
              </span>
              <span className="hero-line block">about a mortgage.</span>
            </h1>

            <p className="hero-sub max-w-[44ch] text-[clamp(16px,1.25vw,19px)] text-ink-mid leading-relaxed mt-[clamp(20px,2.8vw,34px)]">
              So we made ours the easy part. We&rsquo;ve spent{" "}
              <strong className="font-semibold text-orange">35 years</strong> on Portland
              mortgages — show us what you&rsquo;re working with and you&rsquo;ll know exactly
              where you stand, usually the same day you ask.
            </p>

            <div className="hero-cta grid sm:flex sm:flex-wrap items-center gap-3 sm:gap-x-4 mt-7 sm:mt-8">
              <Btn href="/apply" variant="accent" size="lg" className="w-full sm:w-auto justify-between">
                Find out where you stand
              </Btn>
              <Btn href="/contact#schedule" variant="outline" size="lg" className="w-full sm:w-auto justify-between">
                Ask us anything
              </Btn>
            </div>

            {/* Trust footnote — one quiet block, not a stacked wall of fine print.
                Reassurance + reviews share a row; NMLS sits right under it at
                lower emphasis (Material-style opacity hierarchy) instead of
                behind a divider that reads like "here comes the fine print." */}
            <div className="hero-proof mt-7 flex flex-wrap items-center gap-x-5 gap-y-1.5">
              <a
                href={GOOGLE_REVIEWS}
                target="_blank"
                rel="noopener noreferrer"
                className="group/rev flex items-center gap-2 font-body text-[13px] text-ink-light hover:text-orange transition-colors"
              >
                <span className="text-orange" aria-hidden>★★★★★</span>
                <span className="font-semibold text-ink group-hover/rev:text-orange transition-colors">156</span>
                <span className="underline decoration-ink/20 underline-offset-4 group-hover/rev:decoration-orange transition-colors">
                  five-star reviews
                </span>
              </a>
              <span className="font-body text-[13px] text-ink-light">
                No credit pull to start.
              </span>
            </div>
            {/* NMLS licensing — required visible above the fold. */}
            <p className="font-body text-[10.5px] tracking-[0.02em] text-ink-light/70 mt-2 leading-relaxed">
              Movement Mortgage NMLS #39179 · David Chandler NMLS #265974 · Brianna Lindley NMLS #1367416
            </p>
          </div>

          {/* IMAGE COLUMN — contained card, flat lime panel offset behind it
              (Met poster-collage move), no overlaid text or gradient. The
              lime frame is scoped to its own wrapper so it sits behind just
              the photo, not the caption below it. Taller crop + wider column
              give the photo real weight instead of a small inset beside the
              now much bigger headline. */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 bg-lime translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4" aria-hidden />
              <div className="hero-visual relative overflow-hidden aspect-[6/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/hero-moving-day.webp"
                  alt="Overhead shot of someone lying arms-out on the bare floor of their new living room on move-in day, boxes and a pizza box beside them"
                  width="1260"
                  height="672"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover object-[58%_40%] saturate-[0.96] contrast-[1.02]"
                />
              </div>
            </div>
            <p className="hero-caption font-serif text-ink text-[clamp(14px,1.3vw,17px)] leading-relaxed mt-4">
              <span className="italic">&ldquo;This is the part you dream about.&rdquo;</span>
              <span className="block not-italic text-ink-light mt-1">
                We handle the other part. &mdash; David &amp; Bri
              </span>
            </p>
          </div>
        </div>

        {/* Three independent pathways — not steps. All three remain visible on
            mobile, with generous separation from the hero narrative above. */}
        <div className="mt-[clamp(96px,12vw,176px)] border-t border-ink pt-5 sm:pt-6">
          <h2 className="font-serif font-semibold text-[clamp(30px,4vw,56px)] leading-[0.98] tracking-[-0.025em]">
            Start with what you need.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-5 lg:gap-7 mt-[clamp(40px,5vw,68px)]">
            {PATHWAYS.map((path) => (
              <Link key={path.title} href={path.href} className={`group block min-w-0 ${path.offset}`}>
                <div className="border border-ink/10 bg-paper p-2">
                  <div className="aspect-[4/3] overflow-hidden bg-bg-alt">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={path.img}
                      alt=""
                      width="1024"
                      height="768"
                      loading="lazy"
                      decoding="async"
                      className={`w-full h-full object-cover saturate-[0.9] contrast-[1.03] transition-all duration-700 group-hover:scale-[1.025] ${path.treatment}`}
                    />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-5 mt-6">
                  <div>
                    <h3 className="font-grotesk font-bold text-[clamp(22px,2vw,30px)] leading-none tracking-[-0.02em] transition-colors group-hover:text-orange">
                      {path.title}
                    </h3>
                    <p className="text-[14px] text-ink-light leading-relaxed mt-2 max-w-[34ch]">{path.desc}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors group-hover:bg-ink group-hover:text-paper" aria-hidden>
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
