import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="grid min-h-[75vh] place-items-center bg-brand-black px-5 text-center text-white">
      <div><p className="text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">404 / Product</p><h1 className="mt-4 text-6xl font-black uppercase">Not in the range.</h1><Button asChild variant="yellow" className="mt-8"><Link href="/shop">Return to shop</Link></Button></div>
    </div>
  );
}
