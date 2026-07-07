"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { neighborhoods } from "@/lib/neighborhoods";

/**
 * The map moment — a hand-set survey map of Portland.
 * Every dot is a real field note (a neighborhood page).
 * Exactly ONE vermilion mark: the featured entry. That pin is
 * the only accent color in the hero — the cartographer's mark.
 */

type Plot = { slug: string; label: string; x: number; y: number };

// Positions derived from real lon/lat (bounds: -122.79→-122.53, 45.62→45.43)
const PLOTS: Plot[] = [
  { slug: "st-johns", label: "st. johns", x: 80, y: 98 },
  { slug: "kenton", label: "kenton", x: 210, y: 121 },
  { slug: "concordia", label: "concordia", x: 310, y: 183 },
  { slug: "alberta-arts", label: "alberta arts", x: 290, y: 199 },
  { slug: "cully", label: "cully", x: 380, y: 196 },
  { slug: "irvington", label: "irvington", x: 274, y: 251 },
  { slug: "hollywood", label: "hollywood", x: 340, y: 274 },
  { slug: "nob-hill", label: "nob hill", x: 180, y: 297 },
  { slug: "pearl-district", label: "pearl district", x: 214, y: 300 },
  { slug: "laurelhurst", label: "laurelhurst", x: 330, y: 307 },
  { slug: "montavilla", label: "montavilla", x: 420, y: 326 },
  { slug: "buckman", label: "buckman", x: 280, y: 330 },
  { slug: "sunnyside", label: "sunnyside", x: 340, y: 352 },
  { slug: "mount-tabor", label: "mount tabor", x: 380, y: 352 },
  { slug: "richmond", label: "richmond", x: 340, y: 392 },
  { slug: "brooklyn", label: "brooklyn", x: 280, y: 408 },
  { slug: "foster-powell", label: "foster–powell", x: 400, y: 424 },
  { slug: "hillsdale", label: "hillsdale", x: 194, y: 444 },
  { slug: "lents", label: "lents", x: 440, y: 457 },
  { slug: "woodstock", label: "woodstock", x: 350, y: 460 },
  { slug: "eastmoreland", label: "eastmoreland", x: 308, y: 483 },
  { slug: "multnomah-village", label: "multnomah vlg", x: 160, y: 496 },
];

const FEATURED: Plot = {
  slug: "sellwood-moreland",
  label: "sellwood-moreland",
  x: 262,
  y: 505,
};

// Bridge crossings (x, y, rotation) — how Portlanders actually think
const BRIDGES = [
  { x: 38, y: 112, r: 40, name: "st. johns br." },
  { x: 228, y: 282, r: 85, name: "broadway br." },
  { x: 239, y: 349, r: 88, name: "hawthorne br." },
  { x: 247, y: 505, r: 80, name: "sellwood br." },
];

function priceFor(slug: string): string | null {
  const n = neighborhoods.find((h) => h.slug === slug);
  if (!n) return null;
  const p = n.medianHomePrice;
  return p >= 1_000_000
    ? `$${(p / 1_000_000).toFixed(2)}m median`
    : `$${Math.round(p / 1000)}k median`;
}

