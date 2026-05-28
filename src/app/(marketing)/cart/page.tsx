"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { chaiProducts } from "@/data/chai-products";
import { getCart, saveCart, CART_EVENT, type CartItem } from "@/lib/cart";
import { CheckoutForm } from "@/components/buy-samples/CheckoutForm";

const WEIGHTS = [1, 3, 5, 10, 20] as const;
type Weight = (typeof WEIGHTS)[number];

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

function getPrice(product: (typeof chaiProducts)[number], kg: number): number {
  const prices = "prices" in product ? (product as { prices: Record<number, number> }).prices : undefined;
  return prices?.[kg] ?? product.pricePerKg * kg;
}

type EnrichedItem = CartItem & { product: (typeof chaiProducts)[number] };

function WeightDropdown({
  product,
  kg,
  onChange,
  showPrice = false,
}: {
  product: (typeof chaiProducts)[number];
  kg: Weight;
  onChange: (w: Weight) => void;
  showPrice?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
        className="flex items-center justify-between gap-2 border border-gray-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-gray-400 transition-colors cursor-pointer"
      >
        <span className="font-medium">{kg} kg</span>
        {showPrice && <span className="text-xs text-neutral-400">{fmt(getPrice(product, kg))}</span>}
        <svg className={`w-3.5 h-3.5 text-neutral-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 left-0 right-0 top-full mt-0.5 border border-gray-200 bg-white shadow-lg min-w-[120px]">
          {WEIGHTS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => { onChange(w); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                w === kg ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-50"
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

function OtherProductCard({
  product,
  onAdded,
}: {
  product: (typeof chaiProducts)[number];
  onAdded: (slug: string, kg: number, qty: number) => void;
}) {
  const [kg, setKg] = useState<Weight>(3);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAdded(product.slug, kg, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="relative w-full aspect-[3/4]">
        <Image src="/wholesale-chai.webp" alt={product.name} fill className="object-cover" />
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

        <WeightDropdown product={product} kg={kg} onChange={setKg} showPrice />

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

        <p className="text-base font-semibold text-neutral-900">{fmt(getPrice(product, kg) * qty)}</p>

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

function CartPageInner() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCart(getCart());
    setMounted(true);
    const update = () => setCart(getCart());
    window.addEventListener(CART_EVENT, update);
    return () => window.removeEventListener(CART_EVENT, update);
  }, []);

  function updateItem(slug: string, oldKg: number, changes: Partial<CartItem>) {
    let updated = [...cart];
    const newKg = changes.kg ?? oldKg;

    if (newKg !== oldKg) {
      const currentItem = updated.find((i) => i.slug === slug && i.kg === oldKg);
      const existingIdx = updated.findIndex((i) => i.slug === slug && i.kg === newKg);
      if (existingIdx >= 0 && currentItem) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + currentItem.quantity,
        };
        updated = updated.filter((i) => !(i.slug === slug && i.kg === oldKg));
      } else {
        updated = updated.map((i) =>
          i.slug === slug && i.kg === oldKg ? { ...i, ...changes } : i
        );
      }
    } else {
      updated = updated.map((i) =>
        i.slug === slug && i.kg === oldKg ? { ...i, ...changes } : i
      );
    }

    setCart(updated);
    saveCart(updated);
  }

  function removeItem(slug: string, kg: number) {
    const updated = cart.filter((i) => !(i.slug === slug && i.kg === kg));
    setCart(updated);
    saveCart(updated);
  }

  function addOtherProduct(slug: string, kg: number, qty: number) {
    const existing = cart.find((i) => i.slug === slug && i.kg === kg);
    const updated = existing
      ? cart.map((i) => (i.slug === slug && i.kg === kg ? { ...i, quantity: i.quantity + qty } : i))
      : [...cart, { slug, kg, quantity: qty }];
    setCart(updated);
    saveCart(updated);
  }

  const enriched: EnrichedItem[] = cart
    .map((item) => {
      const product = chaiProducts.find((p) => p.slug === item.slug);
      return product ? { ...item, product } : null;
    })
    .filter(Boolean) as EnrichedItem[];

  const total = enriched.reduce(
    (s, i) => s + getPrice(i.product, i.kg) * i.quantity,
    0
  );

  const cartSlugs = new Set(enriched.map((i) => i.slug));
  const otherProducts = chaiProducts.filter((p) => !cartSlugs.has(p.slug));

  if (!mounted) return <div className="min-h-screen" />;

  if (enriched.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4 lg:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">Your Cart</h1>
          <p className="text-neutral-500 mb-12">Your cart is empty. Add something below.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {chaiProducts.map((product) => (
              <OtherProductCard
                key={product.slug}
                product={product}
                onAdded={addOtherProduct}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 items-start">
          {/* Cart items */}
          <div className="border border-gray-200">
            {enriched.map((item, i) => (
              <div
                key={`${item.slug}-${item.kg}`}
                className={`flex gap-4 p-4 ${i < enriched.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="relative w-16 h-20 shrink-0 overflow-hidden bg-neutral-50">
                  <Image
                    src="/wholesale-chai.webp"
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">{item.product.name}</p>
                      <p className="text-xs text-neutral-400">{item.product.blend}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug, item.kg)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-sm cursor-pointer shrink-0 mt-0.5"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <WeightDropdown
                      product={item.product}
                      kg={item.kg as Weight}
                      onChange={(w) => updateItem(item.slug, item.kg, { kg: w })}
                    />

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1
                            ? updateItem(item.slug, item.kg, { quantity: item.quantity - 1 })
                            : removeItem(item.slug, item.kg)
                        }
                        className="w-7 h-7 border border-gray-200 text-neutral-600 hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateItem(item.slug, item.kg, { quantity: item.quantity + 1 })
                        }
                        className="w-7 h-7 border border-gray-200 text-neutral-600 hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-neutral-900 ml-auto">
                      {fmt(getPrice(item.product, item.kg) * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <p className="text-sm font-semibold text-neutral-900">Total</p>
              <p className="text-sm font-semibold text-neutral-900">{fmt(total)}</p>
            </div>
          </div>

          {/* Checkout panel */}
          <div className="sticky top-8 border border-gray-200 p-5">
            <CheckoutForm
              products={enriched.map((i) => i.slug)}
              quantityTier={enriched
                .map((i) => `${i.quantity}×${i.kg}kg ${i.product.name}`)
                .join(", ")}
              totalAmount={total}
            />
          </div>
        </div>

        {/* Other products */}
        {otherProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">You might also want</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherProducts.map((product) => (
                <OtherProductCard
                  key={product.slug}
                  product={product}
                  onAdded={addOtherProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CartPageInner />
    </Suspense>
  );
}
