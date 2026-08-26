import Link from "next/link";
import Btn from "@/components/Btn";

export default function ColorBlockCTA() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(84px,10vw,158px)]">
      <div className="relative bg-ink text-paper rounded-[3px] px-[clamp(24px,5vw,80px)] py-[clamp(40px,6vw,96px)] grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 text-center md:text-left md:items-end overflow-hidden">
        {/* Cobalt line-art echo of the Afterglow illustration language */}
        <svg
          className="absolute -right-16 -top-16 w-[340px] h-[340px] opacity-[0.14] pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden
        >
          <circle cx="100" cy="100" r="96" stroke="#3554D9" strokeWidth="1" />
          <circle cx="100" cy="100" r="64" stroke="#3554D9" strokeWidth="0.75" strokeDasharray="3 5" />
          <path d="M40 130 L100 60 L160 130" stroke="#EF4434" strokeWidth="1.25" />
        </svg>

        <h2 className="relative font-serif font-semibold text-[clamp(34px,6vw,92px)] leading-[0.95] md:leading-[0.92] tracking-[-0.03em] text-balance">
          Come get the <em className="italic text-orange">honest</em> version.
        </h2>
        <div className="relative flex flex-col items-center md:items-end md:text-right">
          <Btn href="/contact#schedule" variant="paper" size="lg">
            Talk through your options
          </Btn>
          <Link
            href="/apply"
            className="block mt-6 font-body text-[15px] text-paper/70 hover:text-orange transition-colors"
          >
            Already know what you want? Apply now &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
