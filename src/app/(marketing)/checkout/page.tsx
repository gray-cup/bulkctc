"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { chaiProducts } from "@/data/chai-products";
import { CheckoutForm } from "@/components/buy-samples/CheckoutForm";

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function CheckoutInner() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const kg = Number(searchParams.get("kg")) || 3;
  const qty = Number(searchParams.get("qty")) || 1;

  const product = chaiProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <p className="text-lg font-semibold text-neutral-900">Product not found.</p>
        <Link href="/buy-samples" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> Back to products
        </Link>
      </div>
    );
  }

  const unitPrice = ("prices" in product && product.prices)
    ? (product.prices as Record<number, number>)[kg] ?? product.pricePerKg * kg
    : product.pricePerKg * kg;
  const total = unitPrice * qty;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 lg:px-6">
        <Link
          href="/buy-samples"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> Back to products
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Order summary */}
          <div className="border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">Order Summary</p>
            </div>
            <div className="flex gap-4 p-4">
              <div className="relative w-16 h-20 shrink-0 overflow-hidden bg-neutral-50">
                <Image
                  src="/wholesale-chai.png"
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-900">{product.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{product.blend}</p>
                <div className="mt-3 space-y-1 text-xs text-neutral-500">
                  <p>{kg} kg bag × {qty}</p>
                  <p>{fmt(Math.round(unitPrice / kg))}/kg</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-neutral-900">Total</p>
              <p className="text-sm font-semibold text-neutral-900">{fmt(total)}</p>
            </div>
          </div>

          {/* Checkout form */}
          <div>
            <CheckoutForm
              products={[product.slug]}
              quantityTier={`${qty}×${kg}kg`}
              totalAmount={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CheckoutInner />
    </Suspense>
  );
}
