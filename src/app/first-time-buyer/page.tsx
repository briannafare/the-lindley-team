import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import Btn from "@/components/Btn";

export const metadata: Metadata = {
  title: "First-Time Home Buyer in Portland | The Lindley Team at Movement Mortgage",
  description:
    "Buying your first home in Portland? David & Bri at Movement Mortgage walk you through down payment, credit, and Oregon assistance programs — no jargon, no pressure. Licensed OR & WA. NMLS #1367416 / #265974.",
  alternates: { canonical: "/first-time-buyer" },
};

const REASSURANCE = [
  { stat: "3%", label: "Down payment on many conventional loans — less on FHA/VA" },
  { stat: "OHCS", label: "Oregon down-payment assistance we help you tap" },
  { stat: "24–48h", label: "To a real answer on where you stand" },
];

const STEPS = [
  {
    no: "01",
    title: "A real first call",
    body: "No application and no credit pull — just a conversation about your situation and what buying in Portland actually takes. Bring questions. We like those.",
  },
  {
    no: "02",
    title: "Get a real answer",
    body: "We turn it around fast, and if you qualify, you get a pre-approval letter sellers take seriously — plus a clear monthly number so you're shopping in your real range, not guessing.",
  },
  {
    no: "03",
    title: "We close, on time",
    body: "We manage the paperwork, coordinate your agent and title, and keep the whole thing moving to the closing table. First-timers get more of our time, not less.",
  },
];

const FAQ = [
  {
    q: "How much do I really need for a down payment?",
    a: "Less than most people think. Many conventional loans start at 3% down, FHA at 3.5%, and VA at 0% for eligible buyers. Oregon's OHCS program can help cover part of your upfront costs, and sellers can sometimes chip in toward closing. We'll map out every option before you write an offer.",
  },
  {
    q: "My credit isn't perfect. Can I still buy?",
    a: "Probably. FHA loans go down to a 580 score, and there's no hard minimum on VA. If you're below the line, we'll give you a short, honest plan to get there instead of just saying no.",
  },
  {
    q: "Should I get pre-approved before I start looking?",
    a: "Yes. In Portland's market, listing agents expect a pre-approval letter with any serious offer — and it tells you exactly what you can afford so you don't fall for a house that's out of range.",
  },
  {
    q: "What does it cost to work with you?",
    a: "The first conversation is free and there's no pressure to move forward. You work directly with David or Bri — licensed loan officers, not a call center — backed by Movement Mortgage's in-house programs and pricing.",
  },
];

