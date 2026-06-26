"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const sizes = ["S", "M", "L", "XL"];
const prices = [
  { label: "Under Rs. 3,500", value: "0-3500" },
  { label: "Rs. 3,500 - 6,000", value: "3500-6000" },
  { label: "Above Rs. 6,000", value: "6000-99999" },
];

export function FilterSidebar({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function option(key: string, value: string, label: string) {
    const checked = searchParams.get(key) === value;
    return (
      <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 py-2">
        <input type="checkbox" checked={checked} onChange={() => setFilter(key, value)} className="size-5 accent-black" />
        <span className="text-sm font-bold">{label}</span>
      </label>
    );
  }

  return (
    <aside aria-label="Product filters">
      <Accordion type="multiple" defaultValue={["category", "size", "price"]}>
        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>{categories.map((category) => option("category", category.slug, category.name))}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>{sizes.map((size) => option("size", size, size))}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger>Price range</AccordionTrigger>
          <AccordionContent>{prices.map((price) => option("price", price.value, price.label))}</AccordionContent>
        </AccordionItem>
      </Accordion>
      {searchParams.size > 0 && (
        <button onClick={() => router.replace(pathname)} className="mt-5 min-h-11 text-xs font-black uppercase tracking-widest underline decoration-brand-yellow decoration-2 underline-offset-4">
          Clear all filters
        </button>
      )}
    </aside>
  );
}
