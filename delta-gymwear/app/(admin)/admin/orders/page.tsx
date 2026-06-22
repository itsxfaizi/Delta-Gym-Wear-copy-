import Link from "next/link";
import { AdminPage, AdminTable } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100 });

  return (
    <AdminPage title="Orders">
      <AdminTable>
        <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Total</th><th className="px-4 py-3" /></tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-4 py-3 font-bold">{order.orderNumber}</td>
              <td className="px-4 py-3">{order.email}</td>
              <td className="px-4 py-3">{order.status}</td>
              <td className="px-4 py-3 font-black">{formatPrice(String(order.total))}</td>
              <td className="px-4 py-3 text-right"><Link className="font-bold underline" href={`/admin/orders/${order.id}`}>Open</Link></td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </AdminPage>
  );
}
