import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Landing page for the move postcard's QR code. Tammi's video plays here and one
// tap saves the team's new contact info. Not a search page, so it stays noindex.
// ponytail: plain YouTube iframe + a static .vcf in /public. No client JS needed.

const VIDEO_ID = "b9Oo-0J1b4A";
const PHONE = "971-754-1771";
const EMAIL = "davidandbri@movement.com";
const BTN =
  "inline-flex items-center justify-center rounded-full bg-ink text-paper px-7 py-4 font-semibold text-[1rem] hover:bg-cobalt transition-colors";

export const metadata: Metadata = {
  title: "A message from Tammi",
  description: "Two minutes from Tammi, and the team's new contact info.",
  alternates: { canonical: "https://thelindleyteam.com/tammi" },
  robots: { index: false, follow: false },
};

export default function TammiPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper pt-[clamp(24px,5vh,56px)] pb-[clamp(56px,8vw,120px)]">
        {/* Always-visible save bar: the step the postcard exists for. Sits above the page, never dismissed. */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-[#D8F800] px-4 py-3">
          <div className="max-w-[720px] mx-auto flex items-center justify-between gap-3">
            <p className="text-[0.9rem] leading-snug text-ink">
              <span className="font-semibold">Save our new contact info.</span>{" "}
              <span className="hidden sm:inline">Same phone number, new email.</span>
            </p>
            <a href="/the-lindley-team.vcf" download="The Lindley Team.vcf" className={BTN + " shrink-0 !py-3 !px-5 text-[0.95rem]"}>
              Add to contacts
            </a>
          </div>
        </div>
        <div className="max-w-[720px] mx-auto px-5 lg:px-[54px]">
          <h1 className="font-serif font-semibold text-[clamp(36px,6vw,64px)] leading-[0.95] tracking-[-0.02em]">
            A message from Tammi
          </h1>
          <p className="mt-6 text-[0.95rem] text-ink-mid leading-relaxed max-w-[540px]">
            Tammi started this team in 2004. She wanted to tell you about the changes
            herself, so here she is. It&apos;s two minutes.
          </p>
          <a href="/the-lindley-team.vcf" download="The Lindley Team.vcf" className={BTN + " mt-6"}>
            Add our new contact info
          </a>
          <p className="mt-2 text-[0.85rem] text-ink-mid">One tap. Same phone number, new email.</p>

          <div className="mt-8 mx-auto w-full max-w-[400px] aspect-[9/16] rounded-[1.25rem] overflow-hidden border border-border bg-ink shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`}
              title="Tammi Lindley with a Lindley Team update"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <section className="mt-12 max-w-[540px]">
            <h2 className="font-serif font-semibold text-[clamp(24px,3.5vw,34px)] leading-[1.05] tracking-[-0.02em]">
              Save our new contact info
            </h2>
            <p className="mt-3 text-[0.95rem] text-ink-mid leading-relaxed">
              The Lindley Team is now at Movement Mortgage. Same phone number, new
              email. One tap adds both to your contacts.
            </p>
            <a href="/the-lindley-team.vcf" download="The Lindley Team.vcf" className={BTN + " mt-6"}>
              Add The Lindley Team to your contacts
            </a>
            <ul className="mt-6 space-y-2 text-[0.95rem]">
              <li>
                <span className="text-ink-mid">Call or text&nbsp;</span>
                <a className="underline underline-offset-4 hover:text-cobalt" href={`tel:+1${PHONE.replace(/-/g, "")}`}>{PHONE}</a>
              </li>
              <li>
                <span className="text-ink-mid">Email&nbsp;</span>
                <a className="underline underline-offset-4 hover:text-cobalt" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </li>
            </ul>
          </section>
        </div>
        <div className="h-20" aria-hidden="true" />
      </main>
      <div className="pb-20"><Footer /></div>
    </>
  );
}
