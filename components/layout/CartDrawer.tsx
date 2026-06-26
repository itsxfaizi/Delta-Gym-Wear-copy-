"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export function CartDrawer() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const items = useCartStore((state) => state.items);
  const remove = useCartStore((state) => state.remove);
  const update = useCartStore((state) => state.update);
  const total = useCartStore((state) => state.total);

  const count = mounted ? items.reduce((sum, item) => sum + item.qty, 0) : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label={`Open cart with ${count} items`}
          className="relative grid size-11 place-items-center outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span aria-live="polite" className="absolute right-0 top-0 grid size-5 place-items-center bg-brand-yellow text-[10px] font-black text-black">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent title="Shopping cart" className="flex flex-col">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-muted">Your selection</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">Cart ({count})</h2>
        </div>
        <div className="flex-1 divide-y divide-zinc-200 overflow-y-auto">
          {items.length === 0 ? (
            <div className="grid min-h-80 place-items-center text-center">
              <div>
                <ShoppingBag className="mx-auto mb-4 size-8 text-zinc-300" />
                <p className="font-black uppercase">Your cart is empty</p>
                <p className="mt-2 text-sm font-medium text-brand-muted">Explore the current Delta range.</p>
                <SheetClose asChild>
                  <Button asChild variant="yellow" className="mt-6">
                    <Link href="/shop">Shop the range</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const key = item.id;
              const image = item.image;
              return (
                <div key={key} className="py-5">
                  <div className="flex gap-4">
                    <div className="relative size-24 shrink-0 overflow-hidden bg-zinc-900">
                      {image ? (
                        <Image src={image} alt={item.name} fill sizes="96px" className="object-cover" />
                      ) : (
                        <ShoppingBag aria-hidden="true" className="absolute inset-0 m-auto size-6 text-zinc-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black uppercase">{item.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-widest text-brand-muted">Size {item.size}</p>
                    </div>
                    <button aria-label={`Remove ${item.name}`} onClick={() => remove(key)} className="grid size-11 shrink-0 place-items-center self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-zinc-300">
                      <button aria-label={`Decrease ${item.name} quantity`} onClick={() => update(key, item.qty - 1)} disabled={item.qty <= 1} className="grid size-11 place-items-center disabled:cursor-not-allowed disabled:opacity-35"><Minus className="size-3" /></button>
                      <span className="w-10 text-center text-sm font-black" aria-live="polite">{item.qty}</span>
                      <button aria-label={`Increase ${item.name} quantity`} onClick={() => update(key, item.qty + 1)} className="grid size-11 place-items-center"><Plus className="size-3" /></button>
                    </div>
                    <span className="font-black tabular-nums">{formatPrice(item.price * item.qty)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="border-t border-zinc-200 pt-5" style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}>
          <div className="mb-5 flex items-center justify-between text-lg font-black uppercase">
            <span>Subtotal</span><span className="tabular-nums">{formatPrice(mounted ? total() : 0)}</span>
          </div>
          <SheetClose asChild>
            <Button asChild variant="yellow" className="w-full">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/shop" className="mt-2 flex min-h-11 items-center justify-center text-xs font-black uppercase tracking-widest underline decoration-brand-yellow decoration-2 underline-offset-4">
              Continue shopping
            </Link>
          </SheetClose>
          <p className="mt-2 text-center text-[11px] text-brand-muted">Cash on delivery. No advance payment required.</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
