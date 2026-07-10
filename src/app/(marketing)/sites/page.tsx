import type { Metadata } from "next";
import Link from "next/link";
import { generateTitle, generateDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: generateTitle("Our Sites"),
  description: generateDescription(
    "Explore the informational websites owned and operated by Gray Cup, focused on bulk chai, CTC tea education, and loose-leaf tea knowledge."
  ),
};

export default function SitesPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      {/* Page Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Our Sites</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          GrayCup operates a group of informational websites focused on
          different aspects of tea — from bulk chai usage to CTC grading and
          loose-leaf tea education. All sites listed below are owned and
          operated by GrayCup.
        </p>
      </header>

      {/* Cards Grid */}
      <section className="grid gap-8 md:grid-cols-3">
        {/* BulkChai Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">BulkChai</h2>
          <p className="mt-3 text-gray-600">
            BulkChai is an informational platform focused on bulk chai usage and
            how chai is consumed at scale across cafés, offices, canteens, and
            retail environments.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Chai consumption at business scale</li>
            <li>Operational considerations for bulk brewing</li>
            <li>Common questions from bulk chai buyers</li>
          </ul>

          <Link
            href="https://bulkchai.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit bulkchai.com →
          </Link>
        </div>

        {/* BulkCTC Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">BulkCTC</h2>
          <p className="mt-3 text-gray-600">
            BulkCTC is dedicated to explaining CTC (Crush, Tear, Curl) tea —
            including grades, particle size, colour output, and consistency in
            bulk chai preparation.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>CTC tea grades and classification</li>
            <li>Dust vs fannings vs leaf behaviour</li>
            <li>Consistency and colour in bulk chai</li>
          </ul>

          <Link
            href="https://bulkctc.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit bulkctc.com →
          </Link>
        </div>

        {/* PureCha Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">PureCha</h2>
          <p className="mt-3 text-gray-600">
            PureCha focuses on loose-leaf and orthodox tea education, helping
            readers understand tea purity, processing methods, and leaf quality.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Loose-leaf and orthodox tea basics</li>
            <li>Processing methods and flavour impact</li>
            <li>Understanding tea beyond blends</li>
          </ul>

          <Link
            href="https://purecha.in"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit purecha.in →
          </Link>
        </div>

        {/* Indian Green Coffee Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900">Indian Green Coffee</h2>
          <p className="mt-3 text-gray-600">
            An origin guide to India&apos;s green coffee — Koraput, Halflong,
            Chikmagalur, and Bababudangiri estates, processing methods, and
            grading, for buyers researching where their coffee comes from.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
            <li>Growing regions and terroir</li>
            <li>Processing methods explained</li>
            <li>A catalogue of current lots</li>
          </ul>

          <Link
            href="https://indiangreencoffee.com"
            className="mt-6 inline-block font-medium text-primary-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit indiangreencoffee.com →
          </Link>
        </div>
      </section>

      {/* Ownership Note */}
      <section className="mt-16 max-w-3xl">
        <h3 className="text-xl font-semibold text-gray-900">
          Ownership & Transparency
        </h3>
        <p className="mt-3 text-gray-600">
          All websites listed on this page are owned and operated by GrayCup.
          Each platform serves a specific informational purpose while following
          the same standards of accuracy, clarity, and transparency.
        </p>
      </section>
    </main>
  );
}
