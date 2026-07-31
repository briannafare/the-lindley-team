// ── GHL / LeadConnector integration config ──────────────────────────────────
// The Lindley Team sub-account. Forms POST to /api/lead with a `formType`; the
// server route (src/app/api/lead/route.ts) forwards to the matching GHL webhook
// (private env vars). Booking calendars are public LeadConnector embed URLs
// rendered client-side by <BookingCalendar>, so they use NEXT_PUBLIC_ vars.
//
// Set the values in Vercel → Project → Settings → Environment Variables.
// See .env.local.example for the full list.

export type LeadFormType =
  | "contact"
  | "schedule"
  | "rate-quote"
  | "calculator"
  | "neighborhood"
  | "guide"
  | "divorce"
  | "first-time-buyer"
  | "apply-click";

// Tags auto-applied to the GHL contact per form type (mirrors the playbook).
export const LEAD_TAGS: Record<LeadFormType, string[]> = {
  contact: ["source:website", "form:contact"],
  schedule: ["source:website", "form:schedule-call"],
  "rate-quote": ["source:website", "form:rate-quote"],
  calculator: ["source:website", "form:calculator"],
  neighborhood: ["source:website", "form:neighborhood"],
  guide: ["source:website", "form:guide-download"],
  divorce: ["source:website", "form:divorce-consult"],
  "first-time-buyer": ["source:website", "form:first-time-buyer"],
  "apply-click": ["source:website", "clicked-apply"],
};

// Booking calendars differ by request type. Each is a LeadConnector embed URL,
// e.g. https://api.leadconnectorhq.com/widget/booking/XXXXXXXX
// These are statically referenced so Next can inline them client-side.
export function calendarFor(type: LeadFormType): string | undefined {
  const map: Partial<Record<LeadFormType, string | undefined>> = {
    schedule: process.env.NEXT_PUBLIC_GHL_CAL_SCHEDULE,
    divorce: process.env.NEXT_PUBLIC_GHL_CAL_DIVORCE,
    "rate-quote": process.env.NEXT_PUBLIC_GHL_CAL_RATE_QUOTE,
    "first-time-buyer": process.env.NEXT_PUBLIC_GHL_CAL_FIRST_TIME,
  };
  // Fall back to the general "schedule a call" calendar if a specific one
  // isn't configured yet.
  return map[type] ?? process.env.NEXT_PUBLIC_GHL_CAL_SCHEDULE;
}
