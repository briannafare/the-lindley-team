"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GOOGLE_REVIEWS } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

export default function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".testimonial-quote", {
        y: 40,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.from(".testimonial-attr", {
        y: 20,
        duration: 0.5,
        ease: "power3.out",
        delay: 0.3,
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
    <section ref={sectionRef} className="mt-[clamp(56px,8vw,120px)] py-[clamp(48px,6vw,96px)] bg-bg-alt text-center">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        <p className="text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-ink-mid mb-10 flex items-center justify-center gap-2">
          <span className="text-orange" aria-hidden>★★★★★</span> From the 156
        </p>
        <div className="max-w-[760px] mx-auto relative">
          {/* Decorative quotation mark — cobalt, Met-poster style */}
          <svg
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 opacity-[0.08]"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden
          >
            <path
              d="M14 40 C14 32 18 24 28 20 L26 16 C14 20 6 30 6 42 C6 50 12 54 18 54 C24 54 28 50 28 44 C28 38 24 40 14 40 Z M42 40 C42 32 46 24 56 20 L54 16 C42 20 34 30 34 42 C34 50 40 54 46 54 C52 54 56 50 56 44 C56 38 52 40 42 40 Z"
              fill="#3554D9"
            />
          </svg>

          <div className="w-10 h-1 bg-lime mx-auto mb-8" />
          <blockquote className="testimonial-quote font-serif text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.45] tracking-[-0.01em] text-ink mb-7">
            &ldquo;This team is amazing. We went through the entire process of buying
            our home with ease. I really appreciated how honest and upfront they
            were with me being a first time home buyer. Even conversations of
            &lsquo;if you were my daughter this is what I would suggest&rsquo; — it put my
            mind at ease. <em className="italic text-orange">The Lindley Team is a must.</em>&rdquo;
          </blockquote>
          <div className="testimonial-attr">
            <p className="text-sm font-semibold text-ink">Tiffany Z.</p>
            <p className="text-[0.72rem] text-ink-mid font-medium mt-0.5 uppercase tracking-[0.1em]">
              First-time buyer · Portland
            </p>
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 font-body text-[12px] tracking-[0.1em] uppercase font-semibold text-ink border-b border-ink/30 pb-0.5 hover:text-orange hover:border-orange transition-colors"
            >
              Read all 156 on Google →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
