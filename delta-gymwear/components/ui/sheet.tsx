"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  children,
  className,
  side = "right",
  title = "Panel",
  description = "Use the controls in this panel, or press Escape to close it.",
}: {
  children: React.ReactNode;
  className?: string;
  side?: "left" | "right";
  title?: string;
  description?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/70 data-[state=open]:animate-in" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 z-[90] w-[min(92vw,420px)] overflow-y-auto bg-white p-6 outline-none",
          side === "right" ? "right-0" : "left-0",
          className,
        )}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        <Dialog.Description className="sr-only">
          {description}
        </Dialog.Description>
        {children}
        <Dialog.Close
          aria-label="Close panel"
          className="absolute right-4 top-4 grid size-11 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow"
        >
          <X className="size-5" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
