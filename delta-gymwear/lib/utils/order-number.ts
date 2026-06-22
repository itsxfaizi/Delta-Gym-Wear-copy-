import "server-only";

import { prisma } from "@/lib/prisma";

export async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
      },
    },
  });

  return `ORD-${year}-${String(count + 1).padStart(5, "0")}`;
}
