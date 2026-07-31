"use client";

import { useState } from "react";
import type { LeadFormType } from "@/lib/ghl";

// Posts leads through the /api/lead route, which fans out to the correct GHL
// workflow webhook based on formType (see src/app/api/lead/route.ts and
// .env.local.example). Falls back to phone if delivery fails.

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm({
  source = "thelindleyteam.com/contact",
  formType = "contact",
}: {
  source?: string;
  formType?: LeadFormType;
}) {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [smsConsent, setSmsConsent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || (!form.email && !form.phone)) return;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, formType, source, smsConsent, consentTimestamp: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-border rounded-2xl p-8 bg-paper">
        <p className="font-display text-xl font-bold text-ink">Thanks — we&apos;ll be in touch shortly.</p>
        <p className="text-ink-mid text-sm mt-2">
          Prefer to talk now? Call{" "}
          <a href="tel:9717541771" className="text-orange font-semibold">(971) 754-1771</a>.
        </p>
      </div>
    );
  }

  const field =
    "w-full border border-border rounded-lg px-4 py-3 text-[0.95rem] text-ink bg-paper focus:border-ink focus:outline-none transition-colors";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input className={field} placeholder="Name" value={form.name} onChange={set("name")} required aria-label="Name" />
        <input className={field} type="tel" placeholder="Phone" value={form.phone} onChange={set("phone")} aria-label="Phone" />
      </div>
      <input className={field} type="email" placeholder="Email" value={form.email} onChange={set("email")} aria-label="Email" />
      <textarea
        className={`${field} min-h-[120px] resize-y`}
        placeholder="What can we help with? (buying, refinancing, divorce lending, just exploring…)"
        value={form.message}
        onChange={set("message")}
        aria-label="Message"
      />
      <label className="flex items-start gap-2.5 text-[0.78rem] text-ink-mid leading-snug cursor-pointer">
        <input
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-0.5 shrink-0"
        />
        <span>
          I agree to receive calls and texts from The Lindley Team at Movement Mortgage about my
          inquiry, including by autodialer or prerecorded message. Message/data rates may apply,
          message frequency varies, reply STOP to opt out. This isn&apos;t a condition of getting a
          quote — you can also reach us by phone or email. See our{" "}
          <a href="/privacy" className="underline hover:text-ink transition-colors">
            Privacy Policy
          </a>
          .
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="group/btn inline-flex items-center gap-2.5 bg-ink text-paper font-body text-[0.72rem] font-bold tracking-[0.1em] uppercase pl-6 pr-1.5 py-1.5 rounded-full hover:bg-orange transition-colors duration-300 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {state === "sending" ? "Sending…" : "Send message"}
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange text-paper group-hover/btn:bg-paper group-hover/btn:text-ink transition-colors duration-300"
            aria-hidden
          >
            <svg
              viewBox="0 0 16 16"
              className="w-[38%] h-[38%] transition-transform duration-300 group-hover/btn:-rotate-45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 8 H14 M9 3 L14 8 L9 13" />
            </svg>
          </span>
        </button>
        {state === "error" && (
          <span className="text-[0.85rem] text-ink-mid">
            Couldn&apos;t send — please call{" "}
            <a href="tel:9717541771" className="text-orange font-semibold">(971) 754-1771</a>.
          </span>
        )}
      </div>
      <p className="text-[0.72rem] text-ink-light">No spam, no pressure. We usually reply within 2 business hours.</p>
    </form>
  );
}
