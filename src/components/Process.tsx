"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** The route — four legs, no detours. */
const STEPS = [
  {
    num: "01",
    title: "Discovery call",
    desc: "Thirty minutes on your goals, timeline, and financial picture. No commitment, no pressure.",
  },
  {
    num: "02",
    title: "Pre-approval",
    desc: "Credit pulled, income verified, letter in hand within 24–48 hours. Sellers take you seriously.",
  },
  {
    num: "03",
    title: "Loan selection",
    desc: "Under contract, we compare products and recommend the structure that fits your goals — not the rate sheet.",
  },
  {
    num: "04",
    title: "Close & keys",
    desc: "We run the paperwork, coordinate agent and title, and get you to the table on time.",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".step-item", {
          y: 28,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 border-t border-paper-200 bg-surface">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-6 mb-14">
          <h2 className="font-display font-normal text-display-lg text-paper-900">
            The route
          </h2>
          <span className="instrument-label">pre-approval in 24–48 hours</span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 border-t border-paper-200 pt-10">
          {STEPS.map((s) => (
            <li key={s.num} className="step-item">
              <div className="instrument !text-paper-400 mb-4">{s.num}</div>
              <h3 className="font-display font-normal text-[1.35rem] text-paper-900 mb-3">
                {s.title}
              </h3>
              <p className="text-[0.95rem] leading-[1.7] text-paper-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
