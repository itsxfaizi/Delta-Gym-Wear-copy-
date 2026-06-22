import { notFound } from "next/navigation";
import { AdminPage } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id }, include: { variants: true, images: true } });
  if (!product) notFound();

  return (
    <AdminPage title={`Edit ${product.name}`}>
      <div className="grid gap-4 border border-zinc-200 bg-white p-5">
        <p className="text-sm font-bold text-zinc-600">Slug: {product.slug}</p>
        <p className="text-sm font-bold text-zinc-600">Variants: {product.variants.length}</p>
        <p className="text-sm font-bold text-zinc-600">Images: {product.images.length}</p>
      </div>
    </AdminPage>
  );
}
