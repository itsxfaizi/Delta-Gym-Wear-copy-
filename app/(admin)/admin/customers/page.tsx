import Link from "next/link";
import { AdminPage, AdminTable } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: { id: true, email: true, name: true, phone: true, createdAt: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <AdminPage title="Customers">
      <AdminTable>
        <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Orders</th><th className="px-4 py-3" /></tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {customers.map((customer) => (
            <tr key={customer.id}><td className="px-4 py-3 font-bold">{customer.name ?? customer.email}</td><td className="px-4 py-3">{customer.phone ?? "-"}</td><td className="px-4 py-3">{customer._count.orders}</td><td className="px-4 py-3 text-right"><Link className="font-bold underline" href={`/admin/customers/${customer.id}`}>Open</Link></td></tr>
          ))}
        </tbody>
      </AdminTable>
    </AdminPage>
  );
}
