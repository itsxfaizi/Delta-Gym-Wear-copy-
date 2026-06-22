import { ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          products: { where: { status: "ACTIVE" } },
        },
      },
    },
  });

  return ok(categories);
}
