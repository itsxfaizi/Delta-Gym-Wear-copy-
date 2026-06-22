"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

const checkoutFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required.").max(120),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(7, "Phone is required.").max(24),
  line1: z.string().min(3, "Address is required.").max(160),
  line2: z.string().max(160).optional(),
  city: z.string().min(2, "City is required.").max(80),
  province: z.string().min(2, "Province is required.").max(80),
  couponCode: z.string().max(40).optional(),
  notes: z.string().max(500).optional(),
});

type CheckoutForm = z.infer<typeof checkoutFormSchema>;

interface ApiCart {
  id: string;
  items: unknown[];
}

interface CheckoutResponse {
  data: {
    orderId: string;
    orderNumber: string;
  };
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] ?? "Customer";
  const lastName = parts.slice(1).join(" ") || firstName;
  return { firstName, lastName };
}

export function CheckoutClient({ email, name }: { email?: string | null; name?: string | null }) {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= 15000 || subtotal === 0 ? 0 : 250;
  const grandTotal = subtotal + shipping;

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: name ?? "",
      email: email ?? "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      province: "",
      couponCode: "",
      notes: "",
    },
  });

  useEffect(() => {
    let active = true;
    fetch("/api/cart")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data: ApiCart } | null) => {
        if (active && payload?.data) setCartId(payload.data.id);
      })
      .catch(() => {
        if (active) toast.error("Could not load cart.");
      });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(values: CheckoutForm) {
    if (!cartId) {
      toast.error("Cart is still loading.");
      return;
    }

    setIsSubmitting(true);
    const { firstName, lastName } = splitName(values.fullName);
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cartId,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        couponCode: values.couponCode || undefined,
        notes: values.notes || undefined,
        paymentMethod: "COD",
        shippingAddress: {
          firstName,
          lastName,
          line1: values.line1,
          line2: values.line2 || undefined,
          city: values.city,
          province: values.province,
          country: "PK",
          phone: values.phone,
        },
      }),
    });

    setIsSubmitting(false);
    if (!response.ok) {
      const payload = (await response.json()) as { error?: { message?: string } };
      toast.error(payload.error?.message ?? "Checkout failed.");
      return;
    }

    const payload = (await response.json()) as CheckoutResponse;
    clear();
    router.push(`/orders/${payload.data.orderId}/confirmation`);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-muted">Contact</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input {...form.register("fullName")} aria-label="Full name" placeholder="Full name" />
            <Input {...form.register("email")} aria-label="Email" placeholder="Email" />
            <Input {...form.register("phone")} aria-label="Phone" placeholder="Phone" className="sm:col-span-2" />
          </div>
        </section>

        <section>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-muted">Delivery</p>
          <div className="mt-4 grid gap-4">
            <Input {...form.register("line1")} aria-label="Address line 1" placeholder="Address line 1" />
            <Input {...form.register("line2")} aria-label="Address line 2" placeholder="Address line 2" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input {...form.register("city")} aria-label="City" placeholder="City" />
              <Input {...form.register("province")} aria-label="Province" placeholder="Province" />
            </div>
            <textarea
              {...form.register("notes")}
              aria-label="Delivery notes"
              placeholder="Delivery notes"
              className="min-h-28 w-full border-2 border-black bg-white px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-yellow"
            />
          </div>
        </section>

        <section className="border-2 border-black p-5">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-muted">Payment</p>
          <h2 className="mt-3 text-2xl font-black uppercase">Cash on delivery</h2>
          <p className="mt-2 text-sm font-medium text-brand-muted">Pay when your order arrives. No advance required.</p>
          <div className="mt-4 grid gap-2 text-xs font-black uppercase tracking-wider text-brand-muted sm:grid-cols-2">
            <div className="border border-zinc-300 p-3 opacity-50">JazzCash coming soon</div>
            <div className="border border-zinc-300 p-3 opacity-50">Easypaisa coming soon</div>
          </div>
        </section>
      </form>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border-2 border-black bg-white p-5">
          <h2 className="text-2xl font-black uppercase">Order summary</h2>
          <div className="mt-5 divide-y divide-zinc-200">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-4 text-sm font-bold">
                <div>
                  <p className="uppercase">{item.name}</p>
                  <p className="mt-1 text-xs text-brand-muted">Size {item.size} x {item.qty}</p>
                </div>
                <p className="tabular-nums">{formatPrice(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <Input {...form.register("couponCode")} aria-label="Coupon code" placeholder="Coupon code" />
            <div className="h-2 bg-zinc-200">
              <div className="h-full bg-brand-yellow" style={{ width: `${Math.min(100, (subtotal / 15000) * 100)}%` }} />
            </div>
            <p className="text-xs font-bold text-brand-muted">{subtotal >= 15000 ? "Free shipping unlocked" : `${formatPrice(15000 - subtotal)} away from free shipping`}</p>
          </div>
          <div className="mt-5 space-y-3 border-t border-zinc-200 pt-5 text-sm font-black uppercase">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
            <div className="flex justify-between text-xl"><span>Total</span><span>{formatPrice(grandTotal)}</span></div>
          </div>
          <Button onClick={form.handleSubmit(onSubmit)} variant="yellow" className="mt-6 w-full" disabled={isSubmitting || items.length === 0}>
            {isSubmitting ? "Placing order" : "Place order"}
          </Button>
        </div>
      </aside>
    </div>
  );
}
