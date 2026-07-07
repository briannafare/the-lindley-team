"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The index — ten ways to finance a Portland address,
 * set like a field guide's table of contents.
 */
const services = [
  { num: "01", name: "Purchase", href: "/services/purchase", desc: "First home, forever home, or the next one. Structured around your goals." },
  { num: "02", name: "Refinance", href: "/services/refinance", desc: "Lower the rate, shorten the term — only when the math actually works." },
  { num: "03", name: "Divorce Lending", href: "/services/divorce-lending", desc: "CDLP-certified. Equity buyouts and mortgage planning through separation." },
  { num: "04", name: "FHA Loans", href: "/services/fha", desc: "Lower down payments, flexible credit. Built for first-time buyers." },
  { num: "05", name: "VA Loans", href: "/services/va", desc: "Zero down, no PMI. The benefit you earned — used right." },
  { num: "06", name: "Jumbo Loans", href: "/services/jumbo", desc: "Above conforming limits, for Portland's premium properties." },
  { num: "07", name: "Cash-Out Refinance", href: "/services/cash-out", desc: "Turn equity into capital. Consolidate, renovate, or invest." },
  { num: "08", name: "HELOC", href: "/services/heloc", desc: "A flexible line on your equity. Draw what you need, when you need it." },
  { num: "09", name: "Investment Property", href: "/services/investment", desc: "Build wealth through Portland real estate." },
  { num: "10", name: "Reverse Mortgage", href: "/services/reverse-mortgage", desc: "Access equity without monthly payments. For homeowners 62+." },
];

export default function ServicesList() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".svc-row", {
          y: 24,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-6 mb-14">
          <h2 className="font-display font-normal text-display-lg text-paper-900">
            The index
          </h2>
          <span className="instrument-label">ten ways to finance an address</span>
        </div>

        <div className="border-t border-paper-200">
          {services.map((svc) => (
            <Link
              key={svc.num}
              href={svc.href}
              className="svc-row group grid grid-cols-[3rem_1fr] sm:grid-cols-[3.5rem_minmax(0,18rem)_1fr_auto] gap-x-4 items-baseline py-6 border-b border-paper-200 hover:bg-surface transition-colors duration-200"
            >
              <span className="instrument !text-paper-400">{svc.num}</span>
              <span className="font-display text-[1.35rem] leading-snug text-paper-900 group-hover:underline underline-offset-4 decoration-paper-300">
                {svc.name}
              </span>
              <span className="hidden sm:block text-[0.95rem] text-paper-600 leading-relaxed col-span-1 pr-6">
                {svc.desc}
              </span>
              <span
                className="hidden sm:block text-paper-400 group-hover:text-paper-900 group-hover:translate-x-1 transition-all duration-200"
                aria-hidden
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
