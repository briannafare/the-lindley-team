"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const LINKS = [
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Journal", href: "/blog" },
  { name: "Calculator", href: "/calculator" },
  { name: "Contact", href: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-paper/95 backdrop-blur-xl border-b border-paper-200 py-3"
          : "py-5"
      }`}
    >
      <div className="max-w-container mx-auto px-6 lg:px-10 flex items-center justify-between">
        <Link href="/" className="font-display text-[1.05rem] text-paper-900">
          The Lindley Team
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {LINKS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="instrument !text-paper-600 hover:!text-paper-900 transition-colors duration-200"
            >
              {item.name.toLowerCase()}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <a href="tel:9717541771" className="hidden md:block instrument !text-paper-600">
            971.754.1771
          </a>
          <a
            href="https://mtgxps.mymortgage-online.com/loan-app/?siteId=1878266072&lar=blindley&workFlowId=71729"
            className="px-5 py-2.5 bg-paper-900 text-paper-50 rounded-sm text-[0.85rem] font-medium hover:bg-paper-800 transition-colors duration-200"
          >
            Get pre-approved
          </a>
        </div>
      </div>
    </nav>
  );
}
