import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="col-span-full grid min-h-96 place-items-center border border-zinc-200 text-center">
        <div><p className="text-2xl font-black uppercase">No products found.</p><p className="mt-2 text-sm text-brand-muted">Adjust the filters and try again.</p></div>
      </div>
    );
  }
  return (
    <div className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
