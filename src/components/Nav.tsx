"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Loans", href: "/services" },
  { name: "Meet David & Bri", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-paper/95 backdrop-blur-md border-b border-border py-3"
          : "border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px] flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-[1.35rem] font-semibold tracking-[-0.01em] text-ink"
        >
          The Lindley Team
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="font-body text-[0.78rem] font-medium tracking-[0.1em] uppercase text-ink hover:text-orange transition-colors"
            >
              {l.name}
            </Link>
          ))}
        </div>

        <Link
          href="/apply"
          className="font-body text-[0.72rem] font-semibold tracking-[0.08em] uppercase border border-ink px-4 py-2.5 rounded-[2px] hover:bg-ink hover:text-paper transition-colors"
        >
          Get pre-approved
        </Link>
      </div>
    </nav>
  );
}
