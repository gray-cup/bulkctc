import type { Metadata } from "next";
import { generateTitle, generateDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: generateTitle("Refunds & Cancellations"),
  description: generateDescription(
    "BulkCTC refund and cancellation policy for bulk CTC tea sample orders. Covers cancellation window, damaged goods, and refund timelines."
  ),
};

export default function RefundsPage() {
  return (
    <div className="max-w-3xl mx-auto min-h-screen py-3 sm:py-5 md:py-10 lg:py-20 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-6">
        Refunds & Cancellations
      </h1>

      <div className="prose prose-neutral text-sm leading-relaxed">
        <p className="text-neutral-400 mb-8">Last updated: May 20, 2025</p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">1. Cancellations</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            Orders can be cancelled within <strong>2 hours</strong> of payment, provided they have not yet been dispatched.
            Contact us at <a href="mailto:sales@bulkctc.com" className="text-blue-600 underline">sales@bulkctc.com</a> or
            WhatsApp with your order / payment link ID.
          </li>
          <li>
            Once dispatched, orders cannot be cancelled. You may initiate a return after delivery under the conditions
            described below.
          </li>
          <li>
            If we cancel your order for any reason (pricing error, stock unavailability, etc.), a full refund will be
            issued within 5–7 business days.
          </li>
        </ul>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">2. Returns</h2>
        <p className="mb-3">
          Due to the perishable nature of food products, we accept return requests only in the following cases:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li><strong>Damaged in transit</strong> — packaging visibly damaged or tampered on delivery.</li>
          <li><strong>Wrong product delivered</strong> — grade or product differs from what was ordered.</li>
          <li><strong>Significant quality defect</strong> — product is clearly unfit for consumption.</li>
        </ul>
        <p className="mb-4">
          Return requests must be raised within <strong>48 hours of delivery</strong> by emailing{" "}
          <a href="mailto:sales@bulkctc.com" className="text-blue-600 underline">sales@bulkctc.com</a> with:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Your order / payment link ID</li>
          <li>Clear photographs of the damaged or incorrect product</li>
          <li>A brief description of the issue</li>
        </ul>
        <p className="mb-4">
          We reserve the right to decline return requests that do not meet the above criteria or where the product
          has been opened, used, or stored improperly.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">3. Refunds</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            Approved refunds are processed within <strong>7–10 business days</strong> of confirmation.
          </li>
          <li>
            Refunds are credited back to the original payment method (UPI / card / net banking) used at checkout.
          </li>
          <li>
            Cashfree Payments processes refunds; your bank may take an additional 2–5 business days to reflect the amount.
          </li>
          <li>
            Shipping charges are non-refundable unless the return is due to our error.
          </li>
        </ul>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">4. Replacements</h2>
        <p className="mb-4">
          Where feasible, we may offer a replacement shipment instead of a refund for damaged or wrong deliveries.
          This will be communicated to you during the resolution process.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">5. Bulk / B2B Orders</h2>
        <p className="mb-4">
          Cancellation and refund terms for bulk orders (≥ 25 kg) are governed by the purchase order or contract
          agreed upon at the time of the transaction. Please refer to your order documentation or contact us directly.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">6. Contact</h2>
        <p className="mb-4">
          For any refund or cancellation queries, contact us at{" "}
          <a href="mailto:sales@bulkctc.com" className="text-blue-600 underline">sales@bulkctc.com</a> or visit our{" "}
          <a href="/contact" className="text-blue-600 underline">contact page</a>.
        </p>

        <p className="text-xs text-neutral-400 mt-10">
          Gray Cup Enterprises Private Limited · FF122, Rodeo Drive Mall, GT Road, TDI City, Kundli, Sonipat, Haryana 131030 · CIN: U47211DL2025PTC457808 · GST: 06AAMCG4985H1Z4
        </p>
      </div>
    </div>
  );
}
