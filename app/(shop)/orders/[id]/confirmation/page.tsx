import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Your Delta Gym Wear order has been confirmed.",
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order || (order.userId && order.userId !== session?.user?.id)) notFound();

  return (
    <main className="bg-white pb-24 pt-36">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-muted">Order confirmed</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9]">Order confirmed.</h1>
        <p className="mt-4 text-lg font-bold">Order {order.orderNumber}</p>
        <p className="mt-2 text-sm font-medium text-brand-muted">Estimated delivery: 3-5 business days.</p>
        <div className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 py-4 font-bold">
              <div>
                <p className="uppercase">{item.productName}</p>
                <p className="mt-1 text-xs text-brand-muted">Size {item.size} x {item.quantity}</p>
              </div>
              <p className="tabular-nums">{formatPrice(Number(item.subtotal))}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-2xl font-black uppercase">
          <span>Total</span>
          <span>{formatPrice(Number(order.total))}</span>
        </div>
        <Button asChild variant="yellow" className="mt-10">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
