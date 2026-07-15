import { NextResponse } from "next/server";
import { LEAD_TAGS, type LeadFormType } from "@/lib/ghl";

// ── Lead intake → GHL webhook fan-out ───────────────────────────────────────
// Every website form POSTs here with { formType, ...fields }. We forward to the
// GHL (LeadConnector) inbound webhook that matches the form type, adding source
// + form tags so the right workflow/pipeline fires in the sub-account.
//
// Webhook URLs are PRIVATE (no NEXT_PUBLIC_ prefix) — set them in Vercel.
// Get each URL from GHL → Automation → Workflows → Webhook trigger.

const WEBHOOKS: Record<LeadFormType, string | undefined> = {
  contact: process.env.GHL_WEBHOOK_SCHEDULE,
  schedule: process.env.GHL_WEBHOOK_SCHEDULE,
  "rate-quote": process.env.GHL_WEBHOOK_RATE_QUOTE,
  calculator: process.env.GHL_WEBHOOK_CALCULATOR,
  neighborhood: process.env.GHL_WEBHOOK_NEIGHBORHOOD,
  guide: process.env.GHL_WEBHOOK_GUIDE,
  divorce: process.env.GHL_WEBHOOK_DIVORCE,
  "first-time-buyer": process.env.GHL_WEBHOOK_SCHEDULE,
  "apply-click": process.env.GHL_WEBHOOK_APPLY_CLICK,
};

const VALID: LeadFormType[] = [
  "contact", "schedule", "rate-quote", "calculator",
  "neighborhood", "guide", "divorce", "first-time-buyer", "apply-click",
];

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const formType = (VALID as string[]).includes(String(body.formType))
    ? (body.formType as LeadFormType)
    : "contact";

  // Minimal validation: need a name and at least one way to reach them.
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  if (!name || (!email && !phone)) {
    return NextResponse.json({ ok: false, error: "missing contact info" }, { status: 422 });
  }

  const url = WEBHOOKS[formType] ?? process.env.GHL_WEBHOOK_SCHEDULE;
  if (!url) {
    // Not configured yet — tell the client to fall back to phone/email.
    return NextResponse.json({ ok: false, error: "webhook not configured" }, { status: 501 });
  }

  const payload = {
    ...body,
    formType,
    source: body.source ?? "thelindleyteam.com",
    tags: LEAD_TAGS[formType],
    submittedAt: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `ghl ${res.status}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "delivery failed" }, { status: 502 });
  }
}
