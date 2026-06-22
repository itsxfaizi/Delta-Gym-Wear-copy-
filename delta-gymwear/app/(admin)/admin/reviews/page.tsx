import { AdminPage } from "@/components/admin/AdminPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { name: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <AdminPage title="Reviews">
      <div className="overflow-x-auto border border-zinc-200 bg-white">
        <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
            <tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Rating</th><th className="px-4 py-3">Status</th></tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {reviews.map((review) => (
              <tr key={review.id}>
                <td className="px-4 py-3 font-bold">{review.product.name}</td>
                <td className="px-4 py-3">{review.user.name ?? review.user.email}</td>
                <td className="px-4 py-3">{review.rating}</td>
                <td className="px-4 py-3">{review.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPage>
  );
}
