"use client";

import { useState } from "react";
import Image from "next/image";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { toast } from "sonner";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCartStore } from "@/store/cart";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [size, setSize] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const add = useCartStore((state) => state.add);

  function addToCart() {
    if (!size) return;
    add({ id: product.id, name: product.name, price: product.price, qty: 1, size, image: product.images[0] });
    setAnnouncement(`${product.name}, size ${size}, added to cart.`);
    toast.success(`${product.name} added to cart.`);
  }

  return (
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
        <p className="mt-5 text-xl font-black tabular-nums">{formatPrice(product.price)}</p>
        <p className="mt-6 max-w-lg font-medium leading-relaxed text-brand-muted">{product.description}</p>
        <div className="mt-9">
          <div className="mb-3 flex justify-between gap-4">
            <span className="text-xs font-black uppercase tracking-widest">Select size</span>
            <span className="text-xs font-medium text-brand-muted">Required</span>
          </div>
          <ToggleGroup.Root type="single" value={size} onValueChange={setSize} className="grid grid-cols-4 gap-2" aria-label="Select size">
            {product.sizes.map((item) => <ToggleGroup.Item key={item} value={item} className="h-12 border border-zinc-300 text-sm font-black transition duration-150 hover:border-black data-[state=on]:border-black data-[state=on]:bg-black data-[state=on]:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow">{item}</ToggleGroup.Item>)}
          </ToggleGroup.Root>
        </div>
        <Button onClick={addToCart} variant="yellow" size="lg" className="mt-5 w-full" disabled={!size}>
          {size ? `Add size ${size} to cart` : "Select a size"}
        </Button>
        <p className="sr-only" aria-live="polite">{announcement}</p>
        <Accordion type="multiple" defaultValue={["description"]} className="mt-9">
          <AccordionItem value="description"><AccordionTrigger>Description</AccordionTrigger><AccordionContent className="leading-6">{product.description}</AccordionContent></AccordionItem>
          <AccordionItem value="availability"><AccordionTrigger>Available sizes</AccordionTrigger><AccordionContent className="leading-6">{product.sizes.join(", ")}. Select a size above before adding this item to your cart.</AccordionContent></AccordionItem>
          <AccordionItem value="shipping"><AccordionTrigger>Shipping and returns</AccordionTrigger><AccordionContent className="leading-6">Online checkout and policy details are not available in this build. Contact Delta before placing an order.</AccordionContent></AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
