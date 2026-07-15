"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".cta-heading", {
        scale: 1.05,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".cta-script", {
        scale: 0.9,
        duration: 0.6,
        ease: "back.out(1.2)",
        delay: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".cta-btn", {
        y: 20,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.1,
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
    <section ref={sectionRef} className="py-36 text-center bg-yellow relative overflow-hidden">
      {/* Subtle decorative circles */}
      <svg className="absolute top-[10%] right-[10%] w-[200px] h-[200px] opacity-[0.06]" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="90" stroke="#222" strokeWidth="0.75" />
        <circle cx="100" cy="100" r="60" stroke="#222" strokeWidth="0.5" />
      </svg>
      <svg className="absolute bottom-[15%] left-[8%] w-[150px] h-[150px] opacity-[0.05]" viewBox="0 0 150 150" fill="none">
        <circle cx="75" cy="75" r="65" stroke="#EF4434" strokeWidth="0.75" />
      </svg>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2 className="cta-heading font-display text-[clamp(3rem,7vw,6rem)] font-light leading-[0.95] tracking-tight text-ink mb-4">
          Ready to make a
          <br />
          <span className="cta-script font-script font-normal text-[1.1em] text-ink inline-block">
            smart move?
          </span>
        </h2>
        <p className="text-base text-ink-mid font-normal max-w-[440px] mx-auto mb-8 leading-relaxed">
          Whether you&apos;re buying, refinancing, or navigating something
          complex — the conversation starts here.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/apply"
            className="cta-btn px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-medium tracking-[0.04em] uppercase hover:scale-[1.03] hover:shadow-xl transition-all inline-flex items-center gap-2 justify-center"
          >
            Get Pre-Approved <span>→</span>
          </Link>
          <Link
            href="/contact"
            className="cta-btn px-8 py-4 border-[1.5px] border-ink text-ink rounded-full text-[0.78rem] font-medium tracking-[0.04em] uppercase hover:bg-ink hover:text-white transition-all inline-flex items-center gap-2 justify-center"
          >
            Schedule a Call <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
