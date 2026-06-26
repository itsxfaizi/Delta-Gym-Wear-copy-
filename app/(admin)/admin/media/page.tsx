import Image from "next/image";
import { AdminPage } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminPage title="Media">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {media.map((item) => (
          <div key={item.id} className="border border-zinc-200 bg-white">
            <div className="relative aspect-square bg-zinc-100">
              <Image src={item.url} alt={item.altText ?? ""} fill sizes="25vw" className="object-cover" />
            </div>
            <div className="p-3 text-xs font-bold text-zinc-600">{item.mimeType} · {Math.round(item.size / 1024)}KB</div>
          </div>
        ))}
      </div>
    </AdminPage>
  );
}
