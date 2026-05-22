export type CartItem = { slug: string; kg: number; quantity: number };

const KEY = "ctc_cart";
const EVENT = "ctc_cart_updated";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export function addToCart(slug: string, kg: number, quantity: number): void {
  const cart = getCart();
  const existing = cart.find((i) => i.slug === slug && i.kg === kg);
  if (existing) {
    saveCart(cart.map((i) => (i.slug === slug && i.kg === kg ? { ...i, quantity: i.quantity + quantity } : i)));
  } else {
    saveCart([...cart, { slug, kg, quantity }]);
  }
}

export { EVENT as CART_EVENT };
