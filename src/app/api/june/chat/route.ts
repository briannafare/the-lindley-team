import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { juneBrain, CHAT_CHANNEL } from "@/lib/june";

// Typed chat with June. The widget sends the whole conversation each turn; we run June's live GHL
// prompt plus the chat channel layer through Claude and return one reply. Non-streaming on purpose:
// replies are one to three sentences, and a plain JSON response keeps the one tool loop trivial.
// ponytail: switch to client.messages.stream if replies ever grow past a few sentences.

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_TURNS = 40;
const MAX_CHARS = 2000;

type Turn = { role: "user" | "assistant"; content: string };

const SAVE_LEAD: Anthropic.Tool = {
  name: "save_lead",
  description:
    "Record who the visitor is and what they want so David or Bri get an alert. Call once you have a first name and a mobile number or email.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "First name, or full name if given" },
      phone: { type: "string", description: "Mobile number exactly as they typed it, or empty" },
      email: { type: "string", description: "Email exactly as they typed it, or empty" },
      summary: { type: "string", description: "Two lines: what they want and the agreed next step" },
    },
    required: ["name", "summary"],
    additionalProperties: false,
  },
  strict: true,
};

async function saveLead(origin: string, input: Record<string, unknown>, transcript: Turn[]) {
  const last = transcript.slice(-12).map((t) => `${t.role === "user" ? "Visitor" : "June"}: ${t.content}`).join("\n");
  const res = await fetch(`${origin}/api/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      formType: "schedule",
      name: String(input.name ?? ""),
      phone: String(input.phone ?? ""),
      email: String(input.email ?? ""),
      message: `${String(input.summary ?? "")}\n\nLast messages:\n${last}`,
      requestType: "june-chat",
      source: "thelindleyteam.com · June chat",
      // no renderedAt on purpose: the lead route's under-three-seconds bot check only runs when
      // that stamp is present, and a chat never has one
    }),
  });
  return res.ok;
}

export async function POST(req: Request) {
  let turns: Turn[];
  try {
    const body = (await req.json()) as { messages?: Turn[] };
    turns = (body.messages ?? [])
      .filter((t) => (t.role === "user" || t.role === "assistant") && typeof t.content === "string")
      .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_CHARS) }))
      .slice(-MAX_TURNS);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!turns.length || turns[turns.length - 1].role !== "user") {
    return NextResponse.json({ error: "last message must be from the visitor" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "chat is not configured" }, { status: 503 });
  }

  const brain = await juneBrain();
  const client = new Anthropic();
  const origin = new URL(req.url).origin;

  const messages: Anthropic.MessageParam[] = turns.map((t) => ({ role: t.role, content: t.content }));
  let reply = "";
  let saved = false;

  try {
    // At most three rounds: reply, or tool call then reply. June is told to save silently.
    for (let round = 0; round < 3; round++) {
      const res = await client.messages.create({
        model: "claude-opus-5",
        max_tokens: 600,
        output_config: { effort: "low" },
        system: [{ type: "text", text: brain.prompt + CHAT_CHANNEL, cache_control: { type: "ephemeral" } }],
        tools: [SAVE_LEAD],
        messages,
      });

      const text = res.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("").trim();
      const toolUses = res.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");

      if (res.stop_reason === "refusal") {
        reply = "That one's really a David or Bri question. Want me to have one of them reach out?";
        break;
      }
      if (!toolUses.length) {
        reply = [reply, text].filter(Boolean).join("\n\n");
        break;
      }

      messages.push({ role: "assistant", content: res.content });
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const tu of toolUses) {
        let ok = false;
        try {
          ok = tu.name === "save_lead" && (await saveLead(origin, tu.input as Record<string, unknown>, turns));
        } catch (e) {
          console.error("[june] save_lead failed:", e);
        }
        saved = saved || ok;
        results.push({ type: "tool_result", tool_use_id: tu.id, content: ok ? "saved" : "could not save; carry on, do not mention it" });
      }
      messages.push({ role: "user", content: results });
      if (text) reply = [reply, text].filter(Boolean).join("\n\n"); // text written beside the tool call (often the link) must survive the next round
    }
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "busy" }, { status: 429 });
    }
    console.error("[june] chat error:", e);
    return NextResponse.json({ error: "chat failed" }, { status: 502 });
  }

  if (!reply) reply = "Sorry, I lost my train of thought. Say that once more?";
  return NextResponse.json({ reply, saved, source: brain.source });
}
