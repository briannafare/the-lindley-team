import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import BookingCalendar from "@/components/BookingCalendar";

export const metadata: Metadata = {
  title: "Contact The Lindley Team | Portland Mortgage | NMLS #1367416",
  description:
    "Reach Bri Lindley at The Lindley Team. Call, email, or schedule a time to talk — no sales pressure, no scripts. Portland mortgage lender licensed in OR & WA.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className="pt-[clamp(36px,6vh,72px)] pb-[clamp(80px,10vw,144px)] relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h1 className="font-serif text-[clamp(3rem,8vw,6rem)] font-semibold leading-[0.92] tracking-[-0.03em] mb-6">
              Let&apos;s<br />
              <em className="italic font-medium text-orange">Talk</em>
            </h1>
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[540px]">
              Tell us what&apos;s going on. You&apos;ll get a straight answer about what makes sense — even when the answer is &ldquo;not yet.&rdquo;
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Reach Us
              </h2>
              <div className="max-w-[820px] rounded-[1.5rem] border border-border bg-paper px-5 sm:px-7">
                {[
                  {
                    label: "Phone",
                    display: "(971) 754-1771",
                    href: "tel:9717541771",
                    isLink: true,
                  },
                  {
                    label: "Email",
                    display: "brianna.lindley@movement.com",
                    href: "mailto:brianna.lindley@movement.com",
                    isLink: true,
                  },
                  {
                    label: "Office",
                    display: "10135 SE Sunnyside Rd, Ste 125, Clackamas OR 97015",
                    href: null,
                    isLink: false,
                  },
                  {
                    label: "Hours",
                    display: "24/7 — answered by a real person, no voicemail",
                    href: null,
                    isLink: false,
                  },
                  {
                    label: "Licensed In",
                    display: "Oregon & Washington",
                    href: null,
                    isLink: false,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-baseline py-4 border-b border-border first:border-t"
                  >
                    <span className="text-[0.88rem] font-semibold text-ink shrink-0 mr-8">
                      {item.label}
                    </span>
                    {item.isLink && item.href ? (
                      <a
                        href={item.href}
                        className="text-[0.88rem] text-ink-mid font-normal sm:text-right hover:text-ink transition-colors"
                      >
                        {item.display}
                      </a>
                    ) : (
                      <span className="text-[0.88rem] text-ink-mid font-normal sm:text-right">
                        {item.display}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Schedule a Call — GHL Widget Placeholder */}
        <section id="schedule" className="py-16 border-t border-border bg-bg-alt scroll-mt-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Grab a Time
              </h2>
              <div className="max-w-[1120px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-10 max-w-[760px]">
                  Tell us where you are — buying, refinancing, divorce lending, or just exploring. No pitch, no pressure. Book a time below, or send a message and we&apos;ll reach out with an honest look at your situation.
                </p>
                <div className="grid items-start gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                  <div>
                    <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-ink-light mb-4">
                      Choose a time
                    </p>
                    {/* Self-serve booking — pulls the right GHL calendar per request type.
                        Set NEXT_PUBLIC_GHL_CAL_SCHEDULE (see .env.local.example). */}
                    <BookingCalendar type="schedule" />
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-ink-light mb-4">
                      Or send a message
                    </p>
                    <ContactForm formType="schedule" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                The Process
              </h2>
              <div className="max-w-[720px] grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Tell us your situation",
                    desc: "One call or email is all it takes. No judgment, no pressure. Just tell us where you are.",
                  },
                  {
                    step: "02",
                    title: "We review your options",
                    desc: "David or Bri runs your numbers and shows you the full picture — including options you might not have known existed.",
                  },
                  {
                    step: "03",
                    title: "Move when you&apos;re ready",
                    desc: "No artificial deadlines. Real advice whenever you're ready to act.",
                  },
                ].map((item) => (
                  <div key={item.step}>
                    <div className="font-display text-3xl font-extrabold text-border mb-2">
                      {item.step}
                    </div>
                    <h3 className="font-display text-lg font-bold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed">
                      {item.step === "03"
                        ? "No artificial deadlines. Real advice whenever you’re ready to act."
                        : item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Apply Online */}
        <section className="py-16 border-t border-border bg-bg-alt">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Apply Now
              </h2>
              <div className="max-w-[720px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-6">
                  Ready to move forward? Start your application online — it takes about 15 minutes and you can save your progress.
                </p>
                <a
                  href="/apply"
                  className="px-8 py-4 bg-ink text-white rounded-full text-[0.78rem] font-bold tracking-[0.04em] uppercase hover:scale-[1.03] hover:shadow-xl transition-all inline-flex items-center gap-2"
                >
                  Start Application <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Location / Map */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <div>
                <h2 className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-3">
                  Our Office
                </h2>
                <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed">
                  10135 SE Sunnyside Rd<br />
                  Ste 125<br />
                  Clackamas OR 97015
                </p>
              </div>
              <div className="rounded-[1.5rem] overflow-hidden border border-border" style={{ height: "400px" }}>
                <iframe
                  src="https://maps.google.com/maps?q=10135+SE+Sunnyside+Rd+Ste+125+Clackamas+OR+97015&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="The Lindley Team office location"
                />
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
