"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PortlandMap from "@/components/PortlandMap";

/**
 * Editorial masthead. Copy carries the design.
 * The only color in view is the vermilion pin on the map.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.15 });
        tl.from(".hero-folio", { opacity: 0, duration: 0.6, ease: "power2.out" })
          .from(
            ".hero-line",
            {
              y: 70,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.11,
            },
            "-=0.3"
          )
          .from(
            ".hero-sub, .hero-actions, .hero-proof",
            {
              y: 24,
              opacity: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1,
            },
            "-=0.35"
          );
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative pt-24 lg:pt-28 pb-16 lg:pb-24">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        {/* masthead folio — set like a journal's front matter */}
        <div className="hero-folio border-y border-paper-200 py-2.5 flex items-baseline justify-between gap-4 mb-12 lg:mb-16">
          <span className="instrument-label !text-paper-600">
            a field guide to portland, oregon
          </span>
          <span className="instrument-label hidden md:inline">
            vol. 01 · 71 neighborhoods · updated weekly
          </span>
          <span className="instrument-label">est. portland</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* language-led column */}
          <div className="lg:col-span-7">
            <h1 className="font-display font-normal text-display-xl text-paper-900 mb-8 lg:mb-10 max-w-[13ch]">
              <span className="hero-line block">We know which</span>
              <span className="hero-line block">blocks flood</span>
              <span className="hero-line block">in November.</span>
            </h1>

            <p className="hero-sub text-body-xl font-body text-paper-600 leading-normal max-w-[46ch] mb-10">
              David &amp; Bri Lindley have learned Portland the slow way — which
              streets back up at 5pm, which schools fill first, where the herons
              are on a Tuesday. The mortgage part? After a decade here, that&apos;s
              the easy part.
            </p>

            <div className="hero-actions flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-paper-900 text-paper-50 rounded-sm text-[0.95rem] font-medium hover:bg-paper-800 transition-colors duration-200"
              >
                Start the conversation
              </Link>
              <Link
                href="/neighborhoods"
                className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-paper-900 underline underline-offset-4 decoration-paper-300 hover:decoration-paper-900 transition-colors duration-200"
              >
                Read the field notes <span aria-hidden>→</span>
              </Link>
            </div>

            <p className="hero-proof instrument !text-paper-500">
              4.85★ across 210 google reviews · nmls #1367416 · licensed or + wa
            </p>
          </div>

          {/* the map moment */}
          <div className="lg:col-span-5">
            <PortlandMap />
          </div>
        </div>
      </div>
    </section>
  );
}
