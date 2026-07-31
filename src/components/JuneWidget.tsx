"use client";

// ── June — The Lindley Team's website assistant ──────────────────────────────
// Custom-branded voice-or-chat widget. "Talk to June" is the REAL GHL Voice AI
// agent ("Voice Assistant - 1") talking live in-browser: GHL runs Voice AI on
// Retell over LiveKit and hands the browser a LiveKit token from a public
// endpoint, so the same agent GHL ships answers on the page, in our own UI.
// (Method reverse-engineered from the HouseLab "Lucy" dashboard.)
//
// The three IDs below are PUBLIC (they live in the widget embed + public config),
// so it's fine to ship them client-side.

import { useCallback, useEffect, useRef, useState } from "react";

const GHL_VOICE = {
  agentId: "6a5fc3d5d0c5f9597a206aa0", // "Voice Assistant - 1" (Lindley sub-account)
  widgetId: "6a5fc9b1d166a8719fac63e0",
  locationId: "pe2yBdfaVo406b3BaavZ",
  tokenUrl: "https://services.leadconnectorhq.com/chat-widget/public/start-voice-ai-call/",
  livekitUrl: "wss://retell-ai-4ihahnq7.livekit.cloud",
};

const rand = (chars: string, n: number) =>
  Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
const hex = (n: number) => rand("0123456789abcdef", n);
const uuid4 = () => `${hex(8)}-${hex(4)}-4${hex(3)}-a${hex(3)}-${hex(12)}`;
const mongoId = () => Math.floor(Date.now() / 1000).toString(16).padStart(8, "0") + hex(16);

// ── icons ────────────────────────────────────────────────────────────────────
const I = {
  mic: (p = 20) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v3" /></svg>
  ),
  chat: (p = 20) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12h8M8 8h8M8 16h5" /><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></svg>
  ),
  phone: (p = 18) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
  ),
  sms: (p = 18) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" /></svg>
  ),
  chevron: (p = 18) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
  ),
  back: (p = 20) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
  ),
  close: (p = 20) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
  ),
  check: (p = 22) => (
    <svg width={p} height={p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  ),
};

type View = "choose" | "voice" | "call" | "text" | "message";

// ── the live voice call (GHL Voice AI over LiveKit) ──────────────────────────
type VoiceStatus = "idle" | "connecting" | "live" | "ended" | "error";

