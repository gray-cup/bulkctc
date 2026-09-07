const WA_URL =
  "https://wa.me/918527914317?text=" +
  encodeURIComponent("I'm interested in buying the website");

export function SaleBanner() {
  return (
    <div className="w-full bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black">
      This website is for sale at ₹25,000 —{" "}
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener"
        className="underline underline-offset-2"
      >
        Contact
      </a>
    </div>
  );
}
