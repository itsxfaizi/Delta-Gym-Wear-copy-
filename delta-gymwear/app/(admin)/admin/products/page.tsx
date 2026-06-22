import Link from "next/link";
import { AdminPage } from "@/components/admin/AdminPage";
import { ProductsTable, type ProductRow } from "@/components/admin/ProductsTable";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  const rows: ProductRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category.name,
    status: product.status,
    price: product.variants.reduce<number | null>((lowest, variant) => {
      const price = Number(variant.price);
      return lowest === null || price < lowest ? price : lowest;
    }, null),
  }));

  return (
    <AdminPage title="Products" action={<Link className="bg-black px-4 py-2 text-sm font-black uppercase text-white" href="/admin/products/new">New product</Link>}>
      <ProductsTable products={rows} />
    </AdminPage>
  );
}
