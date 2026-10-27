import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { juneBrain, CHAT_CHANNEL } from "@/lib/june";

// Typed chat with June. The widget sends the whole conversation each turn; we run June's live GHL
// prompt plus the chat channel layer through Claude and stream her words back as plain text, so the
// first words land in a second or two instead of after the whole reply is written.
//
// Model: Sonnet 5, because a website chat is judged on how fast the first sentence appears and
// Opus measured six to sixteen seconds per turn here (2026-09-17). Sonnet holds the compliance
// rules in the prompt just as well for one-to-three-sentence replies. One line to change.

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-5";
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
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let wroteAnything = false;
      const write = (s: string) => { if (s) { wroteAnything = true; controller.enqueue(encoder.encode(s)); } };
      try {
        // At most three rounds: reply, or tool call then reply. June is told to save silently.
        // Text streams out as it is written; text beside a tool call (often the link) is kept and
        // the next round's text follows it.
        for (let round = 0; round < 3; round++) {
          const s = client.messages.stream({
            model: MODEL,
            max_tokens: 600,
            output_config: { effort: "low" },
            system: [{ type: "text", text: brain.prompt + CHAT_CHANNEL, cache_control: { type: "ephemeral" } }],
            tools: [SAVE_LEAD],
            messages,
          });
          s.on("text", (delta) => write(delta));
          const res = await s.finalMessage();

          const toolUses = res.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
          if (res.stop_reason === "refusal") {
            if (!wroteAnything) write("That one's really a David or Bri question. Want me to have one of them reach out?");
            break;
          }
          if (!toolUses.length) break;

          messages.push({ role: "assistant", content: res.content });
          const results: Anthropic.ToolResultBlockParam[] = [];
          for (const tu of toolUses) {
            let ok = false;
            try {
              ok = tu.name === "save_lead" && (await saveLead(origin, tu.input as Record<string, unknown>, turns));
            } catch (e) {
              console.error("[june] save_lead failed:", e);
            }
            results.push({ type: "tool_result", tool_use_id: tu.id, content: ok ? "saved" : "could not save; carry on, do not mention it" });
          }
          messages.push({ role: "user", content: results });
          if (wroteAnything) write("\n\n");
        }
        if (!wroteAnything) write("Sorry, I lost my train of thought. Say that once more?");
      } catch (e) {
        console.error("[june] chat error:", e);
        if (!wroteAnything) {
          write(e instanceof Anthropic.RateLimitError
            ? "June's got a few people at once. Give it a second and try again."
            : "June couldn't answer just now. Try again, or call 971-754-1771.");
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-June-Source": brain.source },
  });
}
