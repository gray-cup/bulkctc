import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Placed | BulkCTC",
  description: "Your chai sample order has been placed.",
};

export default function BuySamplesSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">Order placed!</h1>
          <p className="text-neutral-500">
            Your sample order has been received. We&apos;ll pack and dispatch within 2–3 business days.
          </p>
        </div>
        <div className="border border-gray-200 bg-gray-50 p-4 text-sm text-neutral-600 text-left space-y-1">
          <p>• You&apos;ll receive an SMS confirmation shortly.</p>
          <p>• Delivery takes 3–5 days after dispatch.</p>
          <p>• Questions? Reach us on the <Link href="/contact" className="underline">contact page</Link>.</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> Back to BulkCTC
        </Link>
      </div>
    </div>
  );
}
