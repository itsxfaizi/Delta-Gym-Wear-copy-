import { CouponType } from "@prisma/client";
import { z } from "zod";

const decimalString = z
  .union([z.number(), z.string()])
  .transform((value) => value.toString())
  .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/));

export const couponCreateSchema = z.object({
  code: z.string().min(3).max(40).trim().toUpperCase(),
  type: z.enum(CouponType),
  value: decimalString,
  minOrderValue: decimalString.optional(),
  maxUses: z.number().int().min(1).optional(),
  perUserLimit: z.number().int().min(1).default(1),
  startsAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export const couponUpdateSchema = couponCreateSchema.partial();
