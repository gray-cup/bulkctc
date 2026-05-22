"use client";

import React, { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/cart";

const WEIGHTS = [1, 3, 5, 10, 20] as const;
type Weight = (typeof WEIGHTS)[number];

type Props = {
  slug: string;
  pricePerKg: number;
  prices?: Record<number, number>;
};

export function ProductBuySection({ slug, pricePerKg, prices }: Props) {
  const [kg, setKg] = useState<Weight>(3);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const unitPrice = prices?.[kg] ?? pricePerKg * kg;
  const perKg = Math.round(unitPrice / kg);
  const total = unitPrice * qty;

  function handleAddToCart() {
    addToCart(slug, kg, qty);
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Weight selector */}
      <div className="flex gap-1.5 flex-wrap">
        {WEIGHTS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => { setKg(w); setAdded(false); }}
            className={`px-4 py-1.5 text-sm border font-medium transition-colors cursor-pointer ${
              kg === w
                ? "bg-neutral-900 border-neutral-900 text-white"
                : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            {w}kg
          </button>
        ))}
      </div>

      {/* Quantity stepper */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setQty((q) => Math.max(1, q - 1)); setAdded(false); }}
          className="w-8 h-8 border border-gray-200 text-neutral-600 hover:bg-gray-50 flex items-center justify-center text-lg cursor-pointer"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium text-neutral-900">{qty}</span>
        <button
          type="button"
          onClick={() => { setQty((q) => q + 1); setAdded(false); }}
          className="w-8 h-8 border border-gray-200 text-neutral-600 hover:bg-gray-50 flex items-center justify-center text-lg cursor-pointer"
        >
          +
        </button>
        <span className="text-xs text-neutral-400">{qty === 1 ? "bag" : "bags"}</span>
      </div>

      <div>
        <p className="text-2xl font-bold text-neutral-900">
          ₹{total.toLocaleString("en-IN")}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">
          ₹{perKg.toLocaleString("en-IN")}/kg
        </p>
      </div>

      {!added ? (
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-3 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer active:scale-95"
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="w-full py-3 bg-green-600 text-white text-sm font-semibold text-center">
            Added to Cart ✓
          </div>
          <Link
            href="/cart"
            className="w-full py-3 bg-neutral-900 text-white text-sm font-semibold text-center hover:bg-neutral-800 transition-colors"
          >
            View Cart →
          </Link>
        </div>
      )}
    </div>
  );
}