function VoiceCall() {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [muted, setMuted] = useState(false);
  const [level, setLevel] = useState(0); // 0..1 amplitude of June's voice → drives the orb
  const roomRef = useRef<import("livekit-client").Room | null>(null);
  const cleanupRef = useRef<() => void>(() => {});

  const endCall = useCallback(async () => {
    cleanupRef.current();
    cleanupRef.current = () => {};
    const room = roomRef.current;
    roomRef.current = null;
    try { await room?.disconnect(); } catch { /* already gone */ }
    document.querySelectorAll("[data-june-audio]").forEach((el) => el.remove());
    setLevel(0);
  }, []);

  const startCall = useCallback(async () => {
    setStatus("connecting");
    setErrMsg("");
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }); // prompt mic (mobile needs the gesture)

      const sessionId = uuid4();
      const payload = {
        contactId: rand("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 20),
        callId: mongoId(),
        widgetId: GHL_VOICE.widgetId,
        locationId: GHL_VOICE.locationId,
        sessionId,
        sessionFingerprint: uuid4(),
        eventData: {
          source: "direct", referrer: "", keyword: "", adSource: "", url_params: {},
          page: { url: location.href, title: document.title },
          timestamp: Date.now(), campaign: "",
          contactSessionIds: { ids: [sessionId] },
          type: "page-visit", pageVisitType: "text-widget",
          domain: location.hostname, version: "v3",
          parentId: "", parentName: "", fingerprint: null, documentURL: location.href,
        },
      };

      const res = await fetch(GHL_VOICE.tokenUrl + GHL_VOICE.agentId, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "*/*" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Couldn't reach June (${res.status}). Try again in a moment.`);
      const { accessToken } = await res.json();

      const { Room, RoomEvent, Track } = await import("livekit-client");
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
        audioCaptureDefaults: { autoGainControl: true, echoCancellation: true, noiseSuppression: true },
      });
      roomRef.current = room;

      room.on(RoomEvent.TrackSubscribed, (track) => {
        if (track.kind !== Track.Kind.Audio) return;
        const el = track.attach();
        el.setAttribute("data-june-audio", "1");
        el.autoplay = true;
        (el as HTMLMediaElement & { playsInline: boolean }).playsInline = true;
        el.style.display = "none";
        document.body.appendChild(el);
        el.play().catch(() => {});
        // June's amplitude → orb reactivity
        try {
          const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AC();
          const src = ctx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          src.connect(analyser);
          const buf = new Uint8Array(analyser.frequencyBinCount);
          let raf = 0;
          const tick = () => {
            analyser.getByteFrequencyData(buf);
            let sum = 0;
            for (let i = 0; i < buf.length; i++) sum += buf[i];
            setLevel(Math.min(1, sum / buf.length / 90));
            raf = requestAnimationFrame(tick);
          };
          tick();
          const prev = cleanupRef.current;
          cleanupRef.current = () => { prev(); cancelAnimationFrame(raf); ctx.close().catch(() => {}); };
        } catch { /* analyser is decorative; call still works without it */ }
      });
      room.on(RoomEvent.Disconnected, () => { setStatus("ended"); endCall(); });

      await room.connect(GHL_VOICE.livekitUrl, accessToken);
      try { await room.startAudio(); } catch { /* not always needed */ }
      await room.localParticipant.setMicrophoneEnabled(true);
      setStatus("live");
    } catch (e) {
      const denied = e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError");
      setErrMsg(denied ? "I need mic access to talk. Turn it on and tap again." : e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
      endCall();
    }
  }, [endCall]);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !muted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
  }, [muted]);

  useEffect(() => () => { endCall(); }, [endCall]); // tear down on unmount

  const live = status === "live";
  const speaking = live && level > 0.06;
  const label =
    status === "idle" ? "Tap the mic and June says hello"
    : status === "connecting" ? "Connecting…"
    : live ? (speaking ? "June's talking" : "Listening…")
    : status === "ended" ? "Call ended" : "Tap to try again";

  const scale = 1 + (live ? level * 0.22 : 0);
  const glow = live ? 22 + level * 90 : 14;

  return (
    <div className="flex flex-col items-center px-2 py-3 text-center">
      <button
        onClick={live || status === "connecting" ? undefined : startCall}
        aria-label={live ? "On a call with June" : "Start a voice call with June"}
        className="relative grid place-items-center rounded-full my-3"
        style={{
          width: 116, height: 116,
          background: "radial-gradient(circle at 35% 30%, #ff6a52, var(--accent))",
          transform: `scale(${scale})`,
          boxShadow: `0 0 ${glow}px ${glow / 2.4}px rgba(239,68,52,${live ? 0.24 + level * 0.4 : 0.18})`,
          cursor: live || status === "connecting" ? "default" : "pointer",
          opacity: status === "connecting" ? 0.75 : 1,
          transition: "box-shadow .08s linear",
        }}
      >
        {live && <span className="absolute inset-0 rounded-full border-2 border-orange animate-ping opacity-40" />}
        <span className="absolute top-2 right-6 h-3 w-3 rounded-full bg-lime ring-4 ring-lime/30" />
        <span className="text-paper">{I.mic(26)}</span>
      </button>

      <div className={`mt-1 min-h-[20px] font-grotesk text-sm font-medium transition-colors ${speaking ? "text-[#7a8500]" : "text-ink-mid"}`}>
        {label}
      </div>

      {status === "error" && errMsg && (
        <p className="mt-2 max-w-[30ch] text-[13px] text-ink-light">{errMsg}</p>
      )}

      <div className="mt-4 flex gap-2">
        {live && (
          <button onClick={toggleMute} className="rounded-full border border-border bg-shell px-5 py-2 text-[13px] font-semibold text-ink-mid hover:border-ink">
            {muted ? "Unmute" : "Mute"}
          </button>
        )}
        {live && (
          <button onClick={() => { endCall(); setStatus("ended"); }} className="rounded-full border border-orange/40 bg-orange/10 px-5 py-2 text-[13px] font-semibold text-orange hover:bg-orange/15">
            End call
          </button>
        )}
      </div>

      <p className="mt-5 text-[12.5px] text-ink-light">
        Rather type? Use <span className="font-semibold text-cobalt">Send a message</span> or have June call you.
      </p>
    </div>
  );
}

