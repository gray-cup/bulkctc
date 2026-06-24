import type { Metadata } from "next";
import { chaiProducts } from "@/data/chai-products";
import BuySamplesClient from "./BuySamplesClient";
import { generateTitle, generateDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: generateTitle("Order CTC Chai Samples — Bulk CTC Tea"),
  description: generateDescription(
    "Order sample bags of Kadak Chai, Tea Stall Chai, Hotel Chai and premium CTC blends. 1kg to 20kg bags shipped across India in 2–5 business days."
  ),
};

const BASE_URL = "https://bulkctc.com";
const PRICEVALIDUNTIL = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

function buildProductSchema(product: (typeof chaiProducts)[number]) {
  const prices = "prices" in product
    ? (product as { prices: Record<number, number> }).prices
    : undefined;
  const allPrices = prices
    ? Object.values(prices as Record<string, number>)
    : [product.pricePerKg];
  const lowPrice = Math.min(...allPrices);
  const highPrice = Math.max(...allPrices);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/buy-samples#${product.slug}`,
    name: product.name,
    description: product.description,
    image: `${BASE_URL}/wholesale-chai.webp`,
    url: `${BASE_URL}/buy-samples`,
    sku: `BCTC-${product.slug.toUpperCase()}`,
    brand: { "@type": "Brand", name: "BulkCTC" },
    category: "Food, Beverages & Tobacco > Food Items > Beverages > Tea & Infusions",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: lowPrice.toFixed(2),
      highPrice: highPrice.toFixed(2),
      offerCount: prices ? Object.keys(prices).length : 1,
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}/buy-samples`,
      seller: {
        "@type": "Organization",
        name: "BulkCTC",
        url: BASE_URL,
      },
      priceValidUntil: PRICEVALIDUNTIL,
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "INR",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export default function BuySamplesPage() {
  const productSchemas = chaiProducts.map(buildProductSchema);

  return (
    <>
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <BuySamplesClient />
    </>
  );
}
