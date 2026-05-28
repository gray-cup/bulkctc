import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { chaiProducts } from "@/data/chai-products";
import { generateTitle, generateDescription } from "@/lib/seo";
import { ProductBuySection } from "@/components/buy-samples/ProductBuySection";

const TIERS = [
  { label: "1kg",  kg: 1  },
  { label: "3kg",  kg: 3  },
  { label: "5kg",  kg: 5  },
  { label: "10kg", kg: 10 },
  { label: "20kg", kg: 20 },
] as const;

function tierPrice(product: { pricePerKg: number; prices?: Record<number, number> }, kg: number) {
  return product.prices?.[kg] ?? product.pricePerKg * kg;
}

function fmt(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return chaiProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = chaiProducts.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: generateTitle(`${product.name} — ${product.grade} CTC Tea`),
    description: generateDescription(
      `Buy ${product.name} (${product.grade}) in bulk — ${product.description} Starting from ${fmt(tierPrice(product, 3))} for 3 kg.`
    ),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = chaiProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-12">
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Portrait image */}
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-50">
          <Image
            src="/wholesale-chai.webp"
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details + buy */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-mono text-neutral-400 tracking-widest uppercase">{product.grade}</span>
            <h1 className="text-3xl font-bold text-neutral-900 mt-1">{product.name}</h1>
            <p className="mt-3 text-neutral-500 leading-relaxed">{product.description}</p>
          </div>

          {/* Pricing reference table */}
          <div className="border border-gray-200">
            <div className="grid grid-cols-3 text-xs font-medium text-neutral-400 uppercase tracking-wide px-4 py-2 border-b border-gray-100 bg-gray-50">
              <span>Bag size</span>
              <span className="text-center">Per kg</span>
              <span className="text-right">Total</span>
            </div>
            {TIERS.map((tier, i) => {
              const total = tierPrice(product, tier.kg);
              const perKg = Math.round(total / tier.kg);
              return (
                <div
                  key={tier.label}
                  className={`grid grid-cols-3 px-4 py-3 ${i < TIERS.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <span className="text-sm text-neutral-700 font-medium">{tier.label}</span>
                  <span className="text-sm text-neutral-400 text-center">{fmt(perKg)}/kg</span>
                  <span className="text-sm text-neutral-900 font-semibold text-right">{fmt(total)}</span>
                </div>
              );
            })}
          </div>

          {"delivery" in product && product.delivery ? (
            <p className="text-xs text-neutral-400">
              Delivery: ₹{(product.delivery as { upTo5kg: number; above5kg: number }).upTo5kg} up to 5 kg · ₹{(product.delivery as { upTo5kg: number; above5kg: number }).above5kg} above 5 kg · Direct from Assam gardens
            </p>
          ) : (
            <p className="text-xs text-neutral-400">
              Prices exclude shipping · Direct from Assam gardens
            </p>
          )}

          {/* Interactive buy section */}
          <ProductBuySection slug={product.slug} pricePerKg={product.pricePerKg} prices={"prices" in product ? product.prices as Record<number, number> : undefined} />

          <Link
            href="/buy-samples"
            className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> Browse all grades
          </Link>
        </div>
      </div>
    </div>
  );
}
