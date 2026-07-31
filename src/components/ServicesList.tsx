"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01", name: "Purchase", href: "/services/purchase",
    desc: "First home, forever home, or investment. Financing structured around your goals.",
    tag: "Most Popular",
    shape: <circle cx="24" cy="24" r="22" stroke="#EF4434" strokeWidth="1.5" fill="none" />,
  },
  {
    num: "02", name: "Refinance", href: "/services/refinance",
    desc: "Lower your rate, shorten your term, or access built equity.",
    shape: <rect x="4" y="4" width="40" height="40" rx="4" stroke="#3554D9" strokeWidth="1.5" fill="none" />,
  },
  {
    num: "03", name: "Divorce Lending", href: "/services/divorce-lending",
    desc: "CDLP®-certified. Equity buyouts and mortgage planning through separation.",
    tag: "Specialist",
    shape: <polygon points="24,2 46,38 2,38" stroke="#EF4434" strokeWidth="1.5" fill="none" />,
  },
  {
    num: "04", name: "FHA Loans", href: "/services/fha",
    desc: "Lower down payments. Flexible credit. Built for first-time buyers.",
    shape: <path d="M24 2 L30 18 L46 18 L33 28 L38 46 L24 35 L10 46 L15 28 L2 18 L18 18 Z" stroke="#3554D9" strokeWidth="1.5" fill="none" />,
  },
  {
    num: "05", name: "VA Loans", href: "/services/va",
    desc: "Zero down, no PMI. The benefit you earned — used right.",
    shape: <><circle cx="24" cy="24" r="10" stroke="#EF4434" strokeWidth="1.5" fill="none" /><circle cx="24" cy="24" r="22" stroke="#EF4434" strokeWidth="1.5" fill="none" strokeDasharray="4 4" /></>,
  },
  {
    num: "06", name: "Jumbo Loans", href: "/services/jumbo",
    desc: "Above conforming limits for Portland's premium properties.",
    shape: <rect x="2" y="2" width="44" height="44" rx="22" stroke="#3554D9" strokeWidth="1.5" fill="none" />,
  },
  {
    num: "07", name: "Cash-Out Refinance", href: "/services/cash-out",
    desc: "Turn home equity into capital. Consolidate, renovate, or invest.",
    shape: <polygon points="24,2 44,14 44,34 24,46 4,34 4,14" stroke="#EF4434" strokeWidth="1.5" fill="none" />,
  },
  {
    num: "08", name: "HELOC", href: "/services/heloc",
    desc: "Flexible credit line. Draw what you need, when you need it.",
    shape: <ellipse cx="24" cy="24" rx="22" ry="14" stroke="#3554D9" strokeWidth="1.5" fill="none" />,
  },
  {
    num: "09", name: "Investment Property", href: "/services/investment",
    desc: "Build wealth through Portland real estate.",
    shape: <rect x="8" y="8" width="32" height="32" stroke="#EF4434" strokeWidth="1.5" fill="none" transform="rotate(45 24 24)" />,
  },
  {
    num: "10", name: "Reverse Mortgage", href: "/services/reverse-mortgage",
    desc: "Access your home's equity without monthly payments. 62+.",
    shape: <><circle cx="24" cy="24" r="22" stroke="#3554D9" strokeWidth="1.5" fill="none" /><line x1="2" y1="24" x2="46" y2="24" stroke="#3554D9" strokeWidth="1.5" /></>,
  },
];

export default function ServicesList() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".svc-row", {
        y: 30,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap justify-between items-end mb-9 sm:mb-12 gap-6">
          <div>
            <p className="text-[0.68rem] font-medium tracking-[0.2em] uppercase text-ink-light mb-2">
              Services
            </p>
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.5rem)] font-light leading-tight tracking-tight">
              What We{" "}
              <span className="font-script font-normal text-orange text-[1.15em]">
                Do
              </span>
            </h2>
          </div>
          <Link
            href="/services"
            className="px-6 py-3 border-[1.5px] border-ink text-ink rounded-full text-[0.78rem] font-medium tracking-[0.04em] uppercase hover:bg-ink hover:text-white transition-all inline-flex items-center gap-2"
          >
            View All <span>→</span>
          </Link>
        </div>

        <div className="flex flex-col">
          {services.map((svc) => (
            <Link
              key={svc.num}
              href={svc.href}
              className="svc-row group grid grid-cols-[1fr_auto] sm:grid-cols-[44px_1fr_auto] lg:grid-cols-[60px_1fr_50px] gap-3 sm:gap-4 items-center py-5 sm:py-6 border-b border-border hover:translate-x-1 transition-transform"
            >
              <span className="font-display text-sm font-medium text-ink-light hidden sm:block">
                {svc.num}
              </span>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-normal group-hover:text-orange transition-colors">
                  {svc.name}
                </span>
                <span className="text-[0.82rem] text-ink-light font-normal max-w-[320px] leading-snug hidden md:inline">
                  {svc.desc}
                </span>
                {svc.tag && (
                  <span
                    className={
                      svc.tag === "Specialist"
                        ? "text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-ink bg-lime rounded-full px-2.5 py-0.5"
                        : "text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-ink bg-orange rounded-full px-2.5 py-0.5"
                    }
                  >
                    {svc.tag}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex w-[50px] h-[50px] items-center justify-center">
                <svg
                  viewBox="0 0 48 48"
                  className="w-10 h-10 transition-transform duration-500 group-hover:rotate-[20deg] group-hover:scale-110"
                >
                  {svc.shape}
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
