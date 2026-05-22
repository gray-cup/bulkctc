"use client";

import React, { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";

const TIERS = [
  { label: "3kg",  kg: 3  },
  { label: "5kg",  kg: 5  },
  { label: "10kg", kg: 10 },
  { label: "20kg", kg: 20 },
] as const;

type TierLabel = (typeof TIERS)[number]["label"];

type Props = {
  slug: string;
  pricePerKg: number;
};

export function ProductBuySection({ slug, pricePerKg }: Props) {
  const [tier, setTier]               = useState<TierLabel>("3kg");
  const [showCheckout, setShowCheckout] = useState(false);

  const tierData   = TIERS.find((t) => t.label === tier)!;
  const totalAmount = pricePerKg * tierData.kg;

  return (
    <div className="flex flex-col gap-4">
      {/* Tier selector */}
      <div className="flex gap-1.5 flex-wrap">
        {TIERS.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setTier(t.label)}
            className={`px-4 py-1.5 text-sm border font-medium transition-colors cursor-pointer ${
              tier === t.label
                ? "bg-neutral-900 border-neutral-900 text-white"
                : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="text-2xl font-bold text-neutral-900">
        ₹{totalAmount.toLocaleString("en-IN")}
      </p>

      {!showCheckout && (
        <button
          type="button"
          onClick={() => setShowCheckout(true)}
          className="w-full py-3 bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer active:scale-95"
        >
          Buy Now
        </button>
      )}

      {showCheckout && (
        <div className="border border-gray-200 p-5 mt-2">
          <CheckoutForm
            products={[slug]}
            quantityTier={tier}
            totalAmount={totalAmount}
            onBack={() => setShowCheckout(false)}
          />
        </div>
      )}
    </div>
  );
}
