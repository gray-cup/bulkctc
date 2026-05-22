import Link from "next/link";
import Image from "next/image";

interface Props {
  className?: string;
}

export function UpiBtn({ className = "" }: Props) {
  return (
    <Link
      href="/buy-samples"
      className={`inline-flex items-center gap-2 border border-neutral-300 bg-white text-neutral-800 px-4 py-2 text-sm font-medium hover:border-neutral-500 hover:bg-neutral-50 transition-colors whitespace-nowrap ${className}`}
    >
      <Image src="/upi.svg" alt="UPI" width={36} height={13} className="shrink-0" />
      Buy with UPI
    </Link>
  );
}
