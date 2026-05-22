"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/buy-samples/CheckoutForm";
import { chaiProducts } from "@/data/chai-products";

const TIERS = [
  { label: "3kg",  kg: 3  },
  { label: "5kg",  kg: 5  },
  { label: "10kg", kg: 10 },
  { label: "20kg", kg: 20 },
] as const;

type TierLabel = (typeof TIERS)[number]["label"];
type SelectedItem = { slug: string; tier: TierLabel };

function calcPrice(pricePerKg: number, kg: number) {
  return pricePerKg * kg;
}

function fmt(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

function AddProductCard({
  product,
  defaultTier,
  onAdd,
}: {
  product: (typeof chaiProducts)[number];
  defaultTier: TierLabel;
  onAdd: (tier: TierLabel) => void;
}) {
  const [tier, setTier] = useState<TierLabel>(defaultTier);
  const tierData = TIERS.find((t) => t.label === tier)!;
  const price = calcPrice(product.pricePerKg, tierData.kg);

  return (
    <div className="group flex flex-col border border-gray-200 bg-white overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="relative w-full aspect-[3/4]">
        <Image src="/wholesale-chai.png" alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Link href={`/products/${product.slug}`} className="font-semibold text-sm text-neutral-900 hover:underline">{product.name}</Link>
            <span className="text-xs text-neutral-400 font-mono">{product.grade}</span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">{product.description}</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {TIERS.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTier(t.label)}
              className={`px-3 py-1 text-sm border font-medium transition-colors cursor-pointer ${
                tier === t.label
                  ? "bg-neutral-900 border-neutral-900 text-white"
                  : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="text-base font-semibold text-neutral-900">{fmt(price)}</p>
        <div className="flex gap-1.5">
          <Link
            href={`/products/${product.slug}`}
            className="hidden group-hover:flex items-center justify-center py-2.5 px-3 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
          >
            Buy Now
          </Link>
          <button
            type="button"
            onClick={() => onAdd(tier)}
            className="flex-1 py-2.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}

function BuySamplesInner() {
  const searchParams = useSearchParams();
  const preselected  = searchParams.get("product");

  const [step,       setStep]       = useState<"select" | "checkout">("select");
  const [activeTier, setActiveTier] = useState<TierLabel>(() => {
    if (typeof window === "undefined") return "3kg";
    return (localStorage.getItem("ctc_tier") as TierLabel) ?? "3kg";
  });
  const [selected, setSelected] = useState<SelectedItem[]>(() => {
    if (typeof window === "undefined") return preselected ? [{ slug: preselected, tier: "3kg" }] : [];
    try {
      const raw = localStorage.getItem("ctc_selected");
      if (!raw) return preselected ? [{ slug: preselected, tier: "3kg" }] : [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return preselected ? [{ slug: preselected, tier: "3kg" }] : [];
      const normalized: SelectedItem[] = parsed.map((s: string | SelectedItem) =>
        typeof s === "string" ? { slug: s, tier: "3kg" as TierLabel } : s
      );
      if (preselected && !normalized.find((s) => s.slug === preselected)) {
        return [...normalized, { slug: preselected, tier: "3kg" }];
      }
      return normalized;
    } catch {
      return preselected ? [{ slug: preselected, tier: "3kg" }] : [];
    }
  });

  const selectedSlugs    = selected.map((s) => s.slug);
  const selectedProducts = selected
    .map((s) => {
      const product  = chaiProducts.find((p) => p.slug === s.slug);
      const tierData = TIERS.find((t) => t.label === s.tier)!;
      return product ? { product, tier: s.tier as TierLabel, tierData } : null;
    })
    .filter(Boolean) as { product: (typeof chaiProducts)[number]; tier: TierLabel; tierData: (typeof TIERS)[number] }[];

  const unselectedProducts = chaiProducts.filter((p) => !selectedSlugs.includes(p.slug));

  const orderTotal = selectedProducts.reduce(
    (sum, { product, tierData }) => sum + calcPrice(product.pricePerKg, tierData.kg),
    0,
  );

  const gridTier = TIERS.find((t) => t.label === activeTier)!;

  const toggle = (slug: string) =>
    setSelected((prev) =>
      prev.find((s) => s.slug === slug)
        ? prev.filter((s) => s.slug !== slug)
        : [...prev, { slug, tier: activeTier }],
    );

  const setItemTier = (slug: string, tier: TierLabel) =>
    setSelected((prev) => prev.map((s) => (s.slug === slug ? { ...s, tier } : s)));

  const tierCounts = selected.reduce((acc, s) => { acc[s.tier] = (acc[s.tier] ?? 0) + 1; return acc; }, {} as Record<string, number>);
  const quantityTier = (Object.entries(tierCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "3kg") as TierLabel;

  React.useEffect(() => { localStorage.setItem("ctc_selected", JSON.stringify(selected)); }, [selected]);
  React.useEffect(() => { localStorage.setItem("ctc_tier", activeTier); }, [activeTier]);
  React.useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [step]);

  /* ── STEP 1: product selection ───────────────────────────────────── */
  if (step === "select") {
    return (
      <div className="min-h-screen pb-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-12 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Order Chai Samples</h1>
          <p className="text-neutral-500 max-w-xl">
            Select the grades you want to try and choose your bag size. We ship directly from our Assam and Dooars gardens.
          </p>
        </div>

        {/* Bag size tabs */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pb-8">
          <div className="inline-flex gap-1 bg-gray-100 p-1">
            {TIERS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setActiveTier(t.label)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  activeTier === t.label
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {chaiProducts.map((product) => {
              const isSelected = selectedSlugs.includes(product.slug);
              const price = calcPrice(product.pricePerKg, gridTier.kg);
              return (
                <div
                  key={product.slug}
                  className={`group relative flex flex-col border bg-white transition-all duration-150 ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-400/30 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 z-10 bg-blue-600 text-white text-xs font-medium px-2 py-0.5">
                      Selected
                    </div>
                  )}
                  <div className="relative w-full aspect-[3/4]">
                    <Image src="/wholesale-chai.png" alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 p-4 gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/products/${product.slug}`} className="font-semibold text-sm text-neutral-900 hover:underline">{product.name}</Link>
                        <span className="text-xs text-neutral-400 font-mono">{product.grade}</span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">{product.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400">{gridTier.label} bag</p>
                      <p className="text-base font-semibold text-neutral-900">{fmt(price)}</p>
                    </div>
                    {/* Default: full-width select. On hover: two buttons side by side */}
                    <div className="flex gap-1.5">
                      <Link
                        href={`/products/${product.slug}`}
                        className="hidden group-hover:flex items-center justify-center h-9 px-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Buy Now
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggle(product.slug)}
                        className={`flex-1 h-9 cursor-pointer text-sm font-medium transition-colors ${
                          isSelected
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {isSelected ? "Remove" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky bottom bar */}
        <div
          className={`fixed bottom-0 inset-x-0 z-40 bg-amber-400 shadow-lg transition-transform duration-300 ${
            selected.length > 0 ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-neutral-900 text-sm">
                {selected.length} product{selected.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xl font-bold text-neutral-900">{fmt(orderTotal)}</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("checkout")}
              className="shrink-0 bg-neutral-900 text-white px-8 py-3 text-sm font-semibold hover:bg-neutral-800 transition-colors cursor-pointer active:scale-95"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── STEP 2: checkout ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Your order</h1>
        <p className="text-neutral-500 mb-8">Fill in your details and we&apos;ll ship your samples.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: form */}
          <CheckoutForm
            products={selectedSlugs}
            quantityTier={quantityTier}
            totalAmount={orderTotal}
            onBack={() => setStep("select")}
          />

          {/* Right: order summary */}
          <div className="border border-gray-200 sticky top-8 max-h-[80vh] overflow-y-auto">
            {selectedProducts.map(({ product, tier: itemTier, tierData }, i) => {
              const price = calcPrice(product.pricePerKg, tierData.kg);
              return (
                <div
                  key={product.slug}
                  className={`px-4 py-3 ${i < selectedProducts.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                          <p className="text-xs text-neutral-400 font-mono">{product.grade}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-sm font-semibold text-neutral-900">{fmt(price)}</p>
                          <button
                            type="button"
                            onClick={() => toggle(product.slug)}
                            className="text-gray-300 hover:text-red-400 transition-colors text-base leading-none cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      {/* Per-product tier selector */}
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {TIERS.map((t) => (
                          <button
                            key={t.label}
                            type="button"
                            onClick={() => setItemTier(product.slug, t.label)}
                            className={`px-3 py-1 text-sm border font-medium transition-colors cursor-pointer ${
                              itemTier === t.label
                                ? "bg-neutral-900 border-neutral-900 text-white"
                                : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {selectedProducts.length > 0 && (
              <div className="flex justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
                <p className="text-sm font-semibold text-neutral-900">Total</p>
                <p className="text-sm font-semibold text-neutral-900">{fmt(orderTotal)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Add more — card grid */}
        {unselectedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-semibold text-neutral-900 mb-1">Add more</h2>
            <p className="text-sm text-neutral-500 mb-6">Pick a size and add to your order.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {unselectedProducts.map((product) => (
                <AddProductCard
                  key={product.slug}
                  product={product}
                  defaultTier={activeTier}
                  onAdd={(tier: TierLabel) => {
                    setSelected((prev) => [...prev, { slug: product.slug, tier }]);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BuySamplesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <BuySamplesInner />
    </Suspense>
  );
}
