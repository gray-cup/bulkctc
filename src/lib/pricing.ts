import { chaiProducts } from "@/data/chai-products";

// Single source of truth for pricing, shared by the cart/checkout client
// pages AND the server (create-payment/route.ts). Prices are never trusted
// from the client - the server always recomputes the order total itself
// from `items` using this module before creating a Cashfree payment link.

export const WEIGHTS = [1, 3, 5, 10, 20] as const;
export type Weight = (typeof WEIGHTS)[number];

export type CartLine = { slug: string; kg: number; quantity: number };

export function unitPriceForSlug(slug: string, kg: number): number {
  const product = chaiProducts.find((p) => p.slug === slug);
  if (!product) return 0;
  const prices = (product as { prices?: Record<number, number> }).prices;
  return prices?.[kg] ?? Math.round(product.pricePerKg * kg);
}

/**
 * Delivery is charged once per order, on the order's total weight (not per
 * line): flat ₹80 at or under 500g; ₹100 for the first kg, plus ₹60 for
 * every kg after that.
 */
export function deliveryFeeForGrams(totalGrams: number): number {
  if (totalGrams <= 500) return 80;
  const kg = totalGrams / 1000;
  return Math.round(100 + 60 * (kg - 1));
}

export function computeOrderTotal(items: CartLine[]): number {
  if (items.length === 0) throw new Error("No items in order");

  let subtotal = 0;
  let totalGrams = 0;
  for (const { slug, kg, quantity } of items) {
    const product = chaiProducts.find((p) => p.slug === slug);
    if (!product || !WEIGHTS.includes(kg as Weight) || quantity < 1) {
      throw new Error(`Invalid item: ${slug} / ${kg}kg`);
    }
    subtotal += unitPriceForSlug(slug, kg) * quantity;
    totalGrams += kg * 1000 * quantity;
  }

  return subtotal + deliveryFeeForGrams(totalGrams);
}
