import Link from "next/link";

export default function ColorBlockCTA() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(64px,9vw,130px)]">
      <div className="bg-cobalt text-white rounded-[3px] px-[clamp(28px,5vw,80px)] py-[clamp(40px,6vw,96px)] grid md:grid-cols-[1.3fr_1fr] gap-8 md:gap-10 md:items-end">
        <h2 className="font-serif font-semibold text-[clamp(38px,6vw,92px)] leading-[0.92] tracking-[-0.03em]">
          Start with the <em className="italic text-lime">block</em>, not the rate.
        </h2>
        <div className="md:justify-self-end md:text-right">
          <Link
            href="/neighborhoods"
            className="inline-block bg-lime text-ink font-grotesk font-bold text-[16px] px-7 py-4 rounded-[2px] hover:brightness-95 transition"
          >
            Find your neighborhood
          </Link>
          <span className="block mt-4 font-body text-[13px] tracking-[0.06em] uppercase text-white/70">
            or — talk to David &amp; Bri
          </span>
        </div>
      </div>
    </section>
  );
}
