"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const CARDS = [
  { no: "01", title: "Buy a home", desc: "First place, forever place, or the next one.", href: "/services/purchase", img: "https://picsum.photos/seed/lt-buy/640/480", bw: false },
  { no: "02", title: "Refinance", desc: "Lower the rate, pull equity, restructure.", href: "/services/refinance", img: "https://picsum.photos/seed/lt-refi/640/480", bw: true },
  { no: "03", title: "Divorce lending", desc: "Certified planning through a hard transition.", href: "/services/divorce-lending", img: "https://picsum.photos/seed/lt-divorce/640/480", bw: false },
];

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
        tl.from(".hero-line", { yPercent: 115, duration: 0.9, stagger: 0.1 })
          .from(".hero-underline", { scaleX: 0, transformOrigin: "left center", duration: 0.6 }, "-=0.4")
          .from(".hero-meta", { y: 24, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".hero-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.3");
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="bg-paper pt-[clamp(120px,15vh,180px)] pb-[clamp(28px,3vw,44px)]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        {/* HERO HEADLINE — serif + italic swash accent */}
        <h1 className="font-serif font-semibold text-ink text-[clamp(52px,10.5vw,168px)] leading-[0.9] tracking-[-0.03em]">
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]"><span className="hero-line block">Find your place</span></span>
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <span className="hero-line block">
              <em className="not-italic relative inline-block">
                <span className="font-medium italic text-orange">in</span>
                <svg className="hero-underline absolute -bottom-2 left-0 w-full" height="14" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 9 C30 2, 90 2, 118 8" stroke="#DF6E56" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </em>{" "}
              Portland.
            </span>
          </span>
        </h1>

        {/* META ROW */}
        <div className="hero-meta grid md:grid-cols-2 gap-8 md:gap-10 mt-[clamp(30px,4vw,58px)] items-start">
          <p className="max-w-[44ch] text-[clamp(15px,1.15vw,17px)] text-ink-mid leading-relaxed">
            David &amp; Bri read Portland by the neighborhood — the flood years, the school lines,
            the streets that hold their value — then handle the loan that lands you there.
          </p>
          <div className="md:justify-self-end md:text-right font-body text-[0.7rem] tracking-[0.14em] uppercase text-ink-light leading-[2]">
            <span className="block">4.85 &#9733; across 210 reviews</span>
            <span className="block">Movement Mortgage · NMLS 1367416 / 265974</span>
            <span className="block">Portland, Oregon — &copy;2026</span>
          </div>
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
