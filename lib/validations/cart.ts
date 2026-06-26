import { z } from "zod";

export const cartItemCreateSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).max(20),
});

export const cartItemUpdateSchema = z.object({
  quantity: z.number().int().min(1).max(20),
});
