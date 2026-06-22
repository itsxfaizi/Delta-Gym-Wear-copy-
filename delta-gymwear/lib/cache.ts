import "server-only";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getCachedProducts = unstable_cache(
  async () =>
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { where: { isActive: true } },
        tags: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    }),
  ["products"],
  { revalidate: 3600, tags: ["products"] },
);

export function getCachedProduct(slug: string) {
  return unstable_cache(
    async () =>
      prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          variants: { where: { isActive: true } },
          reviews: {
            where: { status: "APPROVED" },
            include: { user: { select: { id: true, name: true, image: true } } },
            orderBy: { createdAt: "desc" },
          },
          tags: true,
        },
      }),
    ["product", slug],
    { revalidate: 1800, tags: ["product", slug] },
  )();
}
