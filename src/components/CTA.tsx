"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Start the conversation — the final CTA.
 * The second (and last) vermilion moment on the page.
 */
export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cta-el", {
          y: 32,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
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
    <section ref={sectionRef} className="py-28 lg:py-36 border-t border-paper-200 bg-surface">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <h2 className="cta-el font-display font-normal text-display-lg text-paper-900 mb-6 max-w-[18ch]">
              Tell us the neighborhood. We&apos;ll handle the rest.
            </h2>
            <p className="cta-el text-body-lg text-paper-600 max-w-[48ch] mb-10">
              Buying, refinancing, or untangling something complicated — it
              starts with a thirty-minute conversation, not an application.
            </p>
            <div className="cta-el flex flex-col sm:flex-row sm:items-center gap-5">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-vermilion-500 text-white rounded-sm text-[0.95rem] font-medium hover:bg-vermilion-600 active:bg-vermilion-700 transition-colors duration-200"
              >
                Start the conversation
              </a>
              <a
                href="https://mtgxps.mymortgage-online.com/loan-app/?siteId=1878266072&lar=blindley&workFlowId=71729"
                className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-paper-900 underline underline-offset-4 decoration-paper-300 hover:decoration-paper-900 transition-colors duration-200"
              >
                Or apply directly <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div className="cta-el lg:col-span-4">
            <dl className="instrument space-y-3 border-t-2 border-paper-900 pt-5">
              <div className="flex justify-between gap-4">
                <dt className="!text-paper-500">call or text</dt>
                <dd>
                  <a href="tel:9717541771" className="hover:underline underline-offset-4">
                    971.754.1771
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="!text-paper-500">email</dt>
                <dd>
                  <a
                    href="mailto:LindleyTeam@mtgxps.com"
                    className="hover:underline underline-offset-4"
                  >
                    lindleyteam@mtgxps.com
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="!text-paper-500">reply time</dt>
                <dd>same business day</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="!text-paper-500">licensed</dt>
                <dd>or + wa · nmls #1367416</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
