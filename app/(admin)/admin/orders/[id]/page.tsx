import { notFound } from "next/navigation";
import { AdminPage, AdminTable } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true, timeline: { orderBy: { createdAt: "asc" } } } });
  if (!order) notFound();

  return (
    <AdminPage title={order.orderNumber}>
      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <AdminTable>
          <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
            <tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Size</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3">Subtotal</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {order.items.map((item) => (
              <tr key={item.id}><td className="px-4 py-3 font-bold">{item.productName}</td><td className="px-4 py-3">{item.size}</td><td className="px-4 py-3">{item.quantity}</td><td className="px-4 py-3">{formatPrice(String(item.subtotal))}</td></tr>
            ))}
          </tbody>
        </AdminTable>
        <div className="space-y-4 border border-zinc-200 bg-white p-4 text-sm">
          <p><span className="font-black">Payment:</span> {order.paymentStatus}</p>
          <p><span className="font-black">Status:</span> {order.status}</p>
          <p><span className="font-black">Total:</span> {formatPrice(String(order.total))}</p>
          <div className="divide-y divide-zinc-100">
            {order.timeline.map((event) => <p key={event.id} className="py-2">{event.status} · {event.note}</p>)}
          </div>
        </div>
      </div>
    </AdminPage>
  );
}
