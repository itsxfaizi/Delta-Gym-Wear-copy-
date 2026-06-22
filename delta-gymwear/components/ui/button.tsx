import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap text-sm font-black uppercase tracking-widest transition duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transform-none motion-reduce:transition-none",
  {
    variants: {
      variant: {
        default: "bg-brand-black text-white hover:bg-zinc-800",
        yellow: "bg-brand-yellow text-brand-black hover:bg-yellow-300",
        outline: "border border-current bg-transparent hover:bg-white/10",
        ghost: "hover:bg-white/10",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-11 px-4 text-xs",
        lg: "h-14 px-8",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button };
