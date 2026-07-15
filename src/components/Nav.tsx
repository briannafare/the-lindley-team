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
        {/* Brand lockup — The Lindley Team leads (it carries the SEO + reviews);
            David & Bri + Movement ride underneath as the support line. */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="z-50 shrink-0 flex items-center gap-2.5 sm:gap-3.5 lg:gap-4 group/brand"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-icon.png"
            alt=""
            className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full mix-blend-multiply transition-transform duration-500 group-hover/brand:rotate-[12deg]"
          />
          <span className="flex flex-col leading-none">
            <span className="font-serif font-semibold text-[clamp(19px,2vw,28px)] tracking-[-0.02em] text-ink whitespace-nowrap">
              The Lindley Team
            </span>
            {/* "David & Bri" mini-lockup — script ampersand + lime highlight
                chip, recreating the reference logo's signature as crisp
                live type instead of the noisy source raster. */}
            <span className="mt-[6px] flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5">
              <span className="flex items-baseline whitespace-nowrap">
                <span className="font-serif font-bold text-ink text-[clamp(12px,1.1vw,15px)] tracking-[-0.01em]">
                  David
                </span>
                <span className="font-serif italic text-orange text-[clamp(16px,1.5vw,20px)] leading-[0] mx-[1px]" aria-hidden>
                  &amp;
                </span>
                <span className="relative font-serif font-bold text-ink text-[clamp(12px,1.1vw,15px)] tracking-[-0.01em] px-[3px]">
                  <span className="absolute inset-0 bg-lime -z-10" aria-hidden />
                  Bri
                </span>
              </span>
              <span className="font-body text-[0.5rem] sm:text-[0.58rem] font-semibold tracking-[0.16em] sm:tracking-[0.2em] uppercase text-ink-mid whitespace-nowrap">
                <span className="text-cobalt">·</span> Movement Mortgage
              </span>
            </span>
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

          {/* Contact — quiet text link (secondary). */}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="hidden sm:inline-flex items-center font-body text-[0.68rem] font-semibold tracking-[0.1em] uppercase text-ink border-b border-ink/30 pb-0.5 hover:text-orange hover:border-orange transition-colors"
          >
            Contact
          </Link>

          {/* Apply now — primary money CTA. Bigger pill at lg+, and the
              md base bump also lifts the mobile tap target closer to the
              44px touch guideline. */}
          <Btn href="/apply" onClick={() => setOpen(false)} variant="primary" size="md">
            Apply now
          </Btn>
        </div>
      </div>

      {/* Full menu overlay — mobile + scrolled-desktop */}
      {open && (
        <div className="fixed inset-0 top-0 bg-paper pt-28 px-6 lg:px-[54px] z-40 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto">
            <Cluster size="lg" onNavigate={() => setOpen(false)} />
            <div className="mt-12 flex flex-wrap items-center gap-3">
              <Btn href="/apply" onClick={() => setOpen(false)} variant="accent" size="lg">
                Apply now
              </Btn>
              <Btn href="/contact#schedule" onClick={() => setOpen(false)} variant="outline" size="lg">
                Schedule a call
              </Btn>
              <Btn href="/contact" onClick={() => setOpen(false)} variant="outline" size="lg">
                Contact
              </Btn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
