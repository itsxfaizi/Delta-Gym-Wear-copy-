import { auth, requireAdmin } from "@/lib/auth";
import { ok, validationFail } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { orderListQuerySchema } from "@/lib/validations/order";

export async function GET(request: Request) {
  requireAdmin(await auth());
  const parsed = orderListQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return validationFail(parsed.error);
  const { page, limit, status, search, from, to } = parsed.data;

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(from || to ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } } : {}),
    ...(search
      ? {
          OR: [
            { orderNumber: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } }, items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return ok({ items, page, limit, total, pages: Math.ceil(total / limit) });
}
