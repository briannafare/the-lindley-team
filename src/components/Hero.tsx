"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Btn from "@/components/Btn";
import { GOOGLE_REVIEWS } from "@/lib/links";

// Met treatment: mixed photo styles — one B&W (⇄ color on hover) among color,
// not a blanket filter. Accents alternate red/cobalt. Staggered rhythm.
const CARDS = [
  { no: "01", accent: "text-orange", bw: false, offset: "", title: "Buy a home", desc: "First one, next one, or the one you'll actually stay in.", href: "/services/purchase", img: "/img/home-buy.webp" },
  { no: "02", accent: "text-cobalt", bw: true, offset: "md:mt-10", title: "Refinance", desc: "Lower the payment, pull cash out, drop the PMI.", href: "/services/refinance", img: "/img/home-refinance.webp" },
  { no: "03", accent: "text-orange", bw: false, offset: "md:mt-4", title: "Divorce lending", desc: "Untangle the house from the divorce — cleanly.", href: "/services/divorce-lending", img: "/img/home-divorce.webp" },
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
          .from(".hero-cinema", { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "power4.inOut" }, "-=0.5")
          .from(".hero-caption", { opacity: 0, y: 14, duration: 0.6 }, "-=0.3")
          .from(".hero-meta", { y: 24, opacity: 0, duration: 0.6 }, "-=0.35")
          .from(".hero-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3");
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-paper pt-[clamp(28px,5vh,64px)] pb-[clamp(28px,3vw,44px)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        {/* HERO HEADLINE — big, unobstructed. Let it breathe; let them feel it. */}
        <h1 className="font-serif font-semibold text-ink text-[clamp(52px,10.5vw,168px)] leading-[0.95] tracking-[-0.03em] pb-[0.06em]">
          <span className="hero-line block">
            Nobody{" "}
            <em className="not-italic relative inline-block">
              <span className="font-medium italic text-orange">dreams</span>
              <svg className="hero-underline absolute -bottom-1 left-0 w-full" height="14" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9 C30 2, 90 2, 118 8" stroke="var(--accent)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </em>
          </span>
          <span className="hero-line block">about a mortgage.</span>
        </h1>

        {/* CINEMA BAND — the dream itself. Top-down shot, first night in the
            empty house, boxes and pizza still out, one red-sock accent.
            Wide, quiet, editorial. One caption, no chrome. */}
        <div className="hero-cinema relative mt-[clamp(24px,3.5vw,52px)] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/hero-moving-day.webp"
            alt="Overhead shot of someone lying arms-out on the bare floor of their new living room on move-in day, boxes and a pizza box beside them"
            className="w-full h-[clamp(300px,52vw,620px)] object-cover object-[62%_45%] saturate-[0.96] contrast-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" aria-hidden />
          <p className="hero-caption absolute left-[clamp(16px,2.5vw,36px)] bottom-[clamp(14px,2vw,28px)] font-serif italic text-paper text-[clamp(17px,1.9vw,27px)] leading-snug max-w-[26ch] [text-shadow:0_1px_18px_rgba(0,0,0,0.35)]">
            This is the part you dream about.
            <span className="block not-italic font-body text-[0.52em] font-semibold tracking-[0.14em] uppercase mt-2 text-paper/85">
              We handle the other part. — David &amp; Bri
            </span>
          </p>
        </div>

        {/* META ROW — one story, one proof point. Nothing else. */}
        <div className="hero-meta grid md:grid-cols-[1.2fr_auto] gap-8 md:gap-12 mt-[clamp(26px,3.5vw,54px)] items-start">
          <div>
            <p className="max-w-[52ch] text-[clamp(16px,1.25vw,19px)] text-ink-mid leading-relaxed">
              So we made ours the easy part. We&rsquo;ve spent{" "}
              <strong className="font-semibold text-orange">35 years</strong> on Portland
              mortgages — show us what you&rsquo;re working with and you&rsquo;ll know exactly
              where you stand, usually the same day you ask.
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-7">
              <Btn href="/apply" variant="accent" size="lg">
                Find out where you stand
              </Btn>
              <Btn href="/contact#schedule" variant="outline" size="lg">
                Ask us anything
              </Btn>
            </div>
            <p className="font-body text-[13px] text-ink-light mt-4">
              Fifteen minutes. No credit pull to start. Just clarity.
            </p>
          </div>
          <a
            href={GOOGLE_REVIEWS}
            target="_blank"
            rel="noopener noreferrer"
            className="group/rev md:justify-self-end md:text-right block"
          >
            <span className="block font-grotesk font-extrabold text-[clamp(26px,2.6vw,40px)] leading-none text-ink group-hover/rev:text-orange transition-colors">
              156
            </span>
            <span className="block font-body text-[0.7rem] tracking-[0.14em] uppercase text-ink-light mt-1.5 leading-[1.8]">
              five-star reviews <span className="text-orange" aria-hidden>★</span>
              <span className="block underline decoration-ink/20 underline-offset-4 group-hover/rev:decoration-orange transition-colors">
                Go read them
              </span>
            </span>
          </a>
        </div>

        {/* NUMBERED LOAN CARDS — staggered rhythm, one B&W (⇄ color) in the mix */}
        <div className="grid md:grid-cols-3 gap-[clamp(14px,1.6vw,24px)] mt-[clamp(40px,5vw,72px)]">
          {CARDS.map((c) => (
            <Link key={c.no} href={c.href} className={`hero-card group block ${c.offset}`}>
              <div className={`font-grotesk font-extrabold text-[13px] ${c.accent}`}>{c.no}</div>
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
