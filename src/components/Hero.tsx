"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// The Lindley Team's Google Business Profile reviews
const GOOGLE_REVIEWS =
  "https://www.google.com/maps/place/The+Lindley+Team,+Mortgage+Lenders/@45.4103477,-122.7485929,17z/data=!3m1!5s0x549572d77efb8a81:0x63fc125e4a98e43b!4m8!3m7!1s0x54950af83cdf8bdd:0x40316c8aabaf0907!8m2!3d45.4103477!4d-122.7485929!9m1!1b1!16s%2Fg%2F1tj45m7v";

const CARDS = [
  { no: "01", title: "Buy a home", desc: "First place, forever place, or the next one.", href: "/services/purchase", img: "/img/home-buy.webp", bw: false },
  { no: "02", title: "Refinance", desc: "Lower the rate, pull equity, restructure.", href: "/services/refinance", img: "/img/home-refinance.webp", bw: false },
  { no: "03", title: "Divorce lending", desc: "Certified planning through a hard transition.", href: "/services/divorce-lending", img: "/img/home-divorce.webp", bw: false },
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
          .from(".hero-meta", { y: 24, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".hero-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3");
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-paper pt-[clamp(20px,4vh,52px)] pb-[clamp(28px,3vw,44px)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        {/* HERO HEADLINE — serif + italic swash accent */}
        <h1 className="font-serif font-semibold text-ink text-[clamp(52px,10.5vw,168px)] leading-[0.95] tracking-[-0.03em] pb-[0.06em]">
          <span className="hero-line block">Find your place</span>
          <span className="hero-line block">
            <em className="not-italic relative inline-block">
              <span className="font-medium italic text-orange">in</span>
              <svg className="hero-underline absolute -bottom-1 left-0 w-full" height="14" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9 C30 2, 90 2, 118 8" stroke="#EE3B24" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
            </em>{" "}
            Portland.
          </span>
        </h1>

        {/* META ROW */}
        <div className="hero-meta grid md:grid-cols-2 gap-8 md:gap-10 mt-[clamp(30px,4vw,58px)] items-start">
          <p className="max-w-[44ch] text-[clamp(15px,1.15vw,17px)] text-ink-mid leading-relaxed">
            David &amp; Bri read Portland by the neighborhood — the flood years, the school lines,
            the streets that hold their value — then handle the loan that lands you there.
          </p>
          <div className="md:justify-self-end md:text-right font-body text-[0.7rem] tracking-[0.14em] uppercase text-ink-light leading-[2]">
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-ink hover:text-orange transition-colors"
            >
              5.0 &#9733; · 156 Google reviews
              <span className="block text-ink-light">for The Lindley Team</span>
            </a>
            <span className="block mt-1.5">The Lindley Team at Movement Mortgage</span>
            <span className="block">NMLS 1367416 / 265974</span>
            <span className="block">Portland, Oregon — &copy;2026</span>
          </div>
        </div>

        {/* Primary + secondary CTA */}
        <div className="hero-meta flex flex-wrap items-center gap-3 mt-[clamp(22px,3vw,40px)]">
          <Link
            href="/apply"
            className="inline-flex items-center font-body text-[0.8rem] font-bold tracking-[0.08em] uppercase bg-orange text-paper px-6 py-3.5 rounded-[2px] hover:brightness-110 transition"
          >
            Apply now
          </Link>
          <Link
            href="/contact#schedule"
            className="inline-flex items-center gap-2 font-body text-[0.8rem] font-semibold tracking-[0.08em] uppercase border border-ink text-ink px-6 py-3.5 rounded-[2px] hover:bg-ink hover:text-paper transition-colors"
          >
            Schedule a call <span className="text-orange">→</span>
          </Link>
        </div>

        {/* NUMBERED LOAN CARDS — B&W ⇄ color on hover */}
        <div className="grid md:grid-cols-3 gap-[clamp(14px,1.6vw,24px)] mt-[clamp(30px,4vw,56px)]">
          {CARDS.map((c) => (
            <Link key={c.no} href={c.href} className="hero-card group block">
              <div className="font-grotesk font-extrabold text-[13px] text-orange">{c.no}</div>
              <div className="aspect-[4/3] my-2.5 overflow-hidden bg-[#e6e6df]">
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
