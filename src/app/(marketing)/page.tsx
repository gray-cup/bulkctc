import Link from "next/link";
import type { Metadata } from "next";
import { getAllCities, slugify } from "@/lib/cityData";
import { WhatsAppQuoteBtn, WHATSAPP_DEFAULT_MESSAGE } from "@/components/whatsapp-quote-btn";

export const metadata: Metadata = {
  title: "Bulk CTC Tea Supplier Across India | BulkCTC",
  description:
    "Wholesale bulk CTC tea for hotels, factories, offices, and institutions. Serving 25 states and 75+ cities across India. Direct from Assam and Dooars gardens.",
  alternates: { canonical: "/" },
};

const industries = [
  "Hotels & Hospitality",
  "FMCG & Retail",
  "Corporate Offices",
  "Manufacturing & Factories",
  "Educational Institutions",
  "Healthcare & Hospitals",
  "Government & PSUs",
  "Mining & Steel",
];

const grades = [
  { name: "BP1", desc: "Broken Pekoe — strong liquor, full-bodied" },
  { name: "PF1", desc: "Pekoe Fannings — quick brewing, consistent cup" },
  { name: "PD", desc: "Pekoe Dust — intense colour, high volume use" },
  { name: "BOPSM", desc: "Broken Orange Pekoe Small — medium grade" },
  { name: "BOPF", desc: "Broken Orange Pekoe Fannings — balanced brew" },
  { name: "D1", desc: "Dust 1 — economy grade for mass canteens" },
];

export default function Home() {
  const allCities = getAllCities();
  const states = Object.entries(allCities).slice(0, 12);
  const totalCities = Object.values(allCities).reduce(
    (acc, cities) => acc + Object.keys(cities).length,
    0
  );

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://bulkctc.com/#organization",
    name: "BulkCTC",
    legalName: "Gray Cup Enterprises Pvt. Ltd.",
    url: "https://bulkctc.com",
    logo: {
      "@type": "ImageObject",
      url: "https://bulkctc.com/logo.png",
      width: 512,
      height: 512,
    },
    description: "Wholesale bulk CTC tea supplier across India. Direct from Assam and Dooars gardens.",
    email: "bulk@graycup.in",
    foundingDate: "2019",
    sameAs: [
      "https://www.linkedin.com/company/gray-cup/",
      "https://www.instagram.com/thegraycup",
      "https://x.com/TheGrayCup",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "bulk@graycup.in",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    areaServed: "IN",
    additionalType: "http://www.productontology.org/id/Wholesaler",
  };

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
            Wholesale Bulk CTC Tea — India
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-neutral-900 leading-none mb-8">
            Bulk CTC Tea.
            <br />
            <span className="text-blue-600">Delivered.</span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-xl mb-10">
            Direct-from-garden CTC tea for businesses across India. {Object.keys(allCities).length} states,{" "}
            {totalCities}+ cities, 1–6 day delivery.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/available-locations"
              className="inline-block border border-neutral-600 hover:bg-neutral-100 px-8 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-800 transition-colors whitespace-nowrap"
            >
              Browse Locations
            </Link>
            <WhatsAppQuoteBtn message={WHATSAPP_DEFAULT_MESSAGE} className="px-7 py-3" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-600 text-white p-6">
            <div className="text-3xl font-bold">{Object.keys(allCities).length}</div>
            <div className="text-xs text-blue-200 mt-1 uppercase tracking-wide">States</div>
          </div>
          <div className="bg-amber-600 text-white p-6">
            <div className="text-3xl font-bold">{totalCities}+</div>
            <div className="text-xs text-amber-200 mt-1 uppercase tracking-wide">Cities</div>
          </div>
          <div className="bg-neutral-600 text-white p-6">
            <div className="text-3xl font-bold">1–6 days</div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wide">Delivery</div>
          </div>
          <div className="bg-neutral-900 text-white p-6">
            <div className="text-3xl font-bold">25 kg+</div>
            <div className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">Min. Order</div>
          </div>
        </div>
      </section>

      {/* Browse states */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-baseline justify-between mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Available Locations
          </p>
          <Link
            href="/available-locations"
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            View all {Object.keys(allCities).length} states →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {states.map(([stateName, cities]) => {
            const stateSlug = slugify(stateName);
            const cityNames = Object.keys(cities);
            return (
              <Link
                key={stateName}
                href={`/${stateSlug}`}
                className="group bg-neutral-50 p-4 hover:bg-neutral-900 transition-colors"
              >
                <div className="text-sm font-semibold text-neutral-900 group-hover:text-white mb-2">
                  {stateName}
                </div>
                <div className="text-xs text-neutral-400 group-hover:text-neutral-400 leading-relaxed">
                  {cityNames.slice(0, 3).join(", ")}
                </div>
              </Link>
            );
          })}
          <Link
            href="/available-locations"
            className="group bg-neutral-900 text-white p-4 flex items-center justify-center"
          >
            <span className="text-sm font-medium">
              +{Object.keys(allCities).length - 12} more states →
            </span>
          </Link>
        </div>
      </section>

      {/* Industries */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-8">
          Industries We Serve
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {industries.map((industry) => (
            <div key={industry} className="bg-neutral-50 p-5">
              <div className="text-sm font-medium text-neutral-900">{industry}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Grades */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-8">
          CTC Tea Grades
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {grades.map((grade, i) => (
            <div
              key={grade.name}
              className={`p-5 ${
                i % 3 === 0
                  ? "bg-blue-600 text-white"
                  : i % 3 === 1
                  ? "bg-amber-600 text-white"
                  : "bg-neutral-600 text-white"
              }`}
            >
              <div className="text-lg font-bold mb-1">{grade.name}</div>
              <div className="text-xs opacity-75 leading-relaxed">{grade.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-neutral-50 p-8 md:p-12 grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
              About BulkCTC
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4 leading-tight">
              Garden-to-canteen.<br />No middlemen.
            </h2>
            <p className="text-neutral-600 leading-relaxed">
              BulkCTC sources Crush-Tear-Curl tea directly from certified gardens in Assam and Dooars — India's premier CTC belt. We supply institutional buyers: factories, hotels, government offices, hospitals, and corporate campuses.
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Why BulkCTC
            </p>
            <div className="space-y-4">
              {[
                ["Direct sourcing", "No brokers — straight from garden to your premises."],
                ["Consistent grades", "Same quality lot after lot. BP1, PF1, PD and more."],
                ["Pan-India delivery", "25 states, 75+ cities. 1–6 day transit."],
                ["Flexible packaging", "25 kg, 50 kg, and 100 kg bags. Custom on request."],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-4">
                  <div className="w-1 bg-blue-600 shrink-0 mt-1" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">{title}</div>
                    <div className="text-sm text-neutral-500 mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
