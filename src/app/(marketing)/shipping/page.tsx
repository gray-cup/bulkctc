import type { Metadata } from "next";
import { generateTitle, generateDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: generateTitle("Shipping Policy"),
  description: generateDescription(
    "BulkCTC shipping policy — order processing timelines, domestic delivery, and tracking for bulk CTC tea orders across India."
  ),
};

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto min-h-screen py-3 sm:py-5 md:py-10 lg:py-20 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-6">Shipping Policy</h1>

      <div className="prose prose-neutral text-sm leading-relaxed">
        <p className="text-neutral-400 mb-8">Last updated: May 20, 2025</p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">1. Order Processing</h2>
        <p className="mb-4">
          Sample orders (3 kg – 20 kg) are processed and dispatched within <strong>2–3 business days</strong> of
          payment confirmation. You will receive an SMS notification with tracking details once your order has been
          dispatched.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Orders placed on weekends or public holidays are processed on the next business day.</li>
          <li>High-volume periods (festive season, harvest season) may occasionally extend processing time by 1–2 days.</li>
        </ul>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">2. Delivery Timelines</h2>
        <p className="mb-4">
          We ship to all serviceable pin codes across India through reputed courier partners.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li><strong>Metro & Tier-1 cities:</strong> 2–4 business days after dispatch</li>
          <li><strong>Tier-2 & Tier-3 cities:</strong> 3–5 business days after dispatch</li>
          <li><strong>Remote / hill areas:</strong> 5–8 business days after dispatch</li>
        </ul>
        <p className="mb-4">
          Delivery timelines are estimates. Delays caused by courier disruptions, weather events, or incorrect
          addresses provided by the buyer are outside our control.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">3. Shipping Charges</h2>
        <p className="mb-4">
          Shipping charges, if applicable, are calculated at checkout based on bag weight and delivery location and
          are shown before payment is made. All charges are in Indian Rupees (INR).
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">4. Order Tracking</h2>
        <p className="mb-4">
          Once dispatched, you will receive a tracking number via SMS (and email if provided). Use this number on
          the courier partner's website to track your shipment.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">5. Delivery Issues</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>
            <strong>Delayed delivery:</strong> Allow 2–3 additional business days beyond the estimated date before
            raising a concern.
          </li>
          <li>
            <strong>Damaged packaging:</strong> Photograph the damage before opening and contact us within 48 hours.
          </li>
          <li>
            <strong>Wrong product:</strong> Contact us immediately and we will arrange a replacement or refund.
          </li>
          <li>
            <strong>Undeliverable address:</strong> If a shipment is returned due to an incorrect address, re-shipping
            charges apply.
          </li>
        </ul>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">6. Bulk Orders (≥ 25 kg)</h2>
        <p className="mb-4">
          Bulk orders are handled separately and may be dispatched via dedicated freight, depending on volume and
          destination. Delivery timelines for bulk orders are agreed upon at the time of order confirmation.
          Contact us at <a href="mailto:sales@bulkctc.com" className="text-blue-600 underline">sales@bulkctc.com</a> for
          bulk pricing and logistics.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">7. Export</h2>
        <p className="mb-4">
          Gray Cup Enterprises Private Limited is an authorised exporter of tea (IEC: AAMCG4985H). International
          orders are handled on a case-by-case basis. Please contact us directly for export enquiries.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">8. Contact</h2>
        <p className="mb-4">
          For shipping queries, email{" "}
          <a href="mailto:sales@bulkctc.com" className="text-blue-600 underline">sales@bulkctc.com</a> or visit our{" "}
          <a href="/contact" className="text-blue-600 underline">contact page</a>.
        </p>

        <p className="text-xs text-neutral-400 mt-10">
          Gray Cup Enterprises Private Limited · FF122, Rodeo Drive Mall, GT Road, TDI City, Kundli, Sonipat, Haryana 131030 · CIN: U47211DL2025PTC457808 · FSSAI: 23326008000195 · IEC: AAMCG4985H
        </p>
      </div>
    </div>
  );
}
