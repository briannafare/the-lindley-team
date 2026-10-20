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
      gsap.from(".mission-text", {
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".mission-script", {
        scale: 0.92,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-32 text-center border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <p className="mission-text font-display text-[clamp(1.5rem,2.5vw,2.2rem)] font-medium leading-[1.45] text-ink max-w-[850px] mx-auto">
          The Lindley Team connects you with{" "}
          <span className="mission-script font-script font-normal text-orange text-[1.35em] inline-block">
            the right financing
          </span>{" "}
          for your life, not just the lowest rate on a spreadsheet. Movement Mortgage
          underwrites and funds your loan in-house, with a wide range of programs across Oregon, Washington and Arizona.
        </p>
      </div>
    </section>
  );
}
