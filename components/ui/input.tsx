import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-12 w-full min-w-0 border border-zinc-300 bg-white px-4 text-base font-medium outline-none transition duration-150 focus:border-brand-black focus:ring-2 focus:ring-brand-yellow/40",
        className,
      )}
      {...props}
    />
  );
}
