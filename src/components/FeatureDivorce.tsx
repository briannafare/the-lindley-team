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

      gsap.from(".divorce-img", {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
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
              {/* Met membership-band glyphs: ★ ◆ ✣ index marks */}
              {[
                { glyph: "★", val: "CDLP®", label: "One of few in Oregon" },
                { glyph: "◆", val: "Buyout · Refi · Next", label: "The whole knot, handled" },
                { glyph: "✣", val: "OR / WA", label: "Licensed" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-grotesk font-bold text-[clamp(17px,1.5vw,22px)] text-paper">
                    <span className="text-[0.6em] align-middle mr-1.5 text-lime" aria-hidden>{s.glyph}</span>
                    {s.val}
                  </div>
                  <div className="text-[0.68rem] uppercase tracking-[0.1em] text-paper/60 mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bri — the specialist herself. B&W editorial portrait, offset cobalt
              frame. (Swap src for the Higgsfield art piece when it's ready.) */}
          <div className="divorce-img relative max-w-[400px] w-full mx-auto lg:mr-0">
            <div className="absolute inset-0 border border-cobalt translate-x-4 translate-y-4" aria-hidden />
            <div className="relative overflow-hidden bg-ink/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/team/bri-editorial.webp"
                alt="Bri Lindley, Certified Divorce Lending Professional"
                className="img-bw w-full aspect-[4/5] object-cover object-top"
              />
            </div>
            <p className="relative font-body text-[0.68rem] tracking-[0.16em] uppercase text-paper/60 mt-4">
              Bri Lindley · CDLP&reg; <span className="text-lime" aria-hidden>✣</span> Divorce lending
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
