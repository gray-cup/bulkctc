import { Metadata } from "next";
import { generateTitle, generateDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: generateTitle("Privacy Policy"),
  description: generateDescription(
    "BulkCTC privacy policy — how we collect, use, and protect your personal data when you order bulk CTC tea or use our website."
  ),
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto min-h-screen py-3 sm:md-py-5 md:py-10 lg:py-20">
      <h1 className="text-3xl font-bold text-neutral-800 mb-6">
        Privacy Policy
      </h1>

      <div className="prose prose-neutral">
        <p className="text-muted-foreground mb-6">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Our Commitment to Privacy
        </h2>
        <p className="mb-4">
          At BulkCTC (Gray Cup Enterprises Private Limited), we take your privacy
          seriously. This Privacy Policy describes what personal information we
          collect, how we use it, and the choices you have regarding your
          information. Our primary goal is to provide a secure and trustworthy
          experience for all our customers.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Information We Collect
        </h2>
        <p className="mb-4">We collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Personal Information:</strong> Name, email address, phone
            number, and shipping address when you place an order or create an
            account.
          </li>
          <li>
            <strong>Payment Information:</strong> Payment details processed
            securely through our payment partners. We do not store your complete
            payment card details on our servers.
          </li>
          <li>
            <strong>Order Information:</strong> Details of products purchased,
            order history, and delivery preferences.
          </li>
          <li>
            <strong>Usage Data:</strong> Information about how you use our
            website, including pages visited, time spent, and browsing patterns.
          </li>
          <li>
            <strong>Device Information:</strong> Information about the device
            and browser you use to access our website.
          </li>
          <li>
            <strong>Communication Data:</strong> Records of correspondence when
            you contact us for support or inquiries.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Process and fulfill your orders</li>
          <li>Send order confirmations, shipping updates, and delivery notifications</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Improve our products, services, and website experience</li>
          <li>Send promotional communications (with your consent)</li>
          <li>Comply with legal obligations and protect against fraud</li>
          <li>Analyze usage patterns to enhance our services</li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Data Security
        </h2>
        <p className="mb-4">
          We implement appropriate technical and organizational security
          measures to protect your personal information against unauthorized
          access, alteration, disclosure, or destruction. This includes:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Secure Socket Layer (SSL) encryption for data transmission</li>
          <li>Secure payment processing through trusted payment gateways</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls limiting employee access to personal data</li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Data Retention
        </h2>
        <p className="mb-4">
          We retain your personal information only for as long as necessary to
          fulfill the purposes outlined in this privacy policy, or as required
          by law. Order and transaction records are retained as per applicable
          tax and accounting regulations in India.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Sharing of Information
        </h2>
        <p className="mb-4">
          We may share your information with:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Shipping Partners:</strong> To deliver your orders
          </li>
          <li>
            <strong>Payment Processors:</strong> To process your payments securely
          </li>
          <li>
            <strong>Service Providers:</strong> Who assist us in operating our website and business
          </li>
          <li>
            <strong>Legal Authorities:</strong> When required by law or to protect our rights
          </li>
        </ul>
        <p className="mb-4">
          We do not sell your personal information to third parties.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Cookies and Tracking
        </h2>
        <p className="mb-4">
          We use cookies and similar technologies to enhance your browsing
          experience, analyze website traffic, and understand user preferences.
          You can manage cookie preferences through your browser settings.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Your Rights
        </h2>
        <p className="mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information (subject to legal requirements)</li>
          <li>Opt-out of marketing communications</li>
          <li>Withdraw consent for data processing where applicable</li>
        </ul>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          International Data Transfers
        </h2>
        <p className="mb-4">
          For international orders, your information may be transferred to and
          processed in countries outside India. We ensure appropriate safeguards
          are in place to protect your data in accordance with applicable laws.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you
          of any significant changes by posting the new policy on this page and
          updating the &ldquo;Last updated&rdquo; date.
        </p>

        <h2 className="text-xl font-semibold text-neutral-800 mt-8 mb-4">
          Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or wish to
          exercise your rights, please contact us through our{" "}
          <a href="/contact" className="text-blue-700 underline">
            contact page
          </a>
          .
        </p>

        <p className="text-sm text-muted-foreground mt-10">
          Gray Cup Enterprises Private Limited · FF122, Rodeo Drive Mall, GT Road, TDI City, Kundli, Sonipat, Haryana 131030 · CIN: U47211DL2025PTC457808 · GST: 06AAMCG4985H1Z4
        </p>
      </div>
    </div>
  );
}
