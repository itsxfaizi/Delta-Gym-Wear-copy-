import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Shop Performance Gym Wear",
  description: "Shop Delta hoodies, compression tops, leggings, tanks, and technical training trousers.",
  openGraph: { title: "Shop Delta Gym Wear", description: "Performance apparel. Function first." },
};

function CatalogFallback() {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="aspect-[3/4]" />)}</div>;
}

export default function ShopPage() {
  return (
    <div className="bg-zinc-50 pb-24 pt-36">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-muted">Engineered essentials</p>
        <h1 className="mt-4 text-6xl font-black uppercase tracking-[-0.06em] sm:text-8xl">The range.</h1>
        <p className="mb-12 mt-5 max-w-xl font-medium leading-relaxed text-brand-muted">Every product is reduced to what matters: movement, structure, repeat performance.</p>
        <Suspense fallback={<CatalogFallback />}><ShopCatalog /></Suspense>
      </div>
    </div>
  );
}
