import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await prisma.user.findUnique({ where: { id }, include: { orders: { orderBy: { createdAt: "desc" } }, addresses: true } });
  if (!customer) notFound();

  return (
    <AdminPage title={customer.name ?? customer.email}>
      <div className="grid gap-4 border border-zinc-200 bg-white p-5 text-sm">
        <p><span className="font-black">Email:</span> {customer.email}</p>
        <p><span className="font-black">Phone:</span> {customer.phone ?? "-"}</p>
        <p><span className="font-black">Orders:</span> {customer.orders.length}</p>
        <p><span className="font-black">Addresses:</span> {customer.addresses.length}</p>
      </div>
    </AdminPage>
  );
}
