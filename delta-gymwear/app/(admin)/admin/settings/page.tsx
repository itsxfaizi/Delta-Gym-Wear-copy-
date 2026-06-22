import { AdminPage } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.upsert({ where: { id: "singleton" }, update: {}, create: {} });

  return (
    <AdminPage title="Settings">
      <div className="grid max-w-2xl gap-3 border border-zinc-200 bg-white p-5 text-sm">
        <p><span className="font-black">Store:</span> {settings.storeName}</p>
        <p><span className="font-black">Currency:</span> {settings.currency}</p>
        <p><span className="font-black">Free shipping:</span> {formatPrice(String(settings.freeShipping))}</p>
        <p><span className="font-black">Shipping rate:</span> {formatPrice(String(settings.shippingRate))}</p>
        <p><span className="font-black">Maintenance:</span> {settings.maintenanceMode ? "On" : "Off"}</p>
      </div>
    </AdminPage>
  );
}
