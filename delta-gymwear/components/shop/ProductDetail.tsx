"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Check, LockKeyhole, RefreshCcw, Ruler, Truck } from "lucide-react";
import { toast } from "sonner";
import { primaryImage, type Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/store/cart";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(primaryImage(product));
  const [size, setSize] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const add = useCartStore((state) => state.add);
  const selectedVariant = product.variants.find((variant) => variant.size === size);
  const displayPrice = selectedVariant?.price ?? product.price;
  const displayCompareAt = selectedVariant?.compareAt ?? product.compareAt;

  function addToCart() {
    if (!selectedVariant || selectedVariant.stock <= 0) return;
    add({
      id: selectedVariant.id,
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      price: selectedVariant.price,
      qty: 1,
      size: selectedVariant.size,
      image: primaryImage(product),
    });
    setAnnouncement(`${product.name}, size ${size}, added to cart.`);
    toast.success(`${product.name} added to cart.`);
  }

  return (
    <>
    <nav aria-label="Breadcrumb" className="mb-7 text-xs font-bold uppercase tracking-wider text-brand-muted">
      <Link href="/" className="hover:text-black">Home</Link> <span aria-hidden="true">/</span> <Link href="/shop" className="hover:text-black">Shop</Link> <span aria-hidden="true">/</span> <span className="text-black">{product.name}</span>
    </nav>
    <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      <div>
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-900">
          <Image src={activeImage} alt={`${product.name} product view`} fill preload sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {product.images.map((image, index) => (
            <button key={`${image}-${index}`} onClick={() => setActiveImage(image)} aria-label={`View image ${index + 1}`} className={`relative aspect-square overflow-hidden border-2 outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ${activeImage === image ? "border-brand-yellow" : "border-transparent"}`}>
              <Image src={image} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-muted">{product.category}</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-7xl">{product.name}</h1>
        <p className="mt-5 inline-flex bg-zinc-100 px-3 py-2 text-xs font-black uppercase tracking-wider">Designed for repeat training</p>
        <div className="mt-5 flex items-center gap-3">
          <p className="text-xl font-black tabular-nums">{formatPrice(displayPrice)}</p>
          {displayCompareAt && displayCompareAt > displayPrice ? (
            <p className="text-sm font-black tabular-nums text-brand-muted line-through">{formatPrice(displayCompareAt)}</p>
          ) : null}
        </div>
        <p className="mt-6 max-w-lg font-medium leading-relaxed text-brand-muted">{product.description}</p>
        <div className="mt-9">
          <div className="mb-3 flex justify-between gap-4">
            <span className="text-xs font-black uppercase tracking-widest">Select size</span>
            <a href="#fit-guidance" className="inline-flex min-h-11 items-center gap-1 text-xs font-black uppercase tracking-wider underline decoration-brand-yellow decoration-2 underline-offset-4"><Ruler className="size-4" /> Size guide</a>
          </div>
          <ToggleGroup.Root type="single" value={size} onValueChange={setSize} className="grid grid-cols-4 gap-2" aria-label="Select size">
            {product.variants.map((item) => (
              <ToggleGroup.Item
                key={item.id}
                value={item.size}
                disabled={item.stock <= 0}
                className="h-12 border border-zinc-300 text-sm font-black transition duration-150 hover:border-black disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through data-[state=on]:border-black data-[state=on]:bg-black data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
              >
                {item.size}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
        <Button onClick={addToCart} variant="yellow" size="lg" className="mt-5 w-full" disabled={!selectedVariant || selectedVariant.stock <= 0}>
          {selectedVariant ? `Add size ${selectedVariant.size} to cart` : "Select a size"}
        </Button>
        <p className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-700"><Check className="size-4" /> In stock and ready to dispatch</p>
        <div className="mt-7 grid grid-cols-2 gap-px bg-black/10 border border-black/10">
          {[
            { icon: Truck, text: "Free delivery over PKR 25,000" },
            { icon: RefreshCcw, text: "Easy 14-day exchanges" },
            { icon: LockKeyhole, text: "Secure order handling" },
            { icon: Ruler, text: "Fit support before purchase" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex min-h-24 flex-col justify-center gap-2 bg-white p-4 text-xs font-bold leading-5">
              <Icon className="size-4 text-brand-yellow" aria-hidden="true" />
              {text}
            </div>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">{announcement}</p>
        <Accordion id="product-details" type="multiple" defaultValue={["description"]} className="mt-9">
          <AccordionItem value="description"><AccordionTrigger>Description</AccordionTrigger><AccordionContent className="leading-6">{product.description}</AccordionContent></AccordionItem>
          <AccordionItem id="fit-guidance" value="availability"><AccordionTrigger>Fit and available sizes</AccordionTrigger><AccordionContent className="leading-6">Available in {product.sizes.join(", ")}. Choose your usual training size for a structured fit, or size up for a relaxed fit. Contact Delta for garment measurements before ordering.</AccordionContent></AccordionItem>
          <AccordionItem value="shipping"><AccordionTrigger>Shipping and exchanges</AccordionTrigger><AccordionContent className="leading-6">Free nationwide delivery on qualifying orders. Unworn items with original tags can be exchanged within 14 days. Final timing and eligibility are confirmed before payment.</AccordionContent></AccordionItem>
          <AccordionItem value="care"><AccordionTrigger>Fabric and care</AccordionTrigger><AccordionContent className="leading-6">Technical performance fabric. Wash cold with similar colours, do not bleach, and air dry to preserve structure.</AccordionContent></AccordionItem>
        </Accordion>
      </div>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white p-3 lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <span className="shrink-0 text-sm font-black tabular-nums">{formatPrice(displayPrice)}</span>
        <Button onClick={addToCart} variant="yellow" className="flex-1" disabled={!selectedVariant || selectedVariant.stock <= 0}>{selectedVariant ? "Add to cart" : "Select a size"}</Button>
      </div>
    </div>
    </>
  );
}
