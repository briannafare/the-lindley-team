// Meta (Facebook/Instagram) pixel helpers. The pixel is "TLT Pixel", owned by the
// Lindley business portfolio in Meta. It feeds the website-visitor retargeting
// audiences. Mortgage ads run under Meta's financial-services special ad category,
// so we only send standard events with no custom data about the visitor.
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "548459208876168";

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === "function" ? f : null;
}

export function trackPageView() {
  fbq()?.("track", "PageView");
}

// Fired after a lead form posts successfully. No name, email or phone is sent.
export function trackLead() {
  fbq()?.("track", "Lead");
}
