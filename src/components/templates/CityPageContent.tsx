import { notFound } from "next/navigation";
import Link from "next/link";
import { getCityInfoFromSlugs, getStateNameFromSlug, getRelatedCities, slugify } from "@/lib/cityData";
import { WhatsAppQuoteBtn } from "@/components/whatsapp-quote-btn";
import { ProductsSection } from "@/components/ProductsSection";
import { UpiBtn } from "@/components/upi-btn";

export function CityPageContent({ stateSlug, citySlug }: { stateSlug: string; citySlug: string }) {
  const cityInfo = getCityInfoFromSlugs(stateSlug, citySlug);
  if (!cityInfo) notFound();

  const stateName = getStateNameFromSlug(stateSlug);
  const relatedCities = getRelatedCities(citySlug, stateSlug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://bulkctc.com" },
        { "@type": "ListItem", position: 2, name: stateName, item: `https://bulkctc.com/${stateSlug}` },
        { "@type": "ListItem", position: 3, name: cityInfo.city, item: `https://bulkctc.com/${stateSlug}/${citySlug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `https://bulkctc.com/${stateSlug}/${citySlug}`,
      name: `BulkCTC — ${cityInfo.city}`,
      description: `Bulk CTC tea wholesale supplier serving ${cityInfo.city}, ${cityInfo.state}.`,
      url: `https://bulkctc.com/${stateSlug}/${citySlug}`,
      areaServed: [cityInfo.city, ...cityInfo.nearbyAreas].map((area) => ({
        "@type": "City",
        name: area,
      })),
      geo: {
        "@type": "GeoCoordinates",
        latitude: cityInfo.localContext.coordinates.lat,
        longitude: cityInfo.localContext.coordinates.lng,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: cityInfo.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  return (
    <div className="bg-white">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-neutral-400">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/available-locations" className="hover:text-neutral-900 transition-colors">Locations</Link>
          <span>/</span>
          <Link href={`/${stateSlug}`} className="hover:text-neutral-900 transition-colors">{stateName}</Link>
          <span>/</span>
          <span className="text-neutral-600">{cityInfo.city}</span>
        </nav>
      </div>

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
            Bulk CTC Tea — {stateName}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 leading-none mb-6">
            {cityInfo.city}
          </h1>
          <p className="text-lg text-neutral-600 leading-relaxed max-w-2xl mb-8">
            {cityInfo.cityContext}
          </p>
          <div className="flex flex-wrap gap-3">
            <WhatsAppQuoteBtn
              message={`Hi, I found your number on BulkCTC. I am from ${cityInfo.city}, ${stateName} and I would like to enquire about bulk CTC tea supply.`}
              className="px-6 py-2.5"
            />
            <UpiBtn />
            <Link
              href={`/${stateSlug}`}
              className="inline-block border border-neutral-300 px-6 py-2.5 text-sm font-medium text-neutral-600 hover:border-neutral-600 transition-colors"
            >
              All {stateName} Cities
            </Link>
          </div>
        </div>
      </section>

      <ProductsSection />

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-600 text-white p-5">
            <div className="text-2xl font-bold">{cityInfo.transitDays}</div>
            <div className="text-xs text-blue-200 mt-1 uppercase tracking-wide">Delivery Time</div>
          </div>
          <div className="bg-amber-600 text-white p-5">
            <div className="text-2xl font-bold">{cityInfo.supplyChain.moq}</div>
            <div className="text-xs text-amber-200 mt-1 uppercase tracking-wide">Min. Order Qty</div>
          </div>
          <div className="bg-neutral-600 text-white p-5">
            <div className="text-2xl font-bold">5+ Grades</div>
            <div className="text-xs text-neutral-300 mt-1 uppercase tracking-wide">CTC Varieties</div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Who Buys Bulk CTC in {cityInfo.city}
            </p>
            <p className="text-neutral-600 leading-relaxed">{cityInfo.usageFocus}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Industries Served
            </p>
            <div className="flex flex-wrap gap-2">
              {cityInfo.industries.map((industry) => (
                <span key={industry} className="bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
            CTC Tea Supply in {cityInfo.city}
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-4">
            {cityInfo.city} draws bulk CTC tea demand from its {cityInfo.industries.slice(0, 3).join(", ")} sectors. Institutional buyers — factory canteens, hotel chains, corporate campuses, and government offices — account for the majority of procurement. BulkCTC supplies these buyers directly from Assam and Dooars gardens, bypassing brokers to deliver consistent quality at wholesale prices.
          </p>
          <p className="text-neutral-600 leading-relaxed mb-4">
            The most commonly ordered grades for {cityInfo.city} include BP1 (Broken Pekoe) for medium-bodied daily brew, PF1 (Pekoe Fannings) for quick-brewing high-output kitchens, and PD (Pekoe Dust) for maximum colour and strength in mass canteens. All grades are available in {cityInfo.supplyChain.packagingSizes.join(", ")} bags.
          </p>
          <p className="text-neutral-600 leading-relaxed">
            Orders are shipped from {cityInfo.supplyChain.source} with a transit of {cityInfo.transitDays} to {cityInfo.city}. The minimum order quantity is {cityInfo.supplyChain.moq}. Businesses placing repeat orders can arrange scheduled dispatch — reach out on WhatsApp to set up a supply schedule.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-3">
          Nearby Areas Covered
        </p>
        <p className="text-neutral-600 leading-relaxed mb-4 max-w-2xl">
          Our delivery network covers {cityInfo.city} and extends to nearby areas including {cityInfo.nearbyAreas.join(", ")}. Businesses across this region receive the same grades, pricing, and transit times.
        </p>
        <div className="flex flex-wrap gap-2">
          {[cityInfo.city, ...cityInfo.nearbyAreas].map((area) => (
            <span key={area} className="bg-blue-600 text-white px-4 py-2 text-sm font-medium">
              {area}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-neutral-50 p-8 grid md:grid-cols-3 gap-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2">Source</p>
            <p className="text-neutral-900 font-medium">{cityInfo.supplyChain.source}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2">Min. Order</p>
            <p className="text-neutral-900 font-medium">{cityInfo.supplyChain.moq}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-2">Packaging</p>
            <p className="text-neutral-900 font-medium">{cityInfo.supplyChain.packagingSizes.join(", ")} bags</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-8">
          Frequently Asked Questions
        </p>
        <div className="divide-y divide-neutral-100">
          {cityInfo.faqs.map((faq, i) => (
            <div key={i} className="py-6 grid md:grid-cols-[40%_60%] gap-6">
              <h3 className="text-neutral-900 font-medium leading-snug">{faq.question}</h3>
              <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {relatedCities.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400 mb-6">
            Other Cities in {stateName}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedCities.map((related) => (
              <Link
                key={related.city}
                href={`/${stateSlug}/${slugify(related.city)}`}
                className="group flex items-center justify-between bg-neutral-50 px-6 py-4 hover:bg-neutral-900 transition-colors"
              >
                <div>
                  <div className="font-medium text-neutral-900 group-hover:text-white">
                    {related.city}
                  </div>
                  <div className="text-xs text-neutral-400 group-hover:text-neutral-400 mt-0.5">
                    {related.transitDays}
                  </div>
                </div>
                <span className="text-neutral-400 group-hover:text-white text-sm">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-neutral-900 text-white p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Start Bulk CTC Supply in {cityInfo.city}
            </h2>
            <p className="text-neutral-400 text-sm">
              Minimum {cityInfo.supplyChain.moq}. Delivery in {cityInfo.transitDays}.
            </p>
          </div>
          <WhatsAppQuoteBtn
            message={`Hi, I found your number on BulkCTC. I am from ${cityInfo.city}, ${stateName} and I would like to enquire about bulk CTC tea supply.`}
            label="Request Quote"
            className="px-8 py-3 whitespace-nowrap"
          />
        </div>
      </section>
    </div>
  );
}
