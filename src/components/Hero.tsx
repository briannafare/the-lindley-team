"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Btn from "@/components/Btn";
import { GOOGLE_REVIEWS } from "@/lib/links";

// Editorial B&W ⇄ color on hover (Met treatment) — accents alternate orange/cobalt.
const CARDS = [
  { no: "01", accent: "text-orange", title: "Buy a home", desc: "First one, next one, or the one you'll actually stay in.", href: "/services/purchase", img: "/img/home-buy.webp" },
  { no: "02", accent: "text-cobalt", title: "Refinance", desc: "Lower the payment, pull cash out, drop the PMI.", href: "/services/refinance", img: "/img/home-refinance.webp" },
  { no: "03", accent: "text-orange", title: "Divorce lending", desc: "Untangle the house from the divorce — cleanly.", href: "/services/divorce-lending", img: "/img/home-divorce.webp" },
];

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
        tl.from(".hero-eyebrow", { y: 18, opacity: 0, duration: 0.5 })
          .from(".hero-line", { y: 46, opacity: 0, duration: 0.85, stagger: 0.1 }, "-=0.25")
          .from(".hero-underline", { scaleX: 0, transformOrigin: "left center", duration: 0.6 }, "-=0.4")
          .from(".hero-meta", { y: 24, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".hero-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3");
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-paper pt-[clamp(20px,4vh,52px)] pb-[clamp(28px,3vw,44px)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        {/* BRAND EYEBROW — the Lindley name leads the page, not Movement */}
        <p className="hero-eyebrow font-body text-[0.68rem] sm:text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-ink-mid mb-[clamp(14px,2vw,26px)] flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span className="text-cobalt" aria-hidden>✣</span>
          The Lindley Team
          <span className="text-cobalt" aria-hidden>·</span>
          Portland mortgage lenders
          <span className="text-cobalt" aria-hidden>·</span>
          Est. by Tammi Lindley
        </p>

        {/* HERO HEADLINE — serif + italic swash accent */}
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

        {/* META ROW */}
        <div className="hero-meta grid md:grid-cols-2 gap-8 md:gap-10 mt-[clamp(30px,4vw,58px)] items-start">
          <p className="max-w-[48ch] text-[clamp(15px,1.15vw,17px)] text-ink-mid leading-relaxed">
            So we made ours the easy part. We&rsquo;ve spent 35 years on Portland mortgages, so almost
            nothing surprises us anymore. Show us what you&rsquo;re working with and you&rsquo;ll know exactly
            where you stand — usually the same day you ask.
          </p>
          <div className="md:justify-self-end md:text-right font-body text-[0.7rem] tracking-[0.14em] uppercase text-ink-light leading-[2]">
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-ink hover:text-orange transition-colors"
            >
              <span className="text-orange" aria-hidden>★★★★★</span> 156 five-star reviews
              <span className="block text-ink-light">Go read them.</span>
            </a>
            <span className="block mt-1.5">The Lindley Team at Movement Mortgage</span>
            <span className="block">NMLS 265974 / 1367416</span>
            <span className="block">Portland, Oregon — &copy;2026</span>
          </div>
        </div>

        {/* Primary + secondary CTA */}
        <div className="hero-meta flex flex-wrap items-center gap-3 mt-[clamp(22px,3vw,40px)]">
          <Btn href="/apply" variant="accent" size="lg">
            See what you qualify for
          </Btn>
          <Btn href="/contact#schedule" variant="outline" size="lg">
            Ask us anything
          </Btn>
        </div>

        {/* NUMBERED LOAN CARDS — B&W ⇄ color on hover */}
        <div className="grid md:grid-cols-3 gap-[clamp(14px,1.6vw,24px)] mt-[clamp(30px,4vw,56px)]">
          {CARDS.map((c) => (
            <Link key={c.no} href={c.href} className="hero-card group block">
              <div className={`font-grotesk font-extrabold text-[13px] ${c.accent}`}>{c.no}</div>
              <div className="aspect-[4/3] my-2.5 overflow-hidden bg-[#e6e6df]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt=""
                  className="img-bw w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04]"
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
