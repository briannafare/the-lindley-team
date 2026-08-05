"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Rail from "@/components/Rail";

const PATHWAYS = [
  {
    title: "Buy a home",
    desc: "First one, next one, or the one you'll actually stay in.",
    href: "/services/purchase",
    img: "/img/home-buy.webp",
    treatment: "",
    offset: "",
  },
  {
    title: "Refinance",
    desc: "Lower the payment, pull cash out, drop the PMI.",
    href: "/services/refinance",
    img: "/img/home-refinance.webp",
    treatment: "img-bw",
    offset: "md:mt-10",
  },
  {
    title: "Divorce lending",
    desc: "Untangle the house from the divorce — cleanly.",
    href: "/services/divorce-lending",
    img: "/img/home-divorce.webp",
    treatment: "",
    offset: "md:mt-4",
  },
];

/**
 * Touch devices have no hover, so the desktop card motion (image zoom, color
 * shift) would never play. Instead, mark a card "active" while it sits in the
 * vertical center of the viewport — the hover effect becomes a scroll effect.
 * Desktop keeps real :hover (observer is disabled where hover is supported).
 * Reduced-motion users get neither.
 */
function useActiveOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const touch = window.matchMedia("(hover: none)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touch || reduce) return;

    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // Shrink the root to a thin band across the middle of the screen, so a
      // card counts as "in view" only while it's roughly centered.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, active };
}

function PathwayCard({ path }: { path: (typeof PATHWAYS)[number] }) {
  const { ref, active } = useActiveOnScroll<HTMLAnchorElement>();

  return (
    <Link
      ref={ref}
      href={path.href}
      data-active={active}
      className={`group block min-w-0 snap-start ${path.offset}`}
    >
      <div className="border border-ink/10 bg-paper p-2">
        <div className="aspect-[4/3] overflow-hidden bg-bg-alt">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={path.img}
            alt=""
            width="1024"
            height="768"
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover saturate-[0.9] contrast-[1.03] transition-all duration-700 group-hover:scale-[1.025] group-data-[active=true]:scale-[1.025] ${path.treatment}`}
          />
        </div>
      </div>
      <div className="flex items-start justify-between gap-5 mt-6">
        <div>
          <h3 className="font-grotesk font-bold text-[clamp(22px,2vw,30px)] leading-none tracking-[-0.02em] transition-colors group-hover:text-orange group-data-[active=true]:text-orange">
            {path.title}
          </h3>
          <p className="text-[14px] text-ink-light leading-relaxed mt-2 max-w-[34ch]">{path.desc}</p>
        </div>
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors group-hover:bg-ink group-hover:text-paper group-data-[active=true]:bg-ink group-data-[active=true]:text-paper"
          aria-hidden
        >
          →
        </span>
      </div>
    </Link>
  );
}

/**
 * Three independent pathways — not steps. All three remain visible on mobile,
 * with generous separation from the hero narrative above.
 */
export default function HeroPathways() {
  return (
    <div className="mt-[clamp(96px,12vw,176px)] border-t border-ink pt-5 sm:pt-6">
      <h2 className="font-serif font-semibold text-[clamp(30px,4vw,56px)] leading-[0.98] tracking-[-0.025em]">
        Start with what you need.
      </h2>

      <Rail className="mobile-rail -mx-5 grid grid-flow-col auto-cols-[80%] overflow-x-auto snap-x snap-mandatory scroll-pl-5 px-5 pb-2 sm:auto-cols-[42%] md:mx-0 md:grid-flow-row md:auto-cols-auto md:grid-cols-3 md:overflow-visible md:scroll-pl-0 md:px-0 md:pb-0 gap-5 lg:gap-7 mt-[clamp(40px,5vw,68px)]">
        {PATHWAYS.map((path) => (
          <PathwayCard key={path.title} path={path} />
        ))}
      </Rail>
    </div>
  );
}
