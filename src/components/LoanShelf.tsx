import Link from "next/link";

// Modular loan-type grid — Met-style poster tiles: geometric line
// illustrations (orange ⇄ cobalt), hairline grid, one-line pitches.
const LOANS: {
  name: string;
  desc: string;
  href: string;
  shape: React.ReactNode;
}[] = [
  {
    name: "Conventional",
    desc: "The workhorse. As little as 3% down.",
    href: "/services/conventional",
    shape: <circle cx="24" cy="24" r="20" stroke="#E26125" strokeWidth="1.5" fill="none" />,
  },
  {
    name: "FHA",
    desc: "Flexible credit, 3.5% down.",
    href: "/services/fha",
    shape: (
      <>
        <circle cx="24" cy="24" r="20" stroke="#3554D9" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <circle cx="24" cy="24" r="9" stroke="#3554D9" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  {
    name: "VA",
    desc: "Zero down. You earned it.",
    href: "/services/va",
    shape: <path d="M24 4 L29 18 L44 18 L32 27 L36 42 L24 33 L12 42 L16 27 L4 18 L19 18 Z" stroke="#E26125" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  },
  {
    name: "Jumbo",
    desc: "For the price tags Portland calls normal.",
    href: "/services/jumbo",
    shape: (
      <>
        <rect x="6" y="6" width="36" height="36" stroke="#3554D9" strokeWidth="1.5" fill="none" />
        <rect x="14" y="14" width="20" height="20" stroke="#3554D9" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  {
    name: "New construction",
    desc: "Financing that keeps up with the build.",
    href: "/services/new-construction",
    shape: <polygon points="24,4 44,40 4,40" stroke="#E26125" strokeWidth="1.5" fill="none" strokeLinejoin="round" />,
  },
  {
    name: "Bank statement",
    desc: "Self-employed? Your deposits do the talking.",
    href: "/services/bank-statement",
    shape: (
      <>
        <path d="M6 34 C14 26, 20 40, 28 30 S 40 18, 44 14" stroke="#3554D9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="14" r="3" stroke="#3554D9" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  {
    name: "Investment & DSCR",
    desc: "The property qualifies — not your W-2.",
    href: "/services/dscr",
    shape: <rect x="9" y="9" width="30" height="30" stroke="#E26125" strokeWidth="1.5" fill="none" transform="rotate(45 24 24)" />,
  },
  {
    name: "HELOC & cash-out",
    desc: "Your equity, put to work.",
    href: "/services/heloc",
    shape: (
      <>
        <ellipse cx="24" cy="24" rx="20" ry="12" stroke="#3554D9" strokeWidth="1.5" fill="none" />
        <line x1="24" y1="12" x2="24" y2="36" stroke="#E26125" strokeWidth="1.5" />
      </>
    ),
  },
];

export default function LoanShelf() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(56px,8vw,120px)]">
      {/* section header */}
      <div className="flex items-baseline gap-3.5 border-t border-ink pt-4">
        <h2 className="font-grotesk font-extrabold text-[clamp(26px,3.4vw,46px)] leading-none tracking-[-0.02em]">
          Every loan on the shelf
        </h2>
        <sup className="font-body text-[12px] text-cobalt font-semibold">(02)</sup>
        <span className="flex-1" />
        <Link
          href="/services"
          className="font-body text-[12px] tracking-[0.1em] uppercase font-semibold flex items-center gap-1.5 hover:text-orange transition-colors"
        >
          All 16 types <span className="w-1.5 h-1.5 rounded-full bg-cobalt inline-block" />
        </Link>
      </div>

      {/* modular hairline grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-t border-border mt-8">
        {LOANS.map((loan) => (
          <Link
            key={loan.name}
            href={loan.href}
            className="group border-r border-b border-border p-[clamp(16px,2vw,28px)] flex flex-col gap-[clamp(20px,3vw,44px)] hover:bg-bg-alt transition-colors"
          >
            <svg
              viewBox="0 0 48 48"
              className="w-[clamp(34px,3.4vw,48px)] h-[clamp(34px,3.4vw,48px)] transition-transform duration-500 group-hover:rotate-[18deg] group-hover:scale-110"
              aria-hidden
            >
              {loan.shape}
            </svg>
            <div>
              <h3 className="font-grotesk font-bold text-[clamp(15px,1.4vw,19px)] tracking-[-0.01em] group-hover:text-orange transition-colors">
                {loan.name}
              </h3>
              <p className="text-[13px] text-ink-light leading-snug mt-1">{loan.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <p className="font-body text-[12px] text-ink-light mt-4">
        Plus USDA, reverse, down-payment assistance and more —{" "}
        <Link href="/services" className="text-ink underline hover:text-orange transition-colors">
          the full shelf lives here
        </Link>
        .
      </p>
    </section>
  );
}
