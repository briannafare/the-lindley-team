import Link from "next/link";

const loanLinks = [
  { name: "Buy a home", href: "/services/purchase" },
  { name: "Refinance", href: "/services/refinance" },
  { name: "Divorce lending", href: "/services/divorce-lending" },
  { name: "Calculator", href: "/calculator" },
];

const exploreLinks = [
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Journal", href: "/blog" },
  { name: "Portland guide", href: "/neighborhoods" },
];

const teamLinks = [
  { name: "Meet David & Bri", href: "/about" },
  { name: "Our story", href: "/about" },
  { name: "Calculator", href: "/calculator" },
];

export default function Footer() {
  return (
    <footer className="mt-[clamp(56px,7vw,110px)] bg-ink text-paper rounded-t-[3px]">
      <div className="max-w-[1440px] mx-auto px-5 lg:px-[54px] pt-[clamp(40px,5vw,80px)] pb-10">
        <h2 className="font-grotesk font-extrabold text-[clamp(40px,7vw,104px)] leading-[0.9] tracking-[-0.03em]">
          Let&rsquo;s talk.
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-[0.85rem] leading-[2]">
          <FooterCol title="The team" links={teamLinks} />
          <FooterCol title="Loans" links={loanLinks} />
          <FooterCol title="Explore" links={exploreLinks} />
          <div>
            <span className="block font-body text-[0.7rem] tracking-[0.14em] uppercase text-white/40 mb-2.5">
              Contact
            </span>
            <a href="tel:9717541771" className="block hover:text-orange transition-colors">971-754-1771</a>
            <a href="mailto:david.chandler@movement.com" className="block hover:text-orange transition-colors">david.chandler@movement.com</a>
            <a href="mailto:brianna.lindley@movement.com" className="block hover:text-orange transition-colors">brianna.lindley@movement.com</a>
          </div>
        </div>

        <div className="mt-11 pt-5 border-t border-white/10 flex flex-wrap items-end justify-between gap-4">
          <p className="text-[0.7rem] text-white/40 leading-[1.7] max-w-[72ch]">
            Movement Mortgage, LLC. NMLS #39179. David Chandler NMLS #265974 · Brianna Lindley NMLS #1367416.
            Equal Housing Lender. Not a commitment to lock or lend; terms and restrictions apply; not all applicants
            will qualify. Licensed in OR &amp; WA. © {new Date().getFullYear()} The Lindley Team.
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
