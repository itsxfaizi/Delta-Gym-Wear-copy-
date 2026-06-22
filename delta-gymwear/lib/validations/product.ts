import { ProductStatus } from "@prisma/client";
import { z } from "zod";

const decimalString = z
  .union([z.number(), z.string()])
  .transform((value) => value.toString())
  .pipe(z.string().regex(/^\d+(\.\d{1,2})?$/));

export const productListQuerySchema = z.object({
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  status: z.enum(ProductStatus).optional(),
  search: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

const productVariantInputSchema = z.object({
  sku: z.string().min(3).max(64).trim(),
  size: z.string().min(1).max(16).trim(),
  color: z.string().max(40).trim().optional(),
  price: decimalString,
  compareAt: decimalString.optional(),
  stock: z.number().int().min(0),
  lowStock: z.number().int().min(0).default(5),
  isActive: z.boolean().default(true),
});

const productImageInputSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().max(180).trim().optional(),
  altText: z.string().max(160).trim().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPrimary: z.boolean().default(false),
});

export const productCreateSchema = z.object({
  name: z.string().min(2).max(140).trim(),
  slug: z.string().min(2).max(160).trim(),
  subtitle: z.string().max(160).trim().optional(),
  description: z.string().min(10).max(20000),
  categoryId: z.string().cuid(),
  tagIds: z.array(z.string().cuid()).default([]),
  status: z.enum(ProductStatus).default(ProductStatus.DRAFT),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(70).trim().optional(),
  metaDesc: z.string().max(160).trim().optional(),
  variants: z.array(productVariantInputSchema).min(1),
  images: z.array(productImageInputSchema).default([]),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  tagIds: z.array(z.string().cuid()).optional(),
  variants: z.array(productVariantInputSchema.extend({ id: z.string().cuid().optional() })).optional(),
  images: z.array(productImageInputSchema.extend({ id: z.string().cuid().optional() })).optional(),
});