// ── capture form (Call me / Text me / Send a message) ────────────────────────
function Capture({ mode }: { mode: "call" | "text" | "message" }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [state, setState] = useState<"form" | "sending" | "done" | "error">("form");

  const copy = {
    call: { h: "June will give you a call", p: "Drop your number and one of us reaches out shortly. If now's not great, David or Bri follow up.", cta: "Have June call me" },
    text: { h: "June will text you", p: "Drop your number and we'll text you right here. Reply whenever works.", cta: "Have June text me" },
    message: { h: "Send us a message", p: "Tell us what you need. David or Bri read every message and get right back to you.", cta: "Send it" },
  }[mode];

  async function submit() {
    if (!name.trim() || (!phone.trim() && !email.trim())) return;
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formType: mode === "message" ? "contact" : "schedule",
          name, phone, email, message: msg,
          requestType: mode === "call" ? "voice-callback" : mode === "text" ? "text-back" : "web-message",
          source: "thelindleyteam.com · June widget",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="px-2 py-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-limewash text-[#5f6a00]">{I.check()}</div>
        <h3 className="font-serif text-lg italic text-ink">You&rsquo;re set</h3>
        <p className="mx-auto mt-1 max-w-[30ch] text-[13.5px] text-ink-mid">
          {mode === "text" ? "June will text you in a moment." : mode === "call" ? "June will give you a call shortly." : "Message sent. David or Bri will be in touch."}
        </p>
      </div>
    );
  }

  const inputCls = "w-full rounded-xl border border-border bg-shell px-3 py-3 text-sm text-ink outline-none placeholder:text-ink-light focus:border-orange focus:bg-paper";

  return (
    <div className="px-1 pt-2">
      <h3 className="mb-1 text-center font-serif text-xl italic text-ink">{copy.h}</h3>
      <p className="mx-auto mb-4 max-w-[34ch] text-center text-[13.5px] leading-relaxed text-ink-mid">{copy.p}</p>
      <div className="flex flex-col gap-2.5">
        <input className={inputCls} placeholder="First name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
        {mode !== "message" ? (
          <input className={inputCls} type="tel" placeholder="(971) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
        ) : (
          <>
            <input className={inputCls} type="tel" placeholder="Phone (or email below)" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            <textarea className={inputCls} rows={3} placeholder="What can we help with?" value={msg} onChange={(e) => setMsg(e.target.value)} />
          </>
        )}
        <button
          onClick={submit}
          disabled={state === "sending" || !name.trim() || (!phone.trim() && !email.trim())}
          className="mt-1 h-11 rounded-xl bg-orange font-grotesk text-sm font-semibold text-paper transition-colors hover:brightness-95 disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : copy.cta}
        </button>
        {state === "error" && (
          <p className="text-center text-[12.5px] text-orange">That didn&rsquo;t go through. Try again, or call 971-754-1771.</p>
        )}
      </div>
    </div>
  );
}

