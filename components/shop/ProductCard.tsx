import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { primaryImage, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group min-w-0">
      <Link href={`/shop/${product.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow">
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <Image
            src={primaryImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 25vw"
            loading="lazy"
            className="object-cover transition duration-300 motion-reduce:transition-none group-hover:scale-[1.02]"
          />
          <span className="absolute left-3 top-3 bg-brand-black px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white">Performance tested</span>
          <div className="absolute inset-x-3 bottom-3 flex min-h-11 items-center justify-between bg-brand-yellow px-4 py-3 text-xs font-black uppercase tracking-widest text-black transition duration-150 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
            View product <ArrowUpRight className="size-4" />
          </div>
        </div>
        <div className="pt-4">
          <div className="flex justify-between gap-3">
            <h3 className="font-black uppercase tracking-tight">{product.name}</h3>
            <span className="shrink-0 text-sm font-black tabular-nums">{formatPrice(product.price)}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-brand-muted">{product.subtitle}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-brand-muted">Sizes {product.sizes.join(" / ")}</p>
        </div>
      </Link>
    </article>
  );
}
