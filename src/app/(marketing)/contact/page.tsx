import type { Metadata } from "next";
import { generateTitle, generateDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: generateTitle("Contact Us"),
  description: generateDescription(
    "Contact BulkCTC for bulk CTC tea orders, samples, and trade enquiries. Reach us by email, phone, or WhatsApp."
  ),
};

const contacts = [
  {
    title: "Sales & Orders",
    desc: "New orders, bulk quotes, and trade enquiries.",
    email: "sales@bulkctc.com",
  },
  {
    title: "General Enquiries",
    desc: "Any other questions about our products or services.",
    email: "office@bulkctc.com",
  },
  {
    title: "Legal & Compliance",
    desc: "Legal notices, GST invoices, and compliance matters.",
    email: "legal@bulkctc.com",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto min-h-screen py-3 sm:py-5 md:py-10 lg:py-20 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Contact Us</h1>
      <p className="text-neutral-500 mb-10">
        We typically respond within one business day.
      </p>

      {/* Contact cards */}
      <div className="space-y-4 mb-12">
        {contacts.map((c) => (
          <div key={c.email} className="border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="font-semibold text-sm text-neutral-900">{c.title}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{c.desc}</p>
            </div>
            <a
              href={`mailto:${c.email}`}
              className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {c.email}
            </a>
          </div>
        ))}
      </div>

      {/* Business details */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          Business Details
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">Legal name</dt>
            <dd className="text-neutral-700">Gray Cup Enterprises Private Limited</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">Brand</dt>
            <dd className="text-neutral-700">BulkCTC</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">Address</dt>
            <dd className="text-neutral-700">FF122, Rodeo Drive Mall, GT Road, TDI City, Kundli, Sonipat, Haryana — 131030</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">CIN</dt>
            <dd className="text-neutral-700 font-mono">U47211DL2025PTC457808</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">GST</dt>
            <dd className="text-neutral-700 font-mono">06AAMCG4985H1Z4</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">FSSAI</dt>
            <dd className="text-neutral-700 font-mono">23326008000195</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">IEC</dt>
            <dd className="text-neutral-700 font-mono">AAMCG4985H</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-neutral-400">UPI</dt>
            <dd className="text-neutral-700 font-mono">graycup@kotak</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
