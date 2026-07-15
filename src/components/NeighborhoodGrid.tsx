"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const neighborhoods = [
  {
    name: "Sellwood-Moreland",
    slug: "sellwood-moreland",
    tags: "Antique Row · Oaks Park · River views",
    gradient: "from-[#ef443433] via-[#F5F1EC] to-[#FAF8F5]",
    svg: (
      <>
        {/* Bridge arches */}
        <path d="M0 180 Q50 80 100 180 Q150 80 200 180 Q250 80 300 180" stroke="#E26125" strokeWidth="1" fill="none" opacity="0.2" />
        <line x1="50" y1="180" x2="50" y2="220" stroke="#E26125" strokeWidth="0.5" opacity="0.15" />
        <line x1="150" y1="180" x2="150" y2="220" stroke="#E26125" strokeWidth="0.5" opacity="0.15" />
        <line x1="250" y1="180" x2="250" y2="220" stroke="#E26125" strokeWidth="0.5" opacity="0.15" />
      </>
    ),
  },
  {
    name: "Alberta Arts",
    slug: "alberta-arts",
    tags: "Galleries · Restaurants · Last Thursday",
    gradient: "from-blue/20 via-[#E8E4F0] to-[#F5F1EC]",
    svg: (
      <>
        {/* Gallery frames */}
        <rect x="30" y="60" width="80" height="60" rx="2" stroke="#3554D9" strokeWidth="1" fill="none" opacity="0.2" />
        <rect x="140" y="40" width="60" height="80" rx="2" stroke="#3554D9" strokeWidth="1" fill="none" opacity="0.15" />
        <rect x="80" y="150" width="100" height="50" rx="2" stroke="#E26125" strokeWidth="0.75" fill="none" opacity="0.12" />
        <rect x="220" y="80" width="50" height="50" rx="2" stroke="#3554D9" strokeWidth="0.75" fill="none" opacity="0.1" />
      </>
    ),
  },
  {
    name: "Pearl District",
    slug: "pearl-district",
    tags: "Powell's Books · First Thursday · Lofts",
    gradient: "from-yellow/15 via-[#F5F1EC] to-[#EDEAE5]",
    svg: (
      <>
        {/* Urban grid / loft motif */}
        <line x1="0" y1="60" x2="300" y2="60" stroke="#222" strokeWidth="0.5" opacity="0.08" />
        <line x1="0" y1="120" x2="300" y2="120" stroke="#222" strokeWidth="0.5" opacity="0.08" />
        <line x1="0" y1="180" x2="300" y2="180" stroke="#222" strokeWidth="0.5" opacity="0.08" />
        <line x1="75" y1="0" x2="75" y2="240" stroke="#222" strokeWidth="0.5" opacity="0.08" />
        <line x1="150" y1="0" x2="150" y2="240" stroke="#222" strokeWidth="0.5" opacity="0.08" />
        <line x1="225" y1="0" x2="225" y2="240" stroke="#222" strokeWidth="0.5" opacity="0.08" />
        {/* Book spines */}
        <rect x="60" y="130" width="8" height="40" rx="1" fill="#E26125" opacity="0.12" />
        <rect x="72" y="125" width="6" height="45" rx="1" fill="#3554D9" opacity="0.1" />
        <rect x="82" y="132" width="7" height="38" rx="1" fill="#222" opacity="0.06" />
      </>
    ),
  },
];

export default function NeighborhoodGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".hood-card", {
        scale: 0.95,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.15,
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
    <section ref={sectionRef} className="py-32 border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {neighborhoods.map((hood) => (
            <Link
              key={hood.slug}
              href={`/neighborhoods/${hood.slug}`}
              className="hood-card group relative overflow-hidden rounded-[2rem] aspect-[3/4] block"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${hood.gradient} transition-all duration-700`} />

              {/* SVG art overlay */}
              <svg
                className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.03]"
                viewBox="0 0 300 400"
                preserveAspectRatio="xMidYMid slice"
              >
                {hood.svg}
              </svg>

              {/* Bottom text overlay */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 z-20">
                <h3 className="font-display text-2xl font-medium text-white mb-1">
                  {hood.name}
                </h3>
                <p className="text-[0.75rem] text-white/60 font-normal">
                  {hood.tags}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
