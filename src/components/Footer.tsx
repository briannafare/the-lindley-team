import Link from "next/link";

const loanLinks = [
  { name: "Buy a home", href: "/services/purchase" },
  { name: "Refinance", href: "/services/refinance" },
  { name: "Conventional", href: "/services/conventional" },
  { name: "FHA", href: "/services/fha" },
  { name: "VA", href: "/services/va" },
  { name: "USDA", href: "/services/usda" },
  { name: "Jumbo", href: "/services/jumbo" },
  { name: "New construction", href: "/services/new-construction" },
  { name: "Self-employed", href: "/services/bank-statement" },
  { name: "DSCR / investor", href: "/services/dscr" },
  { name: "HELOC", href: "/services/heloc" },
  { name: "Cash-out refi", href: "/services/cash-out" },
  { name: "Reverse mortgage", href: "/services/reverse-mortgage" },
  { name: "Divorce lending", href: "/services/divorce-lending" },
  { name: "Down payment help", href: "/services/down-payment-assistance" },
  { name: "All loan types", href: "/services" },
];

const exploreLinks = [
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Journal", href: "/blog" },
  { name: "Portland guide", href: "/neighborhoods" },
];

const teamLinks = [
  { name: "Meet David & Bri", href: "/about" },
  { name: "Mortgage Calculators", href: "/calculators" },
];

export default function Footer() {
  return (
    <footer className="mt-[clamp(76px,9vw,140px)] bg-ink text-paper rounded-t-[3px]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px] pt-[clamp(40px,5vw,80px)] pb-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <h2 className="font-serif font-semibold text-[clamp(44px,7vw,104px)] leading-[0.88] tracking-[-0.035em]">
            Let&rsquo;s talk.
          </h2>
          <div className="flex flex-col items-start gap-3 pb-1.5 sm:items-end">
            <Link
              href="/contact#schedule"
              className="font-body text-[16px] font-medium text-paper underline decoration-paper/30 underline-offset-[6px] transition-colors hover:text-orange hover:decoration-orange"
            >
              Choose a time →
            </Link>
            <a href="tel:9717541771" className="font-body text-[14px] text-paper/65 transition-colors hover:text-orange">
              Call 971-754-1771
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-[0.85rem] leading-[2]">
          <FooterCol title="The team" links={teamLinks} />
          <FooterCol title="Loans" links={loanLinks} />
          <FooterCol title="Explore" links={exploreLinks} />
          <div className="min-w-0">
            <span className="block font-body text-[0.7rem] tracking-[0.14em] uppercase text-white/40 mb-2.5">
              Contact
            </span>
            <a href="tel:9717541771" className="block hover:text-orange transition-colors">971-754-1771</a>
            <a href="mailto:david.chandler@movement.com" className="block break-words hover:text-orange transition-colors">david.chandler@movement.com</a>
            <a href="mailto:brianna.lindley@movement.com" className="block break-words hover:text-orange transition-colors">brianna.lindley@movement.com</a>
          </div>
        </div>

        <div className="mt-11 pt-5 border-t border-white/10 flex flex-wrap items-end justify-between gap-4">
          <p className="text-[0.7rem] text-white/40 leading-[1.7] max-w-[82ch]">
            The Lindley Team at Movement Mortgage, LLC. Movement Mortgage, LLC is an Equal Housing Lender.
            NMLS ID #39179 (<a href="https://www.nmlsconsumeraccess.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70">www.nmlsconsumeraccess.org</a>).
            David Chandler NMLS #265974 · Brianna Lindley NMLS #1367416. Interest rates and products are subject to
            change without notice and may not be available at the time of loan commitment or rate lock. This is not a
            commitment to lend; terms and conditions apply; not all applicants will qualify. Licensed in OR &amp; WA.
            Movement Mortgage, LLC, 10135 SE Sunnyside Rd, Suite 125, Clackamas, OR 97015.
            © {new Date().getFullYear()} The Lindley Team. <a href="/privacy" className="underline hover:text-white/70">Privacy Policy</a>
          </p>
          <span className="font-serif italic text-[1.4rem] text-paper">David &amp; Bri</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <span className="block font-body text-[0.7rem] tracking-[0.14em] uppercase text-white/40 mb-2.5">
        {title}
      </span>
      {links.map((l) => (
        <Link key={l.name} href={l.href} className="block hover:text-orange transition-colors">
          {l.name}
        </Link>
      ))}
    </div>
  );
}
