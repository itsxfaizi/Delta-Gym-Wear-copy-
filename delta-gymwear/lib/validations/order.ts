import { z } from "zod";

export const shippingAddressSchema = z.object({
  firstName: z.string().min(1).max(80).trim(),
  lastName: z.string().min(1).max(80).trim(),
  line1: z.string().min(3).max(160).trim(),
  line2: z.string().max(160).trim().optional(),
  city: z.string().min(2).max(80).trim(),
  province: z.string().min(2).max(80).trim(),
  postalCode: z.string().max(20).trim().optional(),
  country: z.string().length(2).default("PK"),
  phone: z.string().min(7).max(24).trim(),
});

export const checkoutSchema = z.object({
  cartId: z.string().cuid(),
  fullName: z.string().min(2).max(120).trim(),
  email: z.string().email().trim().toLowerCase(),
  phone: z.string().min(7).max(24).trim(),
  couponCode: z.string().max(40).trim().optional(),
  shippingAddress: shippingAddressSchema,
  notes: z.string().max(500).trim().optional(),
  paymentMethod: z.enum(["COD"]).default("COD"),
});

export const orderListQuerySchema = z.object({
  status: z.string().trim().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  search: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const orderStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
  note: z.string().max(500).trim().optional(),
});
