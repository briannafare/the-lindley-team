import Link from "next/link";

const serviceLinks = [
  { name: "Purchase", href: "/services/purchase" },
  { name: "Refinance", href: "/services/refinance" },
  { name: "Divorce Lending", href: "/services/divorce-lending" },
  { name: "FHA Loans", href: "/services/fha" },
  { name: "VA Loans", href: "/services/va" },
  { name: "Jumbo", href: "/services/jumbo" },
  { name: "Cash-Out Refi", href: "/services/cash-out" },
  { name: "HELOC", href: "/services/heloc" },
  { name: "Investment", href: "/services/investment" },
  { name: "Reverse Mortgage", href: "/services/reverse-mortgage" },
];

const exploreLinks = [
  { name: "Neighborhoods", href: "/neighborhoods" },
  { name: "Calculator", href: "/calculator" },
  { name: "Journal", href: "/blog" },
  { name: "Reviews", href: "/reviews" },
  { name: "Resources", href: "/resources" },
];

const connectLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "971.754.1771", href: "tel:9717541771" },
  { name: "Email Us", href: "mailto:LindleyTeam@mtgxps.com" },
  {
    name: "Apply Now",
    href: "https://mtgxps.mymortgage-online.com/loan-app/?siteId=1878266072&lar=blindley&workFlowId=71729",
  },
];

export default function Footer() {
  return (
    <footer className="pt-16 pb-8 bg-paper-900 text-paper-50">
      <div className="max-w-container mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          <div>
            <div className="font-display text-[1.4rem] mb-4">The Lindley Team</div>
            <p className="text-sm text-paper-300/80 leading-relaxed max-w-[300px]">
              Portland&apos;s field guide that happens to do mortgages. David
              &amp; Bri Lindley — licensed in Oregon and Washington.
            </p>
            <p className="instrument-label !text-paper-500 mt-6">
              45.52° n / 122.68° w · portland, or.
            </p>
          </div>
          <FooterCol title="services" links={serviceLinks} />
          <FooterCol title="explore" links={exploreLinks} />
          <FooterCol title="connect" links={connectLinks} />
        </div>

        <div className="pt-6 border-t border-paper-50/10">
          <p className="text-[0.7rem] text-paper-400/70 leading-relaxed max-w-[860px]">
            Not a commitment to lock or lend. Terms and restrictions apply. Not
            all applicants will qualify. Mortgage Express, LLC. NMLS Company ID:
            40831 | mtgxps.com | Licensed in OR/WA. Mortgage Express is an Equal
            Housing Lender. 15115 SW Sequoia Parkway, Suite 100, Portland, OR
            97224.
          </p>
          <div className="flex flex-wrap justify-between items-center mt-6 gap-4">
            <span className="instrument-label !text-paper-500">
              © {new Date().getFullYear()} the lindley team · nmls #1367416
            </span>
            <div className="flex gap-5">
              {[
                { label: "facebook", href: "https://www.facebook.com/TammiLindleyTeam/" },
                { label: "instagram", href: "https://www.instagram.com/thelindleyteam" },
                { label: "linkedin", href: "https://www.linkedin.com/in/brianna-lindley-80673015/" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instrument-label !text-paper-400 hover:!text-paper-50 transition-colors duration-200"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
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
      <h4 className="instrument-label !text-paper-500 mb-5">{title}</h4>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="block text-sm text-paper-300/80 mb-2.5 hover:text-paper-50 transition-colors duration-200"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
