"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Every SEO-relevant page must be reachable from the nav.
const LINKS = [
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Loans", href: "/services" },
  { name: "Calculator", href: "/calculator" },
  { name: "Journal", href: "/blog" },
  { name: "The Team", href: "/about" },
  { name: "Contact", href: "/contact" },
];

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-paper/95 backdrop-blur-md border-b border-border py-3"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px] flex items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="font-serif text-[1.35rem] font-semibold tracking-[-0.01em] text-ink z-50"
        >
          The Lindley Team
        </Link>

        {/* desktop links */}
        <div className="hidden lg:flex items-center gap-6">
          {LINKS.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="font-body text-[0.76rem] font-medium tracking-[0.1em] uppercase text-ink hover:text-orange transition-colors"
            >
              {l.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/apply"
            className="hidden sm:inline-block font-body text-[0.72rem] font-semibold tracking-[0.08em] uppercase border border-ink px-4 py-2.5 rounded-[2px] hover:bg-ink hover:text-paper transition-colors"
          >
            Get pre-approved
          </Link>
          {/* mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="lg:hidden z-50 w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
          >
            <span className={`w-6 h-[2px] bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`w-6 h-[2px] bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`w-6 h-[2px] bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-0 bg-paper pt-24 px-6 z-40">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <Link
                key={l.name}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-serif text-[2rem] leading-tight py-2 border-b border-border hover:text-orange transition-colors"
              >
                {l.name}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="mt-6 inline-block text-center font-grotesk font-bold text-[15px] bg-ink text-paper px-6 py-4 rounded-[2px]"
            >
              Get pre-approved
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
