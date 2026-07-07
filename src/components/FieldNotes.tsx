"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { neighborhoods } from "@/lib/neighborhoods";

gsap.registerPlugin(ScrollTrigger);

/**
 * Three sample entries from the field guide — real prose,
 * real instrument data, pulled straight from the notes.
 */
const FEATURED_SLUGS = ["sellwood-moreland", "alberta-arts", "st-johns"];

function firstSentence(text: string): string {
  const idx = text.indexOf(". ");
  return idx === -1 ? text : text.slice(0, idx + 1);
}

function fmtPrice(p: number): string {
  return p >= 1_000_000
    ? `$${(p / 1_000_000).toFixed(2)}m`
    : `$${Math.round(p / 1000)}k`;
}

export default function FieldNotes() {
  const sectionRef = useRef<HTMLElement>(null);
  const entries = FEATURED_SLUGS.map((slug) =>
    neighborhoods.find((n) => n.slug === slug)
  ).filter((n): n is NonNullable<typeof n> => Boolean(n));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".note-entry", {
          y: 32,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
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
            From the field notes
          </h2>
          <Link
            href="/neighborhoods"
            className="text-[0.95rem] font-medium text-paper-900 underline underline-offset-4 decoration-paper-300 hover:decoration-paper-900 transition-colors duration-200"
          >
            All 71 neighborhoods <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-12">
          {entries.map((n, i) => (
            <Link
              key={n.slug}
              href={`/neighborhoods/${n.slug}`}
              className="note-entry group block border-t-2 border-paper-900 pt-6"
            >
              <div className="instrument-label mb-4">
                no. {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display font-normal text-display-sm text-paper-900 mb-3 group-hover:underline underline-offset-4 decoration-paper-300">
                {n.name}
              </h3>
              <p className="text-[0.98rem] leading-[1.75] text-paper-600 mb-6">
                {firstSentence(n.description[0])}
              </p>
              <dl className="instrument space-y-1.5 border-t border-paper-200 pt-4">
                <div className="flex justify-between gap-4">
                  <dt className="!text-paper-500">walk score</dt>
                  <dd>{n.walkScore}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="!text-paper-500">median</dt>
                  <dd>{fmtPrice(n.medianHomePrice)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="!text-paper-500">district</dt>
                  <dd className="text-right">{n.schoolDistrict.replace(" Schools", "")}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
