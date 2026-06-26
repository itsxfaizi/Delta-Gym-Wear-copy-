import "server-only";

import type { Product, StorefrontVariant } from "@/lib/products";
import { prisma } from "@/lib/prisma";

const productInclude = {
  category: true,
  images: { orderBy: [{ isPrimary: "desc" as const }, { sortOrder: "asc" as const }] },
  variants: { where: { isActive: true }, orderBy: { price: "asc" as const } },
};

type ProductRecord = NonNullable<Awaited<ReturnType<typeof getProductRecord>>>;

function isProductionBuild() {
  return process.env.NEXT_PHASE === "phase-production-build" && process.env.SKIP_DB_DURING_BUILD === "true";
}

async function withBuildFallback<T>(operation: () => Promise<T>, fallback: T) {
  if (isProductionBuild()) return fallback;
  try {
    return await operation();
  } catch (error: unknown) {
    if (isProductionBuild()) return fallback;
    throw error;
  }
}

async function getProductRecord(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: productInclude,
  });
}

function mapVariant(variant: ProductRecord["variants"][number]): StorefrontVariant {
  return {
    id: variant.id,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    price: Number(variant.price),
    compareAt: variant.compareAt ? Number(variant.compareAt) : null,
    stock: variant.stock,
    isActive: variant.isActive,
  };
}

function mapProduct(product: ProductRecord): Product {
  const variants = product.variants.map(mapVariant);
  const firstVariant = variants[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle ?? "Built for repeat training",
    price: firstVariant?.price ?? 0,
    compareAt: firstVariant?.compareAt ?? null,
    currency: "PKR",
    category: product.category.name,
    categorySlug: product.category.slug,
    sizes: variants.map((variant) => variant.size),
    images: product.images.map((image) => image.url),
    description: product.description,
    variants,
  };
}

export async function getStorefrontProducts() {
  const products = await withBuildFallback(
    () =>
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        include: productInclude,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
    [],
  );
  return products.map(mapProduct);
}

export async function getStorefrontProduct(slug: string) {
  const product = await withBuildFallback(() => getProductRecord(slug), null);
  return product ? mapProduct(product) : null;
}

export async function getActiveProductSlugs() {
  return withBuildFallback(
    () =>
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        select: { slug: true },
      }),
    [],
  );
}

export async function getStorefrontCategories() {
  return withBuildFallback(
    () =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        select: { name: true, slug: true },
      }),
    [],
  );
}
