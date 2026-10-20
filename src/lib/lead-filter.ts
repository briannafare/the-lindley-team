// Sales pitches arrive through the contact form typed by a person (or a browser driving one),
// so the honeypot and timing checks in api/lead/route.ts never see them. Between July and
// September 2026 ten of the form's submissions were vendors: virtual-assistant agencies and an
// SEO shop. Each one became a contact, an opportunity and a team alert.
//
// Every pattern below is lifted from a pitch that actually arrived. Keep it that way: add a
// pattern when a new pitch gets through, never on a hunch.
//
// Never match a bare "VA". A VA loan is one of the most common things a borrower asks about.
const PITCH: RegExp[] = [
  /virtual assistants?/i,
  /\btrained VAs?\b/,
  /\bVAs\b/,
  /reply yes\b/i,
  /stop to opt out/i,
  /tried emailing you/i,
  /\bSEO\b/,
  /unsubscribe on request/i,
  /custom(-built)? AI/i,
  /client acquisition/i,
  /cold calling/i,
  /lead generation/i,
];

export function looksLikePitch(message: unknown): boolean {
  const text = String(message ?? "");
  return PITCH.some((p) => p.test(text));
}
