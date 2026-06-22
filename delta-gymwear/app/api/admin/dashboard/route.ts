import { startOfToday } from "@/lib/date";
import { auth, requireAdmin } from "@/lib/auth";
import { ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  requireAdmin(await auth());
  const today = startOfToday();

  const [paidToday, ordersToday, activeCustomers, variants] = await prisma.$transaction([
    prisma.order.aggregate({
      where: { paymentStatus: "PAID", createdAt: { gte: today } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { role: "CUSTOMER", isActive: true } }),
    prisma.productVariant.findMany({
      where: { isActive: true },
      select: { stock: true, lowStock: true },
    }),
  ]);

  return ok({
    revenueToday: paidToday._sum.total ?? 0,
    ordersToday,
    activeCustomers,
    lowStockItems: variants.filter((variant) => variant.stock <= variant.lowStock).length,
  });
}
