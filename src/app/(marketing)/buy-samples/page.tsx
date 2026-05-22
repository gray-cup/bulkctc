"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { chaiProducts } from "@/data/chai-products";
import { addToCart } from "@/lib/cart";

const WEIGHTS = [3, 5, 10, 20] as const;
type Weight = (typeof WEIGHTS)[number];

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function ProductCard({ product }: { product: (typeof chaiProducts)[number] }) {
  const router = useRouter();
  const [kg, setKg] = useState<Weight>(3);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const price = product.pricePerKg * kg * qty;

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
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="block font-semibold text-sm text-neutral-900 hover:underline"
          >
            {product.name}
          </Link>
          <p className="text-xs text-neutral-400 mt-0.5">{product.blend}</p>
        </div>

        <select
          value={kg}
          onChange={(e) => setKg(Number(e.target.value) as Weight)}
          className="border border-gray-200 text-sm px-3 py-2 text-neutral-700 bg-white focus:outline-none focus:border-gray-400 cursor-pointer"
        >
          {WEIGHTS.map((w) => (
            <option key={w} value={w}>
              {w} kg — {fmt(product.pricePerKg * w)}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-8 h-8 border border-gray-200 text-neutral-600 hover:bg-gray-50 flex items-center justify-center text-lg leading-none cursor-pointer"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-medium text-neutral-900">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="w-8 h-8 border border-gray-200 text-neutral-600 hover:bg-gray-50 flex items-center justify-center text-lg leading-none cursor-pointer"
          >
            +
          </button>
          <span className="text-xs text-neutral-400">{qty === 1 ? "bag" : "bags"}</span>
        </div>

        <p className="text-base font-semibold text-neutral-900">{fmt(price)}</p>

        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full py-2.5 text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors cursor-pointer"
        >
          Buy Now
        </button>

        <button
          type="button"
          onClick={handleAdd}
          className={`w-full py-2.5 text-sm font-medium transition-colors cursor-pointer ${
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {chaiProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
}
