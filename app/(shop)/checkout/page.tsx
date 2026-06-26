import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Delta Gym Wear order with cash on delivery.",
};

export default async function CheckoutPage() {
  const session = await auth();

  return (
    <main className="bg-zinc-50 pb-24 pt-36">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-28">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-muted">Secure checkout</p>
        <h1 className="mt-4 text-5xl font-black uppercase leading-[0.9] sm:text-7xl">Place your order.</h1>
        {!session?.user?.id ? (
          <p className="mt-4 max-w-2xl text-sm font-medium text-brand-muted">
            Guest checkout is enabled. Sign in only if you want the order tied to your account.
          </p>
        ) : null}
        <div className="mt-10">
          <CheckoutClient email={session?.user?.email} name={session?.user?.name} />
        </div>
      </div>
    </main>
  );
}
