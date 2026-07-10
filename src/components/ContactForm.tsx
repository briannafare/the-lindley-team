"use client";

import { useState } from "react";

// Posts leads to a GHL inbound webhook (set NEXT_PUBLIC_GHL_CONTACT_WEBHOOK in Vercel env).
// Mirrors the calculator's webhook pattern. Falls back to phone if delivery fails.
const WEBHOOK = process.env.NEXT_PUBLIC_GHL_CONTACT_WEBHOOK || "";

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || (!form.email && !form.phone)) return;
    setState("sending");
    try {
      if (!WEBHOOK) throw new Error("no webhook configured");
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "thelindleyteam.com/contact" }),
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
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center bg-ink text-paper font-body text-[0.78rem] font-bold tracking-[0.06em] uppercase px-7 py-3.5 rounded-[2px] hover:bg-orange transition-colors disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send message"}
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
