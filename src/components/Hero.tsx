"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Btn from "@/components/Btn";
import { GOOGLE_REVIEWS } from "@/lib/links";

// Met treatment: red ⇄ cobalt for the number labels (lime text on white
// fails contrast at this weight/size, so yellow shows up as a dot marker
// instead — same non-text pattern already used in LoanShelf/NeighborhoodGrid).
// Mixed photo styles — one B&W (⇄ color on hover) among color.
const CARDS = [
  { no: "01", accent: "text-orange", dot: false, bw: false, offset: "", title: "Buy a home", desc: "First one, next one, or the one you'll actually stay in.", href: "/services/purchase", img: "/img/home-buy.webp" },
  { no: "02", accent: "text-cobalt", dot: false, bw: true, offset: "md:mt-10", title: "Refinance", desc: "Lower the payment, pull cash out, drop the PMI.", href: "/services/refinance", img: "/img/home-refinance.webp" },
  { no: "03", accent: "text-orange", dot: true, bw: false, offset: "md:mt-4", title: "Divorce lending", desc: "Untangle the house from the divorce — cleanly.", href: "/services/divorce-lending", img: "/img/home-divorce.webp" },
];

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
        tl.from(".hero-line", { y: 46, opacity: 0, duration: 0.85, stagger: 0.1 })
          .from(".hero-underline", { scaleX: 0, transformOrigin: "left center", duration: 0.6 }, "-=0.4")
          .from(".hero-sub", { y: 22, opacity: 0, duration: 0.6 }, "-=0.35")
          .from(".hero-cta", { y: 20, opacity: 0, duration: 0.55 }, "-=0.35")
          .from(".hero-proof", { y: 16, opacity: 0, duration: 0.5 }, "-=0.3")
          .from(".hero-visual", { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.inOut" }, "-=0.7")
          .from(".hero-caption", { opacity: 0, y: 10, duration: 0.5 }, "-=0.3")
          .from(".hero-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.2");
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-paper pt-[clamp(24px,4.5vh,56px)] pb-[clamp(28px,3vw,44px)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        {/* SPLIT HERO — text column carries the whole story (headline, proof,
            CTAs) so it's guaranteed above the fold on every device. The image
            sits beside it as a contained, framed visual — never a full-bleed
            band with text stacked on top of it. */}
        <div className="grid lg:grid-cols-[1.06fr_0.94fr] gap-10 lg:gap-16 items-center">
          {/* TEXT COLUMN */}
          <div>
            <h1 className="font-serif font-semibold text-ink text-[clamp(38px,4.6vw,88px)] leading-[0.98] tracking-[-0.03em] pb-[0.06em]">
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

            <p className="hero-sub max-w-[46ch] text-[clamp(16px,1.25vw,19px)] text-ink-mid leading-relaxed mt-[clamp(18px,2.4vw,30px)]">
              So we made ours the easy part. We&rsquo;ve spent{" "}
              <strong className="font-semibold text-orange">35 years</strong> on Portland
              mortgages — show us what you&rsquo;re working with and you&rsquo;ll know exactly
              where you stand, usually the same day you ask.
            </p>

            <div className="hero-cta flex flex-wrap items-center gap-x-4 gap-y-3 mt-7">
              <Btn href="/apply" variant="accent" size="lg">
                Find out where you stand
              </Btn>
              <Btn href="/contact#schedule" variant="outline" size="lg">
                Ask us anything
              </Btn>
            </div>

            <div className="hero-proof mt-6 pt-5 border-t border-border">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <p className="font-body text-[13px] text-ink-light">
                  Fifteen minutes. No credit pull to start. Just clarity.
                </p>
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
              </div>
              {/* NMLS licensing — required visible above the fold. */}
              <p className="font-body text-[11px] tracking-[0.03em] text-ink-light mt-3 leading-relaxed">
                Movement Mortgage NMLS <span className="text-ink-mid font-medium">#39179</span>
                <span className="mx-1.5 text-border" aria-hidden>·</span>
                David Chandler NMLS <span className="text-ink-mid font-medium">#265974</span>
                <span className="mx-1.5 text-border" aria-hidden>·</span>
                Brianna Lindley NMLS <span className="text-ink-mid font-medium">#1367416</span>
              </p>
            </div>
          </div>

          {/* IMAGE COLUMN — contained card, flat lime panel offset behind it
              (Met poster-collage move), no overlaid text or gradient. The
              lime frame is scoped to its own wrapper so it sits behind just
              the photo, not the caption below it. */}
          <div>
            <div className="relative">
              <div className="absolute inset-0 bg-lime translate-x-3 translate-y-3 lg:translate-x-4 lg:translate-y-4" aria-hidden />
              <div className="hero-visual relative overflow-hidden aspect-[16/11]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/hero-moving-day.webp"
                  alt="Overhead shot of someone lying arms-out on the bare floor of their new living room on move-in day, boxes and a pizza box beside them"
                  className="w-full h-full object-cover object-[58%_40%] saturate-[0.96] contrast-[1.02]"
                />
              </div>
            </div>
            <p className="hero-caption font-serif italic text-ink text-[clamp(14px,1.3vw,17px)] leading-snug mt-4">
              &ldquo;This is the part you dream about.&rdquo;
              <span className="block not-italic font-body text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-light mt-1.5">
                We handle the other part. — David &amp; Bri
              </span>
            </p>
          </div>
        </div>

        {/* NUMBERED LOAN CARDS — staggered rhythm, tri-color accent, one B&W (⇄ color) in the mix */}
        <div className="grid md:grid-cols-3 gap-[clamp(14px,1.6vw,24px)] mt-[clamp(40px,5vw,72px)]">
          {CARDS.map((c) => (
            <Link key={c.no} href={c.href} className={`hero-card group block ${c.offset}`}>
              <div className={`font-grotesk font-extrabold text-[13px] ${c.accent} flex items-center gap-1.5`}>
                {c.no}
                {c.dot && <span className="w-1.5 h-1.5 rounded-full bg-lime" aria-hidden />}
              </div>
              <div className="aspect-[4/3] my-2.5 overflow-hidden bg-bg-alt">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt=""
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${c.bw ? "img-bw" : ""}`}
                />
              </div>
              <h3 className="font-grotesk font-bold text-[clamp(17px,1.5vw,21px)] tracking-[-0.01em] group-hover:text-orange transition-colors">
                {c.title}
              </h3>
              <p className="text-[13.5px] text-ink-light mt-1">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
