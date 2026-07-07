"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Real client words, set editorially. No stars, no cards. */
const QUOTES = [
  {
    quote:
      "We looked at 22 houses over 14 months. The day we saw the one on SE 14th, we wrote the offer that night. Bri called me the next morning to walk through the numbers before I second-guessed myself.",
    author: "Marcus T.",
    context: "Bought in Sellwood-Moreland, 2023",
  },
  {
    quote:
      "I really appreciated how honest and upfront they were with me being a first time home buyer. Even conversations of ‘if you were my daughter this is what I would suggest’ — it put my mind at ease.",
    author: "Tiffany Z.",
    context: "First-time buyer, Portland",
  },
];

export default function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".quote-block", {
          y: 36,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.15,
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
    <section ref={sectionRef} className="py-24 lg:py-32 border-t border-paper-200">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
          {QUOTES.map((q) => (
            <figure key={q.author} className="quote-block">
              <blockquote className="font-display font-normal text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.45] text-paper-900 mb-6">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="instrument !text-paper-500">
                — {q.author.toLowerCase()} · {q.context.toLowerCase()}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="instrument-label mt-14 pt-5 border-t border-paper-200">
          from 210 google reviews · 4.85 average
        </p>
      </div>
    </section>
  );
}
