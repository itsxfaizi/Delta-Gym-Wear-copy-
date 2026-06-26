import { subDays } from "@/lib/date";
import { auth, requireAdmin } from "@/lib/auth";
import { ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  requireAdmin(await auth());
  const since = subDays(new Date(), 30);

  const [orders, statusRows, topProducts] = await prisma.$transaction([
    prisma.order.findMany({
      where: { createdAt: { gte: since }, paymentStatus: "PAID" },
      select: { createdAt: true, total: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.order.findMany({ select: { status: true } }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const revenueByDay = new Map<string, number>();
  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + Number(order.total));
  }

  const ordersByStatus = new Map<string, number>();
  for (const order of statusRows) {
    ordersByStatus.set(order.status, (ordersByStatus.get(order.status) ?? 0) + 1);
  }

  return ok({
    revenueByDay: Array.from(revenueByDay, ([date, revenue]) => ({ date, revenue })),
    ordersByStatus: Array.from(ordersByStatus, ([status, count]) => ({ status, count })),
    topProducts,
  });
}
