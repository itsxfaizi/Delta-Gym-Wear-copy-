import { auth, requireAuth } from "@/lib/auth";
import { ok, validationFail } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { orderListQuerySchema } from "@/lib/validations/order";

export async function GET(request: Request) {
  const session = requireAuth(await auth());
  const parsed = orderListQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return validationFail(parsed.error);

  const { page, limit } = parsed.data;
  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true, timeline: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where: { userId: session.user.id } }),
  ]);

  return ok({ items, page, limit, total, pages: Math.ceil(total / limit) });
}
