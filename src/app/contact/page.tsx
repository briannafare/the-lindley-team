import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

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
        <section className="pt-[clamp(24px,5vh,56px)] pb-20 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              <span className="text-[0.72rem] font-medium text-ink-mid tracking-[0.04em]">
                Usually responds within 2 hours during business hours
              </span>
            </div>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] font-extrabold leading-[0.95] tracking-tight mb-6">
              Let&apos;s<br />
              <span className="font-script font-normal text-orange text-[0.9em]">Talk</span>
            </h1>
            <p className="text-lg text-ink-mid font-normal leading-relaxed max-w-[540px]">
              No sales pressure. Tell us where you are and we&apos;ll tell you honestly what makes sense.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Reach Us
              </p>
              <div className="max-w-[720px]">
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
                    display: "Monday–Friday 8am–6pm · Saturday by appointment",
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
                    className="flex justify-between items-baseline py-4 border-b border-border first:border-t"
                  >
                    <span className="text-[0.88rem] font-semibold text-ink shrink-0 mr-8">
                      {item.label}
                    </span>
                    {item.isLink && item.href ? (
                      <a
                        href={item.href}
                        className="text-[0.88rem] text-ink-mid font-normal text-right hover:text-ink transition-colors"
                      >
                        {item.display}
                      </a>
                    ) : (
                      <span className="text-[0.88rem] text-ink-mid font-normal text-right">
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
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Book Time
              </p>
              <div className="max-w-[720px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-6">
                  Pick a time that works for you. These calls are low-key — no pitch, no pressure. Just an honest look at your situation.
                </p>
                {/* GHL Scheduling Widget — integrate here */}
                <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center">
                  <p className="text-ink-light text-sm">Scheduling widget coming soon</p>
                  <p className="text-ink-light text-xs mt-2">In the meantime, call (971) 754-1771</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-16 border-t border-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                The Process
              </p>
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
                    desc: "Bri will run your numbers and show you the full picture — including options you might not have known existed.",
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
              <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light">
                Apply Now
              </p>
              <div className="max-w-[720px]">
                <p className="text-[1.05rem] leading-[1.8] text-ink-mid font-normal mb-6">
                  Ready to move forward? Start your application online — it takes about 15 minutes and you can save your progress.
                </p>
                <a
                  href="/apply"
                  target="_blank"
                  rel="noopener noreferrer"
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
                <p className="text-[0.68rem] font-bold tracking-[0.2em] uppercase text-ink-light mb-3">
                  Our Office
                </p>
                <p className="text-[0.88rem] text-ink-mid font-normal leading-relaxed">
                  10135 SE Sunnyside Rd<br />
                  Ste 125<br />
                  Clackamas OR 97015
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ height: "400px" }}>
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
