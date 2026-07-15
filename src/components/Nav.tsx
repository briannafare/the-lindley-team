"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
      { name: "Calculator", href: "/calculator" },
    ],
  },
  {
    label: "The team",
    items: [
      { name: "Meet David & Bri", href: "/about" },
      { name: "Our story", href: "/about" },
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
      ? "font-body text-[0.72rem] tracking-[0.18em] uppercase text-orange mb-3"
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
              <span className="text-orange text-[0.72em] mr-1.5 align-middle">✣</span>
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-paper backdrop-blur-md border-b border-border py-3"
          : "border-b border-transparent py-4"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px] flex items-start justify-between gap-3 sm:gap-6">
        {/* Brand — full logo (desktop) / icon (mobile); multiply drops the white bg on paper.
            "at Movement Mortgage" line keeps the compliant lockup in the header. */}
        <Link href="/" onClick={() => setOpen(false)} className="z-50 shrink-0 leading-none flex flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-full.png"
            alt="David & Bri — The Lindley Team"
            className="h-11 sm:h-16 lg:h-[72px] w-auto object-contain mix-blend-multiply -ml-1"
          />
          <span className="mt-0.5 sm:mt-1 block font-body text-[0.5rem] sm:text-[0.56rem] tracking-[0.14em] sm:tracking-[0.2em] uppercase text-ink-light">
            at Movement Mortgage
          </span>
        </Link>

        {/* Clustered nav — visible at top on xl, collapses to Menu on scroll */}
        <div className={`hidden ${scrolled ? "xl:hidden" : "xl:block"} pt-1`}>
          <Cluster />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-0.5">
          {/* Menu toggle — shown on scroll (xl) and always below xl */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`${scrolled ? "xl:inline-flex" : "xl:hidden"} inline-flex items-center gap-2 font-body text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-ink hover:text-orange transition-colors`}
          >
            <span className="hidden sm:inline">{open ? "Close" : "Menu"}</span>
            <span className="relative w-6 h-[14px] flex flex-col justify-between">
              <span className={`w-6 h-[2px] bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
              <span className={`w-6 h-[2px] bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`w-6 h-[2px] bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
            </span>
          </button>

          {/* Contact — outline button (secondary). Visible at every breakpoint. */}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="inline-flex items-center font-body text-[0.6rem] sm:text-[0.7rem] font-bold tracking-[0.06em] sm:tracking-[0.1em] uppercase border border-ink text-ink px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-[2px] hover:bg-ink hover:text-paper transition-colors"
          >
            Contact
          </Link>

          {/* Apply now — primary money CTA, filled. */}
          <Link
            href="/apply"
            onClick={() => setOpen(false)}
            className="inline-flex items-center font-body text-[0.64rem] sm:text-[0.7rem] font-bold tracking-[0.08em] sm:tracking-[0.1em] uppercase bg-orange text-paper px-3 py-2 sm:px-4 sm:py-2.5 rounded-[2px] hover:brightness-110 transition"
          >
            Apply now
          </Link>
        </div>
      </div>

      {/* Full menu overlay — mobile + scrolled-desktop */}
      {open && (
        <div className="fixed inset-0 top-0 bg-paper pt-28 px-6 lg:px-[54px] z-40 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            <Cluster size="lg" onNavigate={() => setOpen(false)} />
            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                href="/apply"
                onClick={() => setOpen(false)}
                className="inline-flex items-center font-body text-[15px] font-bold tracking-[0.08em] uppercase bg-orange text-paper px-6 py-4 rounded-[2px]"
              >
                Apply now
              </Link>
              <Link
                href="/contact#schedule"
                onClick={() => setOpen(false)}
                className="inline-flex items-center font-body text-[15px] font-semibold tracking-[0.08em] uppercase border border-ink text-ink px-6 py-4 rounded-[2px] hover:bg-ink hover:text-paper transition-colors"
              >
                Schedule a call
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center font-body text-[15px] font-semibold tracking-[0.08em] uppercase border border-ink text-ink px-6 py-4 rounded-[2px] hover:bg-ink hover:text-paper transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
