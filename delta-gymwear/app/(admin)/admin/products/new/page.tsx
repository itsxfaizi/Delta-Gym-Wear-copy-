import { AdminPage } from "@/components/admin/AdminPage";
import { ProductDescriptionEditor } from "@/components/admin/ProductDescriptionEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });

  return (
    <AdminPage title="New product">
      <form className="grid max-w-3xl gap-4 border border-zinc-200 bg-white p-5">
        <input className="border border-zinc-300 px-3 py-2" name="name" placeholder="Product name" />
        <input className="border border-zinc-300 px-3 py-2" name="slug" placeholder="product-slug" />
        <select className="border border-zinc-300 px-3 py-2" name="categoryId">
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <ProductDescriptionEditor />
        <button className="w-fit bg-black px-4 py-2 text-sm font-black uppercase text-white" type="button">Save draft</button>
      </form>
    </AdminPage>
  );
}
