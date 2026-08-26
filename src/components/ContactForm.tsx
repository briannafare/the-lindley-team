"use client";

import { useRef, useState } from "react";
import type { LeadFormType } from "@/lib/ghl";

// When someone asks for a call, the alert has to say when they want it. Booking a
// real slot at /contact#schedule is still the better path; this is for the people
// who send a message instead.
const BEST_TIMES = [
  "Weekday morning (8–12)",
  "Weekday afternoon (12–5)",
  "Weekday evening (5–7)",
  "Weekend",
  "Any time — just call me",
];

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", bestTime: "" });
  const [smsConsent, setSmsConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot
  const renderedAt = useRef(Date.now());

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || (!form.email && !form.phone)) return;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          formType,
          source,
          smsConsent,
          consentTimestamp: new Date().toISOString(),
          company,
          renderedAt: renderedAt.current,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="border border-border rounded-[1.5rem] p-6 sm:p-8 bg-paper shadow-[0_24px_70px_rgba(0,0,0,0.06)]">
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-bg-alt text-ink" aria-hidden>✓</span>
        <p className="font-serif text-[clamp(24px,3vw,34px)] leading-tight text-ink">Thanks — we&apos;ll be in touch shortly.</p>
        <p className="text-ink-mid text-sm mt-2">
          Prefer to talk now? Call{" "}
          <a href="tel:9717541771" className="text-orange font-semibold">(971) 754-1771</a>.
        </p>
      </div>
    );
  }

  const field =
    "w-full border border-transparent rounded-xl px-4 py-3.5 text-[0.95rem] text-ink bg-bg-alt focus:border-ink focus:bg-paper focus:outline-none transition-colors placeholder:text-ink-light/70";
  const label =
    "block mb-2 font-body text-[0.68rem] font-bold tracking-[0.13em] uppercase text-ink-mid";

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-5 rounded-[1.5rem] border border-border bg-paper p-5 shadow-[0_24px_70px_rgba(0,0,0,0.06)] sm:p-8"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={label}>Name</label>
          <input id="contact-name" className={field} placeholder="Name" value={form.name} onChange={set("name")} required />
        </div>
        <div>
          <label htmlFor="contact-phone" className={label}>Phone <span className="normal-case tracking-normal font-normal text-ink-light">(optional)</span></label>
          <input id="contact-phone" className={field} type="tel" placeholder="Phone" value={form.phone} onChange={set("phone")} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-email" className={label}>Email</label>
        <input id="contact-email" className={field} type="email" placeholder="Email" value={form.email} onChange={set("email")} required />
      </div>
      <div>
        <label htmlFor="contact-besttime" className={label}>
          Best time to reach you{" "}
          <span className="normal-case tracking-normal font-normal text-ink-light">(optional)</span>
        </label>
        <select id="contact-besttime" className={field} value={form.bestTime} onChange={set("bestTime")}>
          <option value="">Pick a window — or book an exact time above</option>
          {BEST_TIMES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className={label}>What can we help with?</label>
        <textarea
          id="contact-message"
          className={`${field} min-h-[132px] resize-y`}
          placeholder="Buying, refinancing, divorce lending, just exploring…"
          value={form.message}
          onChange={set("message")}
        />
      </div>
      {/* Honeypot: off-screen and hidden from assistive tech. Only bots fill it. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>
      <label className="flex items-start gap-3 rounded-xl bg-bg-alt/70 p-4 text-[0.76rem] text-ink-mid leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={smsConsent}
          onChange={(e) => setSmsConsent(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-orange"
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
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state === "sending"}
          className="group/btn inline-flex w-full items-center justify-between gap-2.5 rounded-full bg-ink py-1.5 pl-6 pr-1.5 font-body text-[0.72rem] font-bold tracking-[0.1em] uppercase text-paper transition-colors duration-300 hover:bg-orange disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:w-auto"
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
      <p className="text-[0.72rem] text-ink-light">No spam, no pressure.</p>
    </form>
  );
}
