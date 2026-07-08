import Link from "next/link";

/**
 * VISION MOCKUP. The photos below are editorial STAND-INS to show how David & Bri
 * (as the beautiful, integral part of the page) will land. Replace each with a
 * generated/shot image of the real David & Bri in this exact style.
 */

function Vision({ tag }: { tag: string }) {
  return (
    <span className="absolute left-3 top-3 z-10 font-body text-[0.55rem] tracking-[0.16em] uppercase text-white/90 bg-ink/55 backdrop-blur-sm px-2 py-1 rounded-[2px]">
      {tag}
    </span>
  );
}

export default function MeetTheTeam() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(56px,8vw,120px)]">
      {/* section header */}
      <div className="flex items-baseline gap-3.5 border-t border-ink pt-4">
        <h2 className="font-grotesk font-extrabold text-[clamp(26px,3.4vw,46px)] leading-none tracking-[-0.02em]">
          The people part
        </h2>
        <sup className="font-body text-[12px] text-ink-light font-medium">(01)</sup>
        <span className="flex-1" />
        <Link
          href="/about"
          className="font-body text-[12px] tracking-[0.1em] uppercase font-semibold flex items-center gap-1.5 hover:text-orange transition-colors"
        >
          Our story <span className="w-1.5 h-1.5 rounded-full bg-orange inline-block" />
        </Link>
      </div>

      {/* lead: tall editorial portrait + woven story */}
      <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-[clamp(20px,3vw,56px)] mt-10 items-stretch">
        {/* portrait */}
        <div className="relative overflow-hidden rounded-[1.5rem] bg-ink/5 aspect-[4/5] lg:aspect-auto group">
          <Vision tag="Vision · David & Bri, this style" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/vision-portrait.jpg"
            alt="David & Bri (editorial portrait — vision)"
            className="w-full h-full object-cover img-bw transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        {/* story */}
        <div className="flex flex-col justify-center py-2">
          <p className="font-serif text-[clamp(30px,4.4vw,66px)] leading-[1.0] tracking-[-0.02em]">
            You&rsquo;re not buying a rate. You&rsquo;re choosing{" "}
            <em className="italic text-orange">who&rsquo;s in it with you.</em>
          </p>
          <p className="text-[clamp(15px,1.2vw,18px)] text-ink-mid leading-relaxed max-w-[48ch] mt-6">
            David &amp; Bri are two lenders on one team at Movement Mortgage. We read
            Portland by the neighborhood, tell you the truth about buying here, and
            stay in it with you from the first call to the keys.
          </p>

          {/* names, credited but elegant */}
          <div className="grid grid-cols-2 gap-6 mt-9 pt-7 border-t border-border">
            <div>
              <h3 className="font-serif text-[clamp(20px,2vw,28px)] leading-none">David Chandler</h3>
              <p className="font-body text-[0.68rem] tracking-[0.1em] uppercase text-ink-light mt-2">Loan Officer</p>
              <p className="font-body text-[0.68rem] tracking-[0.06em] uppercase text-orange mt-0.5">NMLS 265974</p>
            </div>
            <div>
              <h3 className="font-serif text-[clamp(20px,2vw,28px)] leading-none">Bri Lindley</h3>
              <p className="font-body text-[0.68rem] tracking-[0.1em] uppercase text-ink-light mt-2">Senior Loan Officer · CDLP</p>
              <p className="font-body text-[0.68rem] tracking-[0.06em] uppercase text-orange mt-0.5">NMLS 1367416</p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Link href="/apply" className="font-grotesk font-bold text-[15px] bg-ink text-paper px-6 py-3.5 rounded-[2px] hover:bg-orange transition-colors">
              Get pre-approved
            </Link>
            <Link href="/about" className="font-grotesk font-bold text-[15px] border border-ink px-6 py-3.5 rounded-[2px] hover:bg-ink hover:text-paper transition-colors">
              Meet the team
            </Link>
          </div>
        </div>
      </div>

      {/* supporting editorial pair — the work + the place */}
      <div className="grid md:grid-cols-2 gap-[clamp(16px,2vw,32px)] mt-[clamp(16px,2vw,32px)]">
        <div className="relative overflow-hidden rounded-[1.25rem] aspect-[16/10] bg-ink/5 group">
          <Vision tag="Vision · candid at work" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/team/vision-hands.jpg" alt="the work — vision" className="w-full h-full object-cover img-bw transition-transform duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="relative overflow-hidden rounded-[1.25rem] aspect-[16/10] bg-ink/5 group">
          <Vision tag="Vision · David & Bri, in Portland" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/team/vision-place.jpg" alt="in Portland — vision" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        </div>
      </div>
    </section>
  );
}
