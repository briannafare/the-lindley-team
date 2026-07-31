"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Btn from "@/components/Btn";

// Clustered nav (House of Van Schneider pattern): grouped columns, small
// uppercase labels, ✣-marked items. Every SEO page stays reachable.
const GROUPS = [
  {
    label: "Financing",
    items: [
      { name: "Buy a home", href: "/services/purchase" },
      { name: "Refinance", href: "/services/refinance" },
      { name: "Divorce lending", href: "/services/divorce-lending" },
      { name: "First-time buyers", href: "/first-time-buyer" },
      { name: "All loan types", href: "/services" },
    ],
  },
  {
    label: "Portland",
    items: [
      { name: "Neighborhoods", href: "/neighborhoods" },
      { name: "Journal", href: "/blog" },
      { name: "Mortgage Calculator", href: "/calculator" },
    ],
  },
  {
    label: "The team",
    items: [
      { name: "Meet David & Bri", href: "/about" },
      { name: "Schedule a call", href: "/contact#schedule" },
    ],
  },
];

function Cluster({
  onNavigate,
  size = "sm",
}: {
  onNavigate?: () => void;
  size?: "sm" | "lg";
}) {
  const label =
    size === "lg"
      ? "font-body text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-ink-mid mb-3"
      : "font-body text-[0.62rem] tracking-[0.16em] uppercase text-ink-light mb-1.5";
  const item =
    size === "lg"
      ? "font-serif text-[1.7rem] leading-[1.15]"
      : "font-body text-[0.82rem] leading-[1.7] font-medium";
  return (
    <div className={size === "lg" ? "grid gap-8" : "flex gap-9"}>
      {GROUPS.map((g) => (
        <div key={g.label}>
          <span className={`block ${label}`}>{g.label}</span>
          {g.items.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              onClick={onNavigate}
              className={`block ${item} text-ink hover:text-orange transition-colors`}
            >
              <span className="text-cobalt text-[0.72em] mr-1.5 align-middle">✣</span>
              {l.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <nav className="sticky top-0 left-0 right-0 z-50">
      {/* Header row's bg/blur live on this inner wrapper, not <nav> itself —
          backdrop-filter on a positioned ancestor creates a new containing
          block for `fixed` descendants, which was squashing the full-screen
          menu overlay below into the nav bar's own height on open. */}
      <div
        className={`relative z-50 transition-all duration-300 ${
          open
            ? "bg-paper/95 backdrop-blur-xl border-b border-border py-3 shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
            : scrolled
              ? "bg-paper/[0.78] backdrop-blur-xl border-b border-border/70 py-3 shadow-[0_10px_34px_rgba(0,0,0,0.05)]"
              : "border-b border-transparent py-4"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-[54px] flex items-center justify-between gap-2.5 sm:gap-6">
          {/* Brand lockup — the David & Bri / The Lindley Team logo, with
              "@ Movement Mortgage" underneath. sr-only keeps the full name
              in the DOM for SEO/screen readers. */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="z-50 shrink-0 flex flex-col gap-1 sm:gap-1.5 group/brand lg:mr-8 xl:mr-12"
          >
            <span className="sr-only">The Lindley Team at Movement Mortgage — David &amp; Bri</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-lockup.webp"
              alt=""
              width="900"
              height="310"
              className="h-10 sm:h-14 lg:h-16 w-auto transition-transform duration-500 group-hover/brand:scale-[1.02] origin-left"
            />
            <span className="pl-0.5 font-body text-[0.56rem] sm:text-[0.66rem] font-semibold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-ink-mid whitespace-nowrap" aria-hidden>
              <span className="font-serif italic text-orange normal-case tracking-normal text-[1.35em] align-middle mr-0.5">@</span>
              Movement Mortgage
            </span>
          </Link>

          {/* Clustered nav — visible at top on xl, collapses to Menu on scroll */}
          <div className={`hidden ${scrolled ? "xl:hidden" : "xl:block"} pt-1`}>
            <Cluster />
          </div>

          {/* Right controls */}
          <div className="relative z-50 flex items-center gap-2 sm:gap-3 shrink-0 pt-0.5">
            {/* Menu toggle — shown on scroll (xl) and always below xl */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`${scrolled ? "xl:inline-flex" : "xl:hidden"} inline-flex min-h-11 min-w-11 items-center justify-center gap-2 font-body text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-ink hover:text-orange transition-colors`}
            >
              <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
              <span className="relative w-6 h-[14px] flex flex-col justify-between">
                <span className={`w-6 h-[2px] bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`w-6 h-[2px] bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
                <span className={`w-6 h-[2px] bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
              </span>
            </button>

            {/* Apply now — primary money CTA. Bigger pill at lg+, and the
                md base bump also lifts the mobile tap target closer to the
                44px touch guideline. */}
            <Btn
              href="/apply"
              onClick={() => setOpen(false)}
              variant="primary"
              size="md"
              className="max-sm:min-h-11 max-sm:pl-4 max-sm:pr-4 max-sm:py-2.5 max-sm:[&>span:last-child]:hidden"
            >
              Apply now
            </Btn>
          </div>
        </div>
      </div>

      {/* Full menu overlay — mobile + scrolled-desktop */}
      {open && (
        <div id="site-menu" className="fixed inset-0 top-0 bg-paper/95 backdrop-blur-xl pt-24 sm:pt-28 px-5 lg:px-[54px] z-40 overflow-y-auto overscroll-contain">
          <div className="max-w-[1440px] mx-auto">
            <Cluster size="lg" onNavigate={() => setOpen(false)} />
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Btn href="/apply" onClick={() => setOpen(false)} variant="accent" size="lg">
                Apply now
              </Btn>
              <Btn href="/contact#schedule" onClick={() => setOpen(false)} variant="outline" size="lg">
                Schedule a call
              </Btn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
