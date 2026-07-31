"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Touch devices have no hover, so any card whose desktop motion lives in
 * `group-hover:*` utilities would sit dead on a phone. This mounts once (in the
 * root layout) and, on touch devices only, toggles `data-active` on every
 * element marked `data-scroll-active` while it sits in the vertical center of
 * the viewport. Cards mirror their hover styles with `group-data-[active=true]:*`
 * so the hover effect plays on scroll instead. Desktop keeps real :hover
 * (observer never runs where hover is supported); reduced-motion users get neither.
 *
 * Re-runs on route change so client-navigated pages get observed too.
 */
export default function ScrollActiveController() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = document.querySelectorAll<HTMLElement>("[data-scroll-active]");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          (e.target as HTMLElement).dataset.active = e.isIntersecting ? "true" : "false";
        });
      },
      // Thin band across the middle of the screen: a card is "active" only
      // while it's roughly centered.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