export default function FirstTimeBuyerPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        {/* Hero */}
        <section className="pt-[clamp(24px,5vh,56px)] pb-[clamp(32px,5vw,64px)]">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="font-body text-[0.7rem] tracking-[0.16em] uppercase text-ink-light mb-5">
              First-time buyers · Portland, OR
            </p>
            <h1 className="font-serif font-semibold text-[clamp(46px,9vw,132px)] leading-[0.92] tracking-[-0.03em]">
              You&rsquo;re closer than <br />
              <em className="italic font-medium text-orange">the internet says.</em>
            </h1>
            <div className="grid md:grid-cols-2 gap-8 md:gap-10 mt-[clamp(24px,4vw,44px)] items-start">
              <p className="max-w-[48ch] text-[clamp(15px,1.15vw,17px)] text-ink-mid leading-relaxed">
                Twenty minutes with your real numbers beats another year of guessing. Between 3%-down
                loans and Oregon assistance programs most people never hear about, first houses pencil
                out more often than the doom content admits. Let&rsquo;s run yours. That part&rsquo;s free.
              </p>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <Btn href="#start" variant="accent" size="lg">
                  Start with a free call
                </Btn>
                <Btn href="/apply" variant="outline" size="lg">
                  Apply now
                </Btn>
              </div>
            </div>
          </div>
        </section>

        {/* Reassurance band */}
        <section className="border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {REASSURANCE.map((r) => (
              <div key={r.label}>
                <div className="font-grotesk font-extrabold text-[clamp(34px,4vw,54px)] leading-none text-orange">
                  {r.stat}
                </div>
                <p className="text-[0.9rem] text-ink-mid leading-relaxed mt-3 max-w-[34ch]">{r.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-[clamp(40px,6vw,88px)]">
            <h2 className="font-serif text-[clamp(28px,4vw,56px)] leading-[1.0] tracking-[-0.02em] max-w-[20ch]">
              No jargon. No pressure. <em className="italic text-orange">Just a clear path.</em>
            </h2>
            <div className="grid md:grid-cols-3 gap-[clamp(20px,3vw,48px)] mt-12">
              {STEPS.map((s, i) => (
                <div key={s.no} className={i > 0 ? "md:pl-[clamp(20px,3vw,48px)] md:border-l border-border" : ""}>
                  <div className="font-grotesk font-extrabold text-[clamp(38px,5vw,68px)] leading-none text-orange">
                    {s.no}
                  </div>
                  <h3 className="font-serif text-[clamp(22px,2.4vw,34px)] leading-none tracking-[-0.01em] mt-5">
                    {s.title}
                  </h3>
                  <p className="text-[clamp(15px,1.1vw,17px)] text-ink-mid leading-relaxed mt-4 max-w-[38ch]">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Lead capture */}
        <section id="start" className="border-t border-border bg-bg-alt scroll-mt-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-[clamp(40px,6vw,88px)] grid lg:grid-cols-[1fr_1.1fr] gap-12">
            <div>
              <p className="font-body text-[0.7rem] tracking-[0.16em] uppercase text-ink-light mb-4">
                Start here
              </p>
              <h2 className="font-serif text-[clamp(30px,4.5vw,60px)] leading-[0.98] tracking-[-0.02em]">
                Tell us where you&rsquo;re at.
              </h2>
              <p className="text-[1.05rem] text-ink-mid leading-relaxed mt-5 max-w-[46ch]">
                Renting, browsing Zillow at midnight, or actually ready — doesn&rsquo;t matter.
                Send this over and David or Bri will come back with an honest read on your
                numbers, usually within two business hours. Then you&rsquo;ll know.
              </p>
              <p className="text-[0.85rem] text-ink-mid leading-relaxed mt-6">
                Prefer to talk now? Call{" "}
                <a href="tel:9717541771" className="text-orange font-semibold">(971) 754-1771</a>.
              </p>
            </div>
            <div>
              <ContactForm source="thelindleyteam.com/first-time-buyer" formType="first-time-buyer" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-[clamp(40px,6vw,88px)]">
            <h2 className="font-serif text-[clamp(28px,4vw,52px)] leading-none tracking-[-0.02em] mb-10">
              The questions everyone asks.
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-[1100px]">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <h3 className="font-grotesk font-bold text-[1.05rem] text-ink mb-2">{f.q}</h3>
                  <p className="text-[0.95rem] text-ink-mid leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mt-4 mb-[clamp(40px,7vw,100px)]">
          <div className="bg-ink text-paper rounded-[3px] px-[clamp(28px,5vw,80px)] py-[clamp(36px,5vw,80px)] grid md:grid-cols-[1.3fr_1fr] gap-8 md:items-end">
            <h2 className="font-serif font-semibold text-[clamp(32px,5vw,72px)] leading-[0.94] tracking-[-0.03em]">
              Find out what you can <em className="italic text-orange">actually afford.</em>
            </h2>
            <div className="md:justify-self-end md:text-right">
              <Btn href="#start" variant="paper" size="lg">
                Start with a free call
              </Btn>
              <span className="block mt-4 font-body text-[13px] tracking-[0.06em] uppercase text-paper/60">
                The Lindley Team · David &amp; Bri · OR &amp; WA
              </span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
