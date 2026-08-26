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
    <section ref={sectionRef} className="mt-[clamp(76px,9vw,148px)] py-[clamp(60px,7vw,112px)] bg-bg-alt text-center">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px]">
        <div className="max-w-[760px] mx-auto relative">
          <blockquote className="testimonial-quote font-serif text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.45] tracking-[-0.01em] text-ink mb-7">
            &ldquo;This team is amazing. We went through the entire process of buying
            our home with ease. I really appreciated how honest and upfront they
            were with me being a first time home buyer. Even conversations of
            &lsquo;if you were my daughter this is what I would suggest&rsquo; — it put my
            mind at ease. <em className="italic text-orange">The Lindley Team is a must.</em>&rdquo;
          </blockquote>
          <div className="testimonial-attr">
            <p className="text-[14px] text-ink-mid">
              <span className="font-semibold text-ink">Tiffany Z.</span> · First-time buyer · Portland
            </p>
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 font-body text-[14px] font-medium text-ink underline decoration-ink/20 underline-offset-4 hover:text-orange hover:decoration-orange transition-colors"
            >
              Read all 156 on Google →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
