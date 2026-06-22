import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="Delta home"
      className={cn(
        "relative block h-9 w-36 overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow",
        inverted && "invert",
        className,
      )}
    >
      <Image
        src="/images/delta-logo.png"
        alt="Delta Gym Wear"
        fill
        priority
        sizes="144px"
        className="object-cover"
      />
    </Link>
  );
}
