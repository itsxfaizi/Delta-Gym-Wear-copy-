import { productListQuerySchema } from "@/lib/validations/product";
import { prisma } from "@/lib/prisma";
import { ok, validationFail } from "@/lib/api-response";
import { getCachedProducts } from "@/lib/cache";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = productListQuerySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return validationFail(parsed.error);

  const { category, tag, status, search, page, limit } = parsed.data;
  if (!category && !tag && !status && !search && page === 1) {
    const items = await getCachedProducts();
    return ok({ items: items.slice(0, limit), page, limit, total: items.length, pages: Math.ceil(items.length / limit) });
  }

  const where = {
    status: status ?? "ACTIVE",
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { slug: tag } } } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { subtitle: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        variants: { where: { isActive: true } },
        tags: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return ok({ items, page, limit, total, pages: Math.ceil(total / limit) });
}
