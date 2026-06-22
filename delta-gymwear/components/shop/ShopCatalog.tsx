"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/products";
import { FilterSidebar } from "./FilterSidebar";
import { ProductGrid } from "./ProductGrid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type CategoryOption = { name: string; slug: string };

export function ShopCatalog({ products, categories }: { products: Product[]; categories: CategoryOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filtered = useMemo(() => {
    const category = searchParams.get("category");
    const size = searchParams.get("size");
    const price = searchParams.get("price");
      const sort = searchParams.get("sort") ?? "featured";
      let result = products.filter((product) => {
        const [min, max] = price?.split("-").map(Number) ?? [0, Infinity];
      return (!category || product.categorySlug === category) &&
        (!size || product.sizes.includes(size)) &&
        (!price || (product.price >= min && product.price <= max));
    });
    if (sort === "low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "newest") result = [...result].reverse();
    return result;
  }, [products, searchParams]);

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") params.delete("sort");
    else params.set("sort", value);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
      <div className="hidden lg:block"><FilterSidebar categories={categories} /></div>
      <div className="min-w-0">
        <div className="mb-7 grid grid-cols-[1fr_auto] items-center gap-3 sm:flex sm:justify-between">
          <p className="text-sm font-bold text-brand-muted">{filtered.length} products</p>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2 sm:flex sm:gap-3">
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" className="border-zinc-300 text-black lg:hidden"><SlidersHorizontal className="size-4" /> Filter</Button></SheetTrigger>
              <SheetContent side="left" title="Product filters" description="Choose category, size, or price filters."><h2 className="mb-8 text-3xl font-black uppercase">Filter products</h2><FilterSidebar categories={categories} /></SheetContent>
            </Sheet>
            <Select value={searchParams.get("sort") ?? "featured"} onValueChange={setSort}>
              <SelectTrigger aria-label="Sort products" className="w-full sm:w-52"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="low">Price Low-High</SelectItem>
                <SelectItem value="high">Price High-Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
