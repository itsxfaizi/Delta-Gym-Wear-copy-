import { AdminPage } from "@/components/admin/AdminPage";
import { RevenueChart, type RevenuePoint } from "@/components/admin/AdminCharts";
import { startOfToday } from "@/lib/date";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const today = startOfToday();
  const [revenue, ordersToday, customers, variants, recentOrders] = await prisma.$transaction([
    prisma.order.aggregate({ where: { paymentStatus: "PAID", createdAt: { gte: today } }, _sum: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({ where: { role: "CUSTOMER", isActive: true } }),
    prisma.productVariant.findMany({ where: { isActive: true }, select: { stock: true, lowStock: true } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const stats = [
    ["Today's revenue", formatPrice(String(revenue._sum.total ?? 0))],
    ["Orders today", ordersToday.toString()],
    ["Active customers", customers.toString()],
    ["Low stock items", variants.filter((variant) => variant.stock <= variant.lowStock).length.toString()],
  ];

  const chartData: RevenuePoint[] = Array.from({ length: 7 }, (_, index) => ({
    label: `${index + 1}`,
    revenue: index === 6 ? Number(revenue._sum.total ?? 0) : 0,
  }));

  return (
    <AdminPage title="Dashboard">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="border border-zinc-200 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-wider text-zinc-500">{label}</p>
            <p className="mt-3 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <RevenueChart data={chartData} />
      <div className="border border-zinc-200 bg-white p-4">
        <h2 className="text-sm font-black uppercase tracking-wider">Recent orders</h2>
        <div className="mt-4 divide-y divide-zinc-100">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="font-bold">{order.orderNumber}</span>
              <span>{order.status}</span>
              <span className="font-black">{formatPrice(String(order.total))}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminPage>
  );
}
