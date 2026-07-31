import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | The Lindley Team at Movement Mortgage",
  description:
    "How The Lindley Team and Movement Mortgage collect, use, and protect your personal information.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper pt-[clamp(24px,5vh,56px)] pb-[clamp(56px,8vw,120px)]">
        <div className="max-w-[860px] mx-auto px-5 lg:px-[54px]">
          <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-ink-light mb-5">
            Legal
          </p>
          <h1 className="font-serif font-semibold text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-[-0.02em]">
            Privacy Policy
          </h1>
          <p className="text-[0.85rem] text-ink-light mt-4">Last updated July 14, 2026</p>

          <div className="mt-10 space-y-8 text-[0.95rem] text-ink-mid leading-relaxed">
            <p>
              This policy explains what information The Lindley Team at Movement Mortgage
              (&ldquo;we,&rdquo; &ldquo;us&rdquo;) collects through thelindleyteam.com, how we use it, and the
              choices you have. It applies to this website; it doesn&apos;t cover the separate
              disclosures you&apos;ll receive once you apply for a loan through Movement Mortgage, LLC
              (NMLS ID #39179), which has its own privacy policy at{" "}
              <a href="https://movement.com/legal" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                movement.com/legal
              </a>.
            </p>

            <div>
              <h2 className="font-grotesk font-bold text-ink text-lg mb-2">What we collect</h2>
              <p>
                When you use a form on this site, book a consultation, or use our calculator, we
                collect what you enter — typically your name, email, phone number, and any
                message or loan scenario you share. We also collect standard technical
                information automatically (pages visited, browser type, general location from IP
                address) through analytics tools.
              </p>
            </div>

            <div>
              <h2 className="font-grotesk font-bold text-ink text-lg mb-2">How we use it</h2>
              <p>
                We use your information to respond to your inquiry, schedule appointments, and
                follow up about buying, refinancing, or other mortgage options — nothing beyond
                that scope. If you check the box consenting to calls and texts, we (or our
                marketing platform, acting on our behalf) may contact you by phone, SMS, or
                automated dialer about your inquiry. Consenting to contact is never a condition of
                getting a quote or working with us.
              </p>
            </div>

            <div>
              <h2 className="font-grotesk font-bold text-ink text-lg mb-2">Who we share it with</h2>
              <p>
                We use GoHighLevel/LeadConnector as our customer relationship platform to manage
                inquiries and follow-up, and standard web analytics tools. Once you formally apply
                for a loan, your information is also handled under Movement Mortgage&apos;s own
                privacy and data practices. We do not sell your personal information to third
                parties.
              </p>
            </div>

            <div>
              <h2 className="font-grotesk font-bold text-ink text-lg mb-2">Your choices</h2>
              <p>
                Reply STOP to any text message to opt out of texts, or tell us directly and
                we&apos;ll honor it. To ask what information we have on file, request a correction, or
                request deletion, email{" "}
                <a href="mailto:brianna.lindley@movement.com" className="underline hover:text-ink">
                  brianna.lindley@movement.com
                </a>{" "}
                or call{" "}
                <a href="tel:9717541771" className="underline hover:text-ink">
                  (971) 754-1771
                </a>.
              </p>
            </div>

            <div>
              <h2 className="font-grotesk font-bold text-ink text-lg mb-2">Cookies &amp; analytics</h2>
              <p>
                This site uses cookies and similar technology for basic analytics and to operate
                the site chat widget. You can block cookies in your browser settings; the site
                will still work, though some features (like the chat widget) may not.
              </p>
            </div>

            <div>
              <h2 className="font-grotesk font-bold text-ink text-lg mb-2">Contact</h2>
              <p>
                Questions about this policy: David Chandler or Bri Lindley, The Lindley Team at
                Movement Mortgage, 10135 SE Sunnyside Rd Ste 125, Clackamas OR 97015.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
