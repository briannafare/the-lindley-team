"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".mission-text", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 border-y border-paper-200">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <p className="mission-text font-display font-normal text-display-md leading-[1.3] text-paper-900 max-w-[30ch]">
          Most lenders open with a rate sheet. We open with the neighborhood —
          because a good loan on the wrong block is still the wrong house.
        </p>
      </div>
    </section>
  );
}
