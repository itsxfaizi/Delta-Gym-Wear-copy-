import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export { formatPrice } from "@/lib/utils/money";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