export default function PortlandMap() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [hovered, setHovered] = useState<Plot | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.5 });
        tl.from(".map-river", {
          strokeDashoffset: 1400,
          duration: 1.8,
          ease: "power2.inOut",
        })
          .from(
            ".map-grid, .map-marginalia",
            { opacity: 0, duration: 0.8, ease: "power2.out" },
            "-=1.2"
          )
          .from(
            ".map-dot",
            {
              scale: 0,
              transformOrigin: "center center",
              duration: 0.4,
              ease: "power3.out",
              stagger: 0.035,
            },
            "-=0.9"
          )
          .from(
            ".map-pin",
            {
              y: -14,
              opacity: 0,
              duration: 0.55,
              ease: "back.out(2)",
            },
            "-=0.1"
          )
          .from(
            ".map-pin-label",
            { opacity: 0, duration: 0.4, ease: "power2.out" },
            "-=0.2"
          );
      });
      return () => mm.revert();
    },
    { scope: wrapRef }
  );

  const tooltip = hovered ?? null;
  const tooltipPrice = tooltip ? priceFor(tooltip.slug) : null;

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative border border-paper-200 rounded-md bg-surface shadow-sm overflow-hidden">
        <svg
          viewBox="0 0 520 620"
          className="w-full h-auto block"
          role="img"
          aria-label="Survey map of Portland neighborhoods. Each mark links to a field note."
        >
          {/* graticule */}
          <g className="map-grid" stroke="var(--paper-200)" strokeWidth="0.5" opacity="0.55">
            {[104, 208, 312, 416].map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="620" />
            ))}
            {[124, 248, 372, 496].map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="520" y2={y} />
            ))}
          </g>

          {/* Columbia */}
          <path
            d="M 520 112 C 430 84 340 60 240 32 C 200 21 170 12 140 0"
            fill="none"
            stroke="var(--paper-200)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Willamette */}
          <path
            className="map-river"
            d="M 250 620 C 249 580 248 545 248 509 C 248 478 241 452 240 424 C 239 398 238 372 238 349 C 238 332 241 315 242 303 C 243 288 230 272 220 261 C 196 234 165 202 140 180 C 110 153 75 132 50 114 C 38 105 28 80 20 60"
            fill="none"
            stroke="var(--paper-200)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeDasharray="1400"
            strokeDashoffset="0"
          />
          <text
            x="252"
            y="415"
            className="map-marginalia"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="0.12em"
            fill="var(--paper-400)"
            transform="rotate(87 252 415)"
          >
            willamette
          </text>
          <text
            x="378"
            y="52"
            className="map-marginalia"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="0.12em"
            fill="var(--paper-400)"
            transform="rotate(-16 378 52)"
          >
            columbia
          </text>

          {/* bridges */}
          <g className="map-marginalia" stroke="var(--paper-400)" strokeWidth="1.25">
            {BRIDGES.map((b) => (
              <line
                key={b.name}
                x1={-9}
                y1={0}
                x2={9}
                y2={0}
                transform={`translate(${b.x} ${b.y}) rotate(${b.r})`}
              />
            ))}
          </g>

          {/* compass + scale */}
          <g className="map-marginalia">
            <g transform="translate(478, 550)">
              <line x1="0" y1="16" x2="0" y2="-10" stroke="var(--paper-500)" strokeWidth="1" />
              <path d="M 0 -10 L -3.5 -2 L 3.5 -2 Z" fill="var(--paper-500)" />
              <text
                x="0"
                y="32"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="10"
                fill="var(--paper-500)"
              >
                n
              </text>
            </g>
            <g transform="translate(28, 588)">
              <line x1="0" y1="0" x2="72" y2="0" stroke="var(--paper-500)" strokeWidth="1" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="var(--paper-500)" strokeWidth="1" />
              <line x1="72" y1="-3" x2="72" y2="3" stroke="var(--paper-500)" strokeWidth="1" />
              <text
                x="80"
                y="3"
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="0.08em"
                fill="var(--paper-500)"
              >
                2 mi
              </text>
            </g>
          </g>

          {/* neighborhood marks — every one is a real field note */}
          {PLOTS.map((p) => (
            <g
              key={p.slug}
              className="cursor-pointer"
              onMouseEnter={() => setHovered(p)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => router.push(`/neighborhoods/${p.slug}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter") router.push(`/neighborhoods/${p.slug}`);
              }}
              tabIndex={0}
              role="link"
              aria-label={`${p.label} field note`}
            >
              {/* generous hit area */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
              <circle
                className="map-dot transition-all duration-200"
                cx={p.x}
                cy={p.y}
                r={hovered?.slug === p.slug ? 5 : 3.25}
                fill={hovered?.slug === p.slug ? "var(--paper-900)" : "var(--paper-700)"}
              />
            </g>
          ))}

          {/* THE pin — the only vermilion in the hero */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setHovered(FEATURED)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => router.push(`/neighborhoods/${FEATURED.slug}`)}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push(`/neighborhoods/${FEATURED.slug}`);
            }}
            tabIndex={0}
            role="link"
            aria-label="Sellwood-Moreland — featured field note"
          >
            <circle cx={FEATURED.x} cy={FEATURED.y} r="16" fill="transparent" />
            <circle
              className="pin-pulse"
              cx={FEATURED.x}
              cy={FEATURED.y}
              r="7"
              fill="none"
              stroke="var(--vermilion-500)"
              strokeWidth="1.5"
            />
            <circle
              className="map-pin"
              cx={FEATURED.x}
              cy={FEATURED.y}
              r="5"
              fill="var(--vermilion-500)"
            />
            <g className="map-pin-label">
              <line
                x1={FEATURED.x + 8}
                y1={FEATURED.y}
                x2={FEATURED.x + 26}
                y2={FEATURED.y}
                stroke="var(--paper-400)"
                strokeWidth="0.75"
              />
              <text
                x={FEATURED.x + 31}
                y={FEATURED.y - 2}
                fontFamily="var(--font-mono)"
                fontSize="10.5"
                letterSpacing="0.06em"
                fill="var(--paper-900)"
              >
                sellwood-moreland
              </text>
              <text
                x={FEATURED.x + 31}
                y={FEATURED.y + 11}
                fontFamily="var(--font-mono)"
                fontSize="9"
                letterSpacing="0.06em"
                fill="var(--paper-500)"
              >
                field note no. 01
              </text>
            </g>
          </g>
        </svg>

        {/* hover readout */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(tooltip.x / 520) * 100}%`,
              top: `${(tooltip.y / 620) * 100 - 2.5}%`,
            }}
          >
            <div className="bg-paper-900 text-paper-50 rounded-sm px-3 py-2 shadow-md whitespace-nowrap">
              <div className="instrument !text-paper-50">{tooltip.label}</div>
              {tooltipPrice && (
                <div className="instrument-label !text-paper-300">{tooltipPrice}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* figure caption */}
      <div className="flex items-baseline justify-between mt-3">
        <span className="instrument-label">
          fig. 01 — portland, or. · 71 neighborhoods surveyed, 23 plotted
        </span>
        <span className="instrument-label hidden sm:inline">
          45.52° n / 122.68° w
        </span>
      </div>
    </div>
  );
}
