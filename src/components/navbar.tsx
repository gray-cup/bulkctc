"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { WhatsAppQuoteBtn, WHATSAPP_DEFAULT_MESSAGE } from "@/components/whatsapp-quote-btn";
import { getCart, CART_EVENT } from "@/lib/cart";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const update = () =>
      setCartCount(getCart().reduce((s, i) => s + i.quantity, 0));
    update();
    window.addEventListener(CART_EVENT, update);
    return () => window.removeEventListener(CART_EVENT, update);
  }, []);

  return (
    <>
      <header className="w-full bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-neutral-900">
                BulkCTC
              </span>
            </Link>

            <nav className="hidden md:flex gap-1 text-sm font-medium">
              {[
                ["Locations", "/available-locations"],
                ["About", "/about"],
                ["Contact", "/contact"],
                ["Buy Samples", "/buy-samples"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://graycup.org/"
                target="_blank"
                rel="noopener"
                className="px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                Company Website
              </a>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <Link
              href="/cart"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Cart
              {cartCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-semibold px-1.5 py-0.5 leading-none min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <WhatsAppQuoteBtn
              message={WHATSAPP_DEFAULT_MESSAGE}
              className="hidden md:inline-flex px-5 py-2"
            />

            {/* Hamburger */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 hover:bg-neutral-100 transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
        <aside
          className={`absolute right-0 top-0 h-full w-72 bg-white p-6
          transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            className="mb-6 p-2 hover:bg-neutral-100 transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <nav className="flex flex-col gap-1 text-sm font-medium">
            {[
              ["Locations", "/available-locations"],
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Buy Samples", "/buy-samples"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-2 py-3 text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="px-2 py-3 text-neutral-700 hover:text-neutral-900 transition-colors flex items-center gap-2"
            >
              Cart
              {cartCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-semibold px-1.5 py-0.5 leading-none min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <a
              href="https://graycup.org/"
              target="_blank"
              rel="noopener"
              className="px-2 py-3 text-neutral-700 hover:text-neutral-900 transition-colors"
            >
              Company Website
            </a>
          </nav>

          <div className="mt-6 flex flex-col gap-3">
            <WhatsAppQuoteBtn
              message={WHATSAPP_DEFAULT_MESSAGE}
              className="w-full justify-center px-5 py-2.5"
            />
          </div>
        </aside>
      </div>
    </>
  );
}
