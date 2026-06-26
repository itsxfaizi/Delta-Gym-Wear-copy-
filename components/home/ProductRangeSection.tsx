"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";

type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  imageUrl: string;
  startingPrice: string | null;
  sizes: Array<{ size: string; isOutOfStock: boolean }>;
};

export function ProductRangeSection({ products }: { products: HomeProduct[] }) {
  const cards = products.slice(0, 5);
  const fallbackCards = Array.from({ length: Math.max(0, 5 - cards.length) }, (_, index) => index);

  return (
    <section className="bg-brand-black pb-24 pt-24 text-white lg:pb-28 lg:pt-28" aria-labelledby="product-range-title">
      <div className="mx-auto max-w-[1920px]">
        <h2 id="product-range-title" className="text-center text-2xl font-medium uppercase tracking-[-0.03em] sm:text-4xl">
          The product range
        </h2>

        <div className="mt-24 grid grid-flow-col auto-cols-[78vw] gap-3 overflow-x-auto px-0 pb-4 sm:auto-cols-[40vw] lg:grid-flow-row lg:grid-cols-5 lg:overflow-visible">
          {cards.map((product) => <ProductCard key={product.id} product={product} />)}
          {fallbackCards.map((card) => <ComingSoonCard key={card} index={card} />)}
        </div>

        <h2 className="pt-6 text-center text-2xl font-medium uppercase tracking-[-0.03em] sm:text-4xl">Product philosophy</h2>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: HomeProduct }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const price = product.startingPrice ? `From ${formatPrice(product.startingPrice)}` : "Coming Soon";

  return (
    <Link href={`/shop/${product.slug}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow">
      <article className="relative">
        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          {!imageLoaded && <Skeleton className="absolute inset-0 bg-zinc-200" aria-hidden="true" />}
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 40vw, 20vw"
            className="object-cover object-center transition duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute inset-x-3 bottom-3 translate-y-4 bg-brand-yellow px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-brand-black opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
            Quick add
          </div>
        </div>

        <div className="min-h-40 bg-brand-black px-3 py-7">
          <h3 className="text-sm font-semibold uppercase leading-5 tracking-[-0.02em]">{product.name}</h3>
          {product.subtitle && <p className="mt-2 text-xs leading-5 text-brand-muted">{product.subtitle}</p>}
          <p className="mt-2 text-sm font-medium text-white/85">{price}</p>
          {product.sizes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2" aria-label={`Available sizes for ${product.name}`}>
              {product.sizes.map((size) => (
                <span
                  key={size.size}
                  className="border border-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white data-[oos=true]:text-white/35 data-[oos=true]:line-through"
                  data-oos={size.isOutOfStock}
                  title={size.isOutOfStock ? `${size.size} out of stock` : `${size.size} in stock`}
                >
                  {size.size}
                  {size.isOutOfStock && <span className="ml-1">OOS</span>}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function ComingSoonCard({ index }: { index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <article className="block">
      <div className="relative aspect-[3/4] overflow-hidden bg-white">
        {!imageLoaded && <Skeleton className="absolute inset-0 bg-zinc-200" aria-hidden="true" />}
        <Image
          src={`https://picsum.photos/seed/delta-coming-soon-${index}/600/750`}
          alt="Coming Soon"
          fill
          loading="lazy"
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 40vw, 20vw"
          className="object-cover object-center grayscale"
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 grid place-items-center bg-black/25">
          <span className="bg-brand-black px-4 py-3 text-xs font-black uppercase tracking-widest text-white">Coming Soon</span>
        </div>
      </div>
      <div className="min-h-40 bg-brand-black px-3 py-7">
        <h3 className="text-sm font-semibold uppercase leading-5 tracking-[-0.02em]">Coming Soon</h3>
        <p className="mt-2 text-xs leading-5 text-brand-muted">New Delta product entering the range.</p>
        <p className="mt-2 text-sm font-medium text-white/85">From Rs. --</p>
        <div className="mt-4 flex gap-2" aria-hidden="true">
          {["S", "M", "L", "XL"].map((size) => (
            <span key={size} className="border border-white/20 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/35">
              {size}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
