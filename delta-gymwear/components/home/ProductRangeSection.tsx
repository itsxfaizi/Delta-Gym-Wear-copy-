import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ProductRangeSection() {
  return (
    <section className="bg-white py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">The product range</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight sm:text-6xl">Built to perform.</h2>
          </div>
          <Link href="/shop" className="hidden min-h-11 items-center gap-2 text-xs font-black uppercase tracking-widest underline decoration-brand-yellow decoration-4 underline-offset-8 transition-colors duration-150 hover:text-brand-yellow sm:flex">Shop all <ArrowRight className="size-4" /></Link>
        </div>
        <ScrollArea className="-mx-4 pb-5 sm:-mx-6 lg:mx-0">
          <div className="flex snap-x gap-4 px-4 pb-5 sm:px-6 lg:grid lg:grid-cols-4 lg:px-0 2xl:grid-cols-5">
            {products.map((product) => <div key={product.id} className="w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto"><ProductCard product={product} /></div>)}
          </div>
        </ScrollArea>
      </div>
    </section>
  );
}
