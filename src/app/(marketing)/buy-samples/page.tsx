"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { chaiProducts } from "@/data/chai-products";
import { addToCart } from "@/lib/cart";

const WEIGHTS = [1, 3, 5, 10, 20] as const;
type Weight = (typeof WEIGHTS)[number];

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function getPrice(product: (typeof chaiProducts)[number], kg: number): number {
  const prices = "prices" in product ? (product as { prices: Record<number, number> }).prices : undefined;
  return prices?.[kg] ?? product.pricePerKg * kg;
}

function WeightDropdown({
  product,
  kg,
  onChange,
}: {
  product: (typeof chaiProducts)[number];
  kg: Weight;
  onChange: (w: Weight) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 border border-gray-200 bg-white px-3 py-2.5 text-sm text-neutral-700 hover:border-gray-400 transition-colors cursor-pointer"
      >
        <span className="font-medium">{kg} kg</span>
        <span className="text-xs text-neutral-400">{fmt(getPrice(product, kg))}</span>
        <svg
          className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 left-0 right-0 top-full mt-0.5 border border-gray-200 bg-white shadow-lg">
          {WEIGHTS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => { onChange(w); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                w === kg
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <span className="font-medium">{w} kg</span>
              <span className={`text-xs ${w === kg ? "text-neutral-300" : "text-neutral-400"}`}>
                {fmt(getPrice(product, w))}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: (typeof chaiProducts)[number] }) {
  const router = useRouter();
  const [kg, setKg] = useState<Weight>(3);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const price = getPrice(product, kg) * qty;

  function handleAdd() {
    addToCart(product.slug, kg, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    router.push(`/checkout?slug=${product.slug}&kg=${kg}&qty=${qty}`);
  }

  return (
    <div className="flex flex-col border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="relative w-full aspect-[3/4]">
        <Image src="/wholesale-chai.png" alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col flex-1 p-3 gap-2.5">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="block font-semibold text-sm text-neutral-900 hover:underline"
          >
            {product.name}
          </Link>
          <p className="text-xs text-neutral-400 mt-0.5">{product.blend}</p>
        </div>

        <WeightDropdown product={product} kg={kg} onChange={setKg} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 border border-gray-200 text-neutral-600 hover:bg-gray-100 flex items-center justify-center text-xl font-medium cursor-pointer transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold text-neutral-900">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="w-10 h-10 border border-gray-200 text-neutral-600 hover:bg-gray-100 flex items-center justify-center text-xl font-medium cursor-pointer transition-colors"
          >
            +
          </button>
          <span className="text-xs text-neutral-400">{qty === 1 ? "bag" : "bags"}</span>
          <p className="text-base font-semibold text-neutral-900 ml-auto">{fmt(price)}</p>
        </div>

        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full py-3 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer"
        >
          Buy Now
        </button>

        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-3 text-sm font-medium transition-colors cursor-pointer ${
            added ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function BuySamplesPage() {
  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-12 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Order Chai Samples</h1>
        <p className="text-neutral-500 max-w-xl">
          Select the grades you want to try. Choose your bag size and quantity per product.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {chaiProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