// ── the widget shell ─────────────────────────────────────────────────────────
export default function JuneWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("choose");
  // Stay out of the way on first paint — only surface once the visitor has
  // scrolled past the hero, so the launcher never covers the CTA above the fold.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const onScroll = () => setRevealed(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openWidget = () => { setView("choose"); setOpen(true); };

  return (
    <div className="fixed bottom-4 right-4 z-[70] font-grotesk sm:bottom-6 sm:right-6">
      <style>{`@keyframes june-rise{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}`}</style>
      {/* launcher — hidden until the visitor scrolls past the hero */}
      {!open && revealed && (
        <button
          onClick={openWidget}
          aria-label="Talk with June, the Lindley Team assistant"
          className="flex items-center gap-3 rounded-full bg-orange py-3 pl-3 pr-5 text-paper shadow-[0_10px_30px_rgba(239,68,52,0.3)] transition-transform hover:-translate-y-0.5"
          style={{ animation: "june-rise .26s cubic-bezier(.16,.84,.44,1) both" }}
        >
          <span className="relative grid h-8 w-8 flex-none place-items-center rounded-full bg-paper font-serif text-lg italic text-orange">
            J
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-orange bg-lime" />
          </span>
          <span className="text-left leading-none">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.18em] opacity-80">The Lindley Team</span>
            <span className="block text-[14.5px] font-semibold">Talk with June</span>
          </span>
        </button>
      )}

      {/* panel */}
      {open && (
        <div
          role="dialog"
          aria-label="June, the Lindley Team assistant"
          className="flex max-h-[min(650px,calc(100vh-2rem))] w-[min(384px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[22px] border border-border bg-paper shadow-[0_24px_70px_rgba(10,10,10,0.2)]"
          style={{ animation: "june-rise .26s cubic-bezier(.16,.84,.44,1) both" }}
        >
          {/* header */}
          <div className="flex flex-none items-center gap-3 border-b border-border px-4 py-3.5">
            {view !== "choose" && (
              <button onClick={() => setView("choose")} aria-label="Back" className="-ml-1 rounded-lg p-1 text-ink-mid hover:bg-shell hover:text-ink">
                {I.back()}
              </button>
            )}
            <span className="relative grid h-10 w-10 flex-none place-items-center rounded-full bg-orange font-serif text-xl italic text-paper">
              J
              <span className="absolute bottom-0.5 right-0 h-2.5 w-2.5 rounded-full border-2 border-paper bg-lime" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-serif text-lg italic leading-none text-ink">June</div>
              <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-light">The Lindley Team · assistant</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-ink-light hover:bg-shell hover:text-ink">
              {I.close()}
            </button>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {view === "choose" && (
              <>
                <p className="mx-0.5 mb-4 font-serif text-[19px] leading-snug text-ink">
                  Hi, I&rsquo;m June with <em className="italic text-orange">The Lindley Team.</em> How can I help?
                </p>

                <div className="mb-2 mx-0.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-light">Chat with me now</div>
                <div className="flex flex-col gap-2.5">
                  <ChoiceCard tone="voice" title="Talk to June" sub="Live voice, hands-free" icon={I.mic(21)} onClick={() => setView("voice")} />
                  <ChoiceCard tone="chat" title="Send a message" sub="Type it out, we&rsquo;ll reply" icon={I.chat(21)} onClick={() => setView("message")} />
                </div>

                <div className="mb-2 mt-5 mx-0.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-light">Or have me reach out</div>
                <div className="flex gap-2.5">
                  <ReachButton title="Call me" icon={I.phone()} tone="call" onClick={() => setView("call")} />
                  <ReachButton title="Text me" icon={I.sms()} tone="text" onClick={() => setView("text")} />
                </div>
              </>
            )}
            {view === "voice" && <VoiceCall />}
            {view === "call" && <Capture mode="call" />}
            {view === "text" && <Capture mode="text" />}
            {view === "message" && <Capture mode="message" />}
          </div>

          {/* footer */}
          <div className="flex-none border-t border-border px-4 py-2.5">
            <p className="text-center text-[10.5px] leading-snug text-ink-light">
              <span className="font-semibold text-ink-mid">The Lindley Team at Movement Mortgage</span> · NMLS #39179 · Not a commitment to lend. Terms and restrictions apply.
            </p>
          </div>

          <style>{`@keyframes june-rise{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </div>
  );
}

function ChoiceCard({ tone, title, sub, icon, onClick }: { tone: "voice" | "chat"; title: string; sub: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group flex w-full items-center gap-3.5 rounded-[15px] border border-border bg-paper px-4 py-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-orange hover:shadow-[0_6px_18px_rgba(239,68,52,0.1)]">
      <span className={`grid h-11 w-11 flex-none place-items-center rounded-[13px] ${tone === "voice" ? "bg-orange/10 text-orange" : "bg-limewash text-[#5f6a00]"}`}>{icon}</span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold leading-none text-ink">{title}</span>
        <span className="mt-1.5 block text-[12.5px] leading-tight text-ink-light">{sub}</span>
      </span>
      <span className="flex-none text-ink-light group-hover:text-orange">{I.chevron()}</span>
    </button>
  );
}

function ReachButton({ title, icon, tone, onClick }: { title: string; icon: React.ReactNode; tone: "call" | "text"; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-1 items-center justify-center gap-2 rounded-[13px] border border-border bg-shell px-3 py-3 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink hover:bg-paper">
      <span className={tone === "call" ? "text-orange" : "text-cobalt"}>{icon}</span>
      {title}
    </button>
  );
}
