import { AdminPage, AdminTable } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";
import type { Coupon } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons: Coupon[] = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminPage title="Coupons">
      <AdminTable>
        <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
          <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Uses</th></tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {coupons.map((coupon) => <tr key={coupon.id}><td className="px-4 py-3 font-bold">{coupon.code}</td><td className="px-4 py-3">{coupon.type}</td><td className="px-4 py-3">{String(coupon.value)}</td><td className="px-4 py-3">{coupon.usedCount}</td></tr>)}
        </tbody>
      </AdminTable>
    </AdminPage>
  );
}
