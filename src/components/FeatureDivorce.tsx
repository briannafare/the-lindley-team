"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Btn from "@/components/Btn";

gsap.registerPlugin(ScrollTrigger);

export default function FeatureDivorce() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".divorce-text > *", {
        y: 40,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".divorce-svg path, .divorce-svg circle, .divorce-svg line", {
        strokeDashoffset: 600,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.15,
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
    <section ref={sectionRef} className="mt-[clamp(56px,8vw,120px)] py-[clamp(56px,7vw,110px)] bg-ink text-paper overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="divorce-text">
            <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-paper/60 mb-4 flex items-center gap-2">
              <span className="text-lime" aria-hidden>✣</span> The specialty · CDLP&reg;
            </p>
            <h2 className="font-serif font-semibold text-[clamp(32px,4.6vw,64px)] leading-[0.98] tracking-[-0.02em] mb-6">
              The house doesn&rsquo;t have to be a{" "}
              <em className="italic font-medium text-orange">casualty.</em>
            </h2>
            <p className="text-[clamp(15px,1.15vw,17px)] leading-relaxed text-paper/75 mb-9 max-w-[46ch]">
              When a divorce has a mortgage caught in the middle, Bri is the one attorneys
              call. She&rsquo;s a Certified Divorce Lending Professional (CDLP&reg;) — one of the few
              in Oregon — and she works the whole knot: the buyout, the refinance, and a
              clear read on what each of you can afford next.
            </p>
            <Btn href="/services/divorce-lending" variant="paper" size="lg">
              How divorce lending works
            </Btn>
            <div className="flex flex-wrap gap-x-10 gap-y-5 mt-10 pt-6 border-t border-paper/10">
              {[
                { val: "CDLP®", label: "One of few in Oregon" },
                { val: "Buyout · Refi · Next", label: "The whole knot, handled" },
                { val: "OR / WA", label: "Licensed" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-grotesk font-bold text-[clamp(17px,1.5vw,22px)] text-lime">
                    {s.val}
                  </div>
                  <div className="text-[0.68rem] uppercase tracking-[0.1em] text-paper/60 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abstract SVG composition — house/division motif */}
          <div className="flex items-center justify-center">
            <svg
              className="divorce-svg w-full max-w-[420px] h-auto"
              viewBox="0 0 420 320"
              fill="none"
            >
              {/* Concentric circles */}
              <circle cx="210" cy="160" r="140" stroke="#E26125" strokeWidth="0.75" opacity="0.15" strokeDasharray="880" />
              <circle cx="210" cy="160" r="100" stroke="#3554D9" strokeWidth="0.5" opacity="0.1" strokeDasharray="630" />
              <circle cx="210" cy="160" r="60" stroke="#E26125" strokeWidth="0.5" opacity="0.08" strokeDasharray="377" />

              {/* Abstract house/roof */}
              <path
                d="M130 200 L210 100 L290 200"
                stroke="#E26125"
                strokeWidth="1.5"
                strokeDasharray="300"
              />
              <path
                d="M150 200 L150 270 L270 270 L270 200"
                stroke="white"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="280"
              />

              {/* Split line — representing division */}
              <line
                x1="210"
                y1="100"
                x2="210"
                y2="290"
                stroke="#F2FF91"
                strokeWidth="1"
                opacity="0.25"
                strokeDasharray="4 6"
              />

              {/* Door divided */}
              <path
                d="M190 270 L190 230 L210 230"
                stroke="white"
                strokeWidth="0.75"
                opacity="0.2"
                strokeDasharray="80"
              />
              <path
                d="M230 270 L230 230 L210 230"
                stroke="white"
                strokeWidth="0.75"
                opacity="0.2"
                strokeDasharray="80"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
