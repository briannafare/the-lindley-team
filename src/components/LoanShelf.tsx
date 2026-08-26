import Link from "next/link";

// Modular loan-type grid — Met-style poster tiles: geometric line
// illustrations (red ⇄ cobalt ⇄ lime), hairline grid, one-line pitches.
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
    shape: (
      <>
        <circle cx="24" cy="24" r="20" stroke="#EF4434" strokeWidth="1.5" fill="none" />
        <circle cx="24" cy="24" r="4" fill="#DDE84B" stroke="#000000" strokeWidth="1" />
      </>
    ),
  },
  {
    name: "FHA",
    desc: "Flexible credit, 3.5% down.",
    href: "/services/fha",
    shape: (
      <>
        <circle cx="24" cy="24" r="20" stroke="#3554D9" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        <circle cx="24" cy="24" r="9" stroke="#DDE84B" strokeWidth="2" fill="none" />
      </>
    ),
  },
  {
    name: "VA",
    desc: "Zero down. You earned it.",
    href: "/services/va",
    shape: (
      <>
        <path d="M24 4 L29 18 L44 18 L32 27 L36 42 L24 33 L12 42 L16 27 L4 18 L19 18 Z" stroke="#EF4434" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <circle cx="24" cy="24" r="4" fill="#DDE84B" />
      </>
    ),
  },
  {
    name: "Jumbo",
    desc: "For the price tags Portland calls normal.",
    href: "/services/jumbo",
    shape: (
      <>
        <rect x="6" y="6" width="36" height="36" stroke="#3554D9" strokeWidth="1.5" fill="none" />
        <rect x="14" y="14" width="20" height="20" stroke="#DDE84B" strokeWidth="2" fill="none" />
      </>
    ),
  },
  {
    name: "New construction",
    desc: "Financing that keeps up with the build.",
    href: "/services/new-construction",
    shape: (
      <>
        <polygon points="24,4 44,40 4,40" stroke="#EF4434" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <line x1="12" y1="33" x2="36" y2="33" stroke="#DDE84B" strokeWidth="3" strokeLinecap="round" />
      </>
    ),
  },
  {
    name: "Bank statement",
    desc: "Self-employed? Your deposits do the talking.",
    href: "/services/bank-statement",
    shape: (
      <>
        <path d="M6 34 C14 26, 20 40, 28 30 S 40 18, 44 14" stroke="#3554D9" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="44" cy="14" r="4" fill="#DDE84B" stroke="#000000" strokeWidth="1" />
      </>
    ),
  },
  {
    name: "Investment & DSCR",
    desc: "The property qualifies — not your W-2.",
    href: "/services/dscr",
    shape: (
      <>
        <rect x="9" y="9" width="30" height="30" stroke="#EF4434" strokeWidth="1.5" fill="none" transform="rotate(45 24 24)" />
        <rect x="19" y="19" width="10" height="10" fill="#DDE84B" />
      </>
    ),
  },
  {
    name: "HELOC & cash-out",
    desc: "Your equity, put to work.",
    href: "/services/heloc",
    shape: (
      <>
        <ellipse cx="24" cy="24" rx="20" ry="12" stroke="#3554D9" strokeWidth="1.5" fill="none" />
        <line x1="24" y1="12" x2="24" y2="36" stroke="#DDE84B" strokeWidth="3" />
        <circle cx="24" cy="24" r="3" fill="#EF4434" />
      </>
    ),
  },
];

export default function LoanShelf() {
  return (
    <section className="max-w-[1440px] mx-auto px-5 lg:px-[54px] mt-[clamp(76px,9vw,148px)]">
      {/* section header */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2 border-t border-ink pt-5">
        <h2 className="font-serif font-semibold text-[clamp(30px,3.8vw,52px)] leading-none tracking-[-0.025em]">
          Every loan on the shelf
        </h2>
        <Link
          href="/services"
          className="shrink-0 font-body text-[14px] font-medium underline decoration-ink/20 underline-offset-4 hover:text-orange hover:decoration-orange transition-colors"
        >
          All 16 types →
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

      <p className="font-body text-[14px] text-ink-light mt-5">
        Plus USDA, reverse, down-payment assistance and more —{" "}
        <Link href="/services" className="text-ink underline hover:text-orange transition-colors">
          the full shelf lives here
        </Link>
        .
      </p>
    </section>
  );
}
