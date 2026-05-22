import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const links = [
    { href: "/available-locations", label: "Locations" },
    { href: "/buy-samples", label: "Buy Samples" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/our-websites", label: "Our Websites" },
    { href: "/sitemap.xml", label: "Sitemap" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/refunds", label: "Refunds" },
    { href: "/shipping", label: "Shipping" },
  ];

  return (
    <footer className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-base font-bold tracking-tight text-neutral-900">BulkCTC</span>
            <p className="text-xs text-neutral-400 mt-1">
              Wholesale bulk CTC tea. Direct from Assam & Dooars gardens.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} BulkCTC. All rights reserved.</p>
            <span className="flex items-center gap-1.5 text-neutral-400">
              Powered by
              <Image src="/upi.svg" alt="UPI" width={32} height={12} />
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p>
              FSSAI: <span className="whitespace-nowrap">23326008000195</span>
              {" · "}
              IEC: <span className="whitespace-nowrap">AAMCG4985H</span>
            </p>
            <a
              href="https://graycup.org/"
              target="_blank"
              rel="noopener"
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              Gray Cup
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
