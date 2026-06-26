import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { Skeleton } from "@/components/ui/skeleton";
import { getStorefrontCategories, getStorefrontProducts } from "@/lib/product-data";

export const metadata: Metadata = {
  title: "Shop Performance Gym Wear",
  description: "Shop Delta hoodies, compression tops, leggings, tanks, and technical training trousers.",
  openGraph: { title: "Shop Delta Gym Wear", description: "Performance apparel. Function first." },
};

function CatalogFallback() {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4]" />)}</div>;
}

export const revalidate = 3600;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getStorefrontProducts(), getStorefrontCategories()]);

  return (
    <div className="bg-zinc-50 pb-24 pt-44">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">Engineered essentials</p>
        <h1 className="mt-4 text-6xl font-black uppercase tracking-[-0.06em] sm:text-8xl">The range.</h1>
        <div className="mb-12 mt-5 flex flex-col justify-between gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end">
          <p className="max-w-xl font-medium leading-relaxed text-brand-muted">Every product is reduced to what matters: movement, structure, repeat performance.</p>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">Free delivery over PKR 25,000 · 14-day exchanges</p>
        </div>
        <Suspense fallback={<CatalogFallback />}><ShopCatalog products={products} categories={categories} /></Suspense>
      </div>
    </div>
  );
}
