"use client";

import { useEffect } from "react";
import { calendarFor, type LeadFormType } from "@/lib/ghl";

// Renders the LeadConnector booking calendar for a given request type. If no
// calendar URL is configured yet, shows a graceful call/apply fallback so the
// page never looks broken pre-launch.
export default function BookingCalendar({
  type = "schedule",
}: {
  type?: LeadFormType;
}) {
  const url = calendarFor(type);

  useEffect(() => {
    if (!url) return;
    const id = "leadconnector-form-embed";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://link.msgsndr.com/js/form_embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, [url]);

  if (!url) {
    return (
      <div className="border border-border rounded-[1.5rem] p-6 sm:p-8 bg-paper shadow-[0_24px_70px_rgba(0,0,0,0.06)]">
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt text-ink" aria-hidden>↗</span>
        <p className="font-serif text-[clamp(23px,3vw,32px)] leading-tight text-ink">Online booking is coming online.</p>
        <p className="text-ink-mid text-sm mt-2 leading-relaxed">
          In the meantime, call{" "}
          <a href="tel:9717541771" className="text-orange font-semibold">(971) 754-1771</a>{" "}
          or send a message below and we&apos;ll get you on the calendar.
        </p>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      title="Book a time with The Lindley Team"
      scrolling="no"
      className="booking-calendar w-full rounded-[1.5rem] border border-border bg-paper shadow-[0_24px_70px_rgba(0,0,0,0.06)]"
      style={{ minHeight: 680, border: 0 }}
    />
  );
}
