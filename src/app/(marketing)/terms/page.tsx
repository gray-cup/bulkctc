import type { Metadata } from "next";
import { generateTitle, generateDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: generateTitle("Terms & Conditions"),
  description: generateDescription(
    "Terms and Conditions for BulkCTC — wholesale bulk CTC tea supplier. Governs purchases, pricing, delivery, and use of our website."
  ),
};

const PRODUCTS = [
  { name: "Tea Stall Chai",    grade: "D1",   pricePerKg: 155 },
  { name: "Kadak Chai",        grade: "PD",   pricePerKg: 195 },
  { name: "Hotel Chai",        grade: "PF1",  pricePerKg: 240 },
  { name: "3-Star Hotel Chai", grade: "BP1",  pricePerKg: 320 },
  { name: "5-Star Hotel Chai", grade: "BOPF", pricePerKg: 435 },
];

const SAMPLE_BAGS = [3, 5, 10, 20];

function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto min-h-screen py-3 sm:py-5 md:py-10 lg:py-20 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-6">Terms & Conditions</h1>

      <div className="prose prose-neutral text-sm leading-relaxed">
        <p className="text-neutral-400 mb-8">Last updated: May 20, 2025</p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">1. About Us</h2>
        <p className="mb-4">
          BulkCTC is a brand of Gray Cup Enterprises Private Limited (CIN: U47211DL2025PTC457808), engaged in the
          wholesale sourcing, packaging, and supply of CTC tea directly from gardens in Assam and Dooars. By placing
          an order or using this website you agree to these terms.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">2. Products & Services</h2>
        <p className="mb-4">
          We supply bulk CTC tea in the following grades. Sample bags (3 kg – 20 kg) can be ordered online at{" "}
          <a href="/buy-samples" className="text-blue-600 underline">bulkctc.com/buy-samples</a>.
          Bulk orders (25 kg and above) are fulfilled on request via WhatsApp or email.
        </p>

        {/* Pricing table */}
        <div className="my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-100">
                <th className="text-left px-3 py-2 font-semibold text-neutral-700 border border-gray-200">Product</th>
                <th className="text-left px-3 py-2 font-semibold text-neutral-700 border border-gray-200">Grade</th>
                <th className="text-right px-3 py-2 font-semibold text-neutral-700 border border-gray-200">Rate (INR/kg)</th>
                {SAMPLE_BAGS.map((kg) => (
                  <th key={kg} className="text-right px-3 py-2 font-semibold text-neutral-700 border border-gray-200">
                    {kg} kg bag
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p, i) => (
                <tr key={p.grade} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  <td className="px-3 py-2 border border-gray-200 text-neutral-800">{p.name}</td>
                  <td className="px-3 py-2 border border-gray-200 font-mono text-neutral-500">{p.grade}</td>
                  <td className="px-3 py-2 border border-gray-200 text-right text-neutral-800">{inr(p.pricePerKg)}</td>
                  {SAMPLE_BAGS.map((kg) => (
                    <td key={kg} className="px-3 py-2 border border-gray-200 text-right text-neutral-800">
                      {inr(p.pricePerKg * kg)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-neutral-400 text-xs mb-6">
          All prices are in Indian Rupees (INR) and are inclusive of applicable GST. Prices are subject to change without prior notice.
          Bulk order rates (≥ 25 kg) are negotiated separately.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">3. Ordering & Payment</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Orders are confirmed only after full payment is received.</li>
          <li>Payment is processed through Cashfree Payments, a PCI-DSS compliant gateway. We do not store card or UPI details.</li>
          <li>All transactions are in Indian Rupees (INR).</li>
          <li>We accept UPI, credit/debit cards, and net banking via the Cashfree payment link.</li>
          <li>We reserve the right to cancel any order in the event of a pricing error or stock unavailability, with a full refund issued.</li>
        </ul>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">4. Delivery</h2>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Sample orders are dispatched within 2–3 business days of payment confirmation.</li>
          <li>Delivery to most pin codes across India takes 3–5 business days after dispatch.</li>
          <li>Delivery timelines are estimates and may vary due to courier or weather disruptions.</li>
          <li>Shipping charges, if any, are shown at checkout before payment.</li>
        </ul>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">5. Cancellations & Refunds</h2>
        <p className="mb-4">
          See our dedicated{" "}
          <a href="/refunds" className="text-blue-600 underline">Refunds & Cancellations Policy</a>.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">6. Intellectual Property</h2>
        <p className="mb-4">
          All content on this website — including text, images, and branding — is the property of Gray Cup Enterprises
          Private Limited. You may not reproduce or redistribute any content without our prior written consent.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">7. Limitation of Liability</h2>
        <p className="mb-4">
          To the maximum extent permitted by law, BulkCTC / Gray Cup Enterprises Private Limited shall not be liable
          for any indirect or consequential damages. Our total liability shall not exceed the amount paid for the
          specific order in question.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">8. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of
          courts in New Delhi, India.
        </p>

        <h2 className="text-base font-semibold text-neutral-900 mt-8 mb-3">9. Contact</h2>
        <p className="mb-4">
          Questions about these terms? Reach us at{" "}
          <a href="mailto:legal@bulkctc.com" className="text-blue-600 underline">legal@bulkctc.com</a> or via our{" "}
          <a href="/contact" className="text-blue-600 underline">contact page</a>.
        </p>

        <p className="text-xs text-neutral-400 mt-10">
          Gray Cup Enterprises Private Limited · FF122, Rodeo Drive Mall, GT Road, TDI City, Kundli, Sonipat, Haryana 131030 · CIN: U47211DL2025PTC457808 · GST: 06AAMCG4985H1Z4
        </p>
      </div>
    </div>
  );
}
