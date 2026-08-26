"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal scroll rail with explicit prev/next arrows so the swipe
 * affordance is obvious on touch. Arrows show only while the rail actually
 * overflows and hide at each end; on desktop the same markup is usually a grid
 * (no overflow) so the arrows never appear. Pass the rail's grid/overflow
 * classes as `className`.
 */
export default function Rail({
  className = "",
  children,
  step = 0.8,
}: {
  className?: string;
  children: React.ReactNode;
  /** Fraction of the visible width to move per arrow tap. */
  step?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [overflows, setOverflows] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 4);
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div ref={ref} className={className}>
        {children}
      </div>

      {overflows && (
        <div className="md:hidden" aria-hidden={false}>
          <Arrow side="left" onClick={() => nudge(-1)} hidden={atStart} />
          <Arrow side="right" onClick={() => nudge(1)} hidden={atEnd} />
        </div>
      )}
    </div>
  );
}

function Arrow({ side, onClick, hidden }: { side: "left" | "right"; onClick: () => void; hidden: boolean }) {
  const left = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? "Scroll left" : "Scroll right"}
      tabIndex={hidden ? -1 : 0}
      className={`absolute top-[38%] z-[3] grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-ink/10 bg-paper/95 text-ink shadow-[0_4px_16px_rgba(10,10,10,0.14)] backdrop-blur-sm transition-opacity duration-200 ${
        left ? "left-1.5" : "right-1.5"
      } ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {left ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
      </svg>
    </button>
  );
}
