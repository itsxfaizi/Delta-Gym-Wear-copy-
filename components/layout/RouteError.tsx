"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function RouteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="grid min-h-[70vh] place-items-center bg-brand-black px-5 text-center text-white">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">Unexpected error</p>
        <h2 className="mt-4 text-5xl font-black uppercase tracking-tight sm:text-7xl">Reset. Try again.</h2>
        <p className="mx-auto mt-5 max-w-lg text-zinc-400">The page could not be loaded. No cart data was changed.</p>
        <Button onClick={retry} variant="yellow" className="mt-8">Retry</Button>
      </div>
    </div>
  );
}
