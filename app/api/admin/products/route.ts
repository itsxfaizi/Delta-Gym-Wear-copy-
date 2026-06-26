import { revalidateTag } from "next/cache";
import { auth, requireAdmin } from "@/lib/auth";
import { fail, ok, parseJson, validationFail } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { productCreateSchema, productListQuerySchema } from "@/lib/validations/product";

export async function GET(request: Request) {
  requireAdmin(await auth());
  const parsed = productListQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return validationFail(parsed.error);
  const { page, limit, status, search, category } = parsed.data;

  const where = {
    ...(status ? { status } : {}),
    ...(category ? { category: { slug: category } } : {}),
    ...(search ? { name: { contains: search, mode: "insensitive" as const } } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      include: { category: true, variants: true, images: { orderBy: { sortOrder: "asc" } }, tags: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return ok({ items, page, limit, total, pages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const session = requireAdmin(await auth());
  const parsed = await parseJson(request, (body) => productCreateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return fail("CONFLICT", "Product slug already exists.", 409);

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      subtitle: parsed.data.subtitle,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      status: parsed.data.status,
      isFeatured: parsed.data.isFeatured,
      metaTitle: parsed.data.metaTitle,
      metaDesc: parsed.data.metaDesc,
      tags: { connect: parsed.data.tagIds.map((id) => ({ id })) },
      variants: { create: parsed.data.variants },
      images: { create: parsed.data.images },
    },
    include: { category: true, variants: true, images: true, tags: true },
  });

  await writeAuditLog({ userId: session.user.id, action: "CREATE", resource: "Product", resourceId: product.id, request });
  revalidateTag("products", "max");
  return ok(product, { status: 201 });
}
