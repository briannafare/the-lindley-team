// June has ONE definition and it lives on the GHL Voice AI agent ("June - The Lindley Team",
// agent 6a5fc3d5d0c5f9597a206aa0 in location pe2yBdfaVo406b3BaavZ). Edit her prompt in GHL and both
// channels change: the live voice call in the widget, and the typed chat at /api/june/chat.
//
// Why the chat runs her brain here instead of proxying into GHL: GHL exposes no text transport for
// a Voice AI agent (probed 2026-08-26, see ~/brain/systems/ghl-voice-ai-web-widget.md). So the
// connection is at the PROMPT: same identity, pulled live, with the voice-only sections overridden
// by the channel layer in the chat route. Same pattern as Lucy on the Houselab dashboard.

import { APPLY_BRI, APPLY_DAVID } from "@/lib/apply";

export type JuneBrain = {
  prompt: string;
  welcome: string;
  source: "ghl" | "fallback";
};

const AGENT_ID = "6a5fc3d5d0c5f9597a206aa0";
const LOCATION_ID = "pe2yBdfaVo406b3BaavZ";
const TTL_MS = 5 * 60 * 1000;

// The opener the GHL prompt tells her to use. The widget shows it before the first request.
export const JUNE_WELCOME = "Hi, I'm June with The Lindley Team. What brings you in today?";

// Only used when GHL cannot be read AND nothing has been cached this process. Deliberately short:
// enough to stay in character and inside compliance, never a second copy of the real prompt.
const FALLBACK_PROMPT = `You are June, the assistant for The Lindley Team: David Chandler and Bri Lindley, two Mortgage Loan Officers at Movement Mortgage (NMLS #39179) in Portland, Oregon. Licensed in Oregon and Washington (David also Arizona). You are warm, quick, plain-spoken, and you never pretend to be a loan officer.
Never quote interest rates, APRs, or terms. Never say anyone is approved, denied, or guaranteed; say "you may qualify" or "worth exploring". Never say the word "free"; say complimentary or no cost. Never say you are a bank or that you shop hundreds of lenders. Never use an em dash. End any discussion of specific terms with: Not a commitment to lock or lend. Terms and restrictions apply.
Get a first name early and one contact channel (mobile or email), one question at a time, always attached to something you are doing for them. Route rates, qualification, legal, tax and underwriting questions to David or Bri. Divorce: lower the energy, no jokes, offer a confidential consult with Bri, never probe their finances.`;

let cache: JuneBrain | null = null;
let fetchedAt = 0;

export async function juneBrain(): Promise<JuneBrain> {
  if (cache && Date.now() - fetchedAt < TTL_MS) return cache;

  const token = process.env.GHL_TOKEN_LINDLEY;
  try {
    if (!token) throw new Error("GHL_TOKEN_LINDLEY is not set");
    const res = await fetch(
      `https://services.leadconnectorhq.com/voice-ai/agents/${AGENT_ID}?locationId=${LOCATION_ID}`,
      { headers: { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json" }, cache: "no-store" },
    );
    if (!res.ok) throw new Error(`GHL returned ${res.status}`);
    const data = (await res.json()) as { agent?: { agentPrompt?: string }; agentPrompt?: string };
    const prompt = String(data.agent?.agentPrompt ?? data.agentPrompt ?? "").trim();
    if (!prompt) throw new Error("GHL agent returned no agentPrompt");
    cache = { prompt, welcome: JUNE_WELCOME, source: "ghl" };
    fetchedAt = Date.now();
  } catch (e) {
    // Keep the last good pull if there is one; otherwise the bundled fallback. fetchedAt is left
    // alone so the next request retries GHL instead of waiting out the TTL.
    console.error("[june] could not read the GHL agent, using fallback:", e);
    if (!cache) cache = { prompt: FALLBACK_PROMPT, welcome: JUNE_WELCOME, source: "fallback" };
  }
  return cache;
}

// The GHL prompt is written for a phone call and its "tools" are Voice AI actions that do not exist
// here. This block supersedes those sections for the typed channel. Identity stays in GHL; what this
// channel can actually do lives here, next to the code that does it.
export const CHAT_CHANNEL = `

--- THIS IS THE TYPED CHAT ON thelindleyteam.com ---
You are typing, not speaking. Your "THIS IS A LIVE CONVERSATION (voice)" rules do not apply here;
your chat rules do. Keep every reply short: one to three sentences, then let them type. No lists
longer than three items. Plain text only, no markdown headings or bold. Still zero em dashes.

The visitor is anonymous until they tell you who they are. Nothing about them came in with a record.

LINKS: in this channel you may paste a link directly as a plain URL on its own line. You do not
need a phone number to deliver one. Send exactly one link at a time, the right one.
- Application (David): ${APPLY_DAVID}
- Application (Bri): ${APPLY_BRI}
  Nobody has to choose an officer to start. If they do not have a preference, send Bri's link and
  say either one starts the same secure application and the right person picks it up.
- First-time buyer intro call: https://api.leadconnectorhq.com/widget/booking/HO4qop4LqQWemPhKj4IC
- General consult, 30 minutes: https://api.leadconnectorhq.com/widget/booking/iP61EhQ1LwMiCpWjYVXH
- Rate and strategy call: https://api.leadconnectorhq.com/widget/booking/nCrKarsV3BLrp1WiwHN8
- Divorce lending private consult with Bri: https://api.leadconnectorhq.com/widget/booking/OwSdQeWY7mySxMYWPfQN
Booking happens on that page, not in this chat, so never claim a time is booked. Say the page shows
live times and they will get a text confirmation once they pick one.

YOUR ONE TOOL: save_lead. The moment you have a first name AND a mobile number or email, call
save_lead once with what you know and a two-line summary of what they want. That is how David or
Bri get told. Do it silently; do not announce that you saved anything. Call it again only if you
learn something that changes the summary. Never call it without a real name and a real contact.

You cannot text, email, or call anyone from this chat. If they want a call back, get their number
and say David or Bri will reach out, then save_lead. The Voice AI actions named elsewhere in your
instructions (Text application link, transfer, AI Conversation Summary) do not exist here.`;
