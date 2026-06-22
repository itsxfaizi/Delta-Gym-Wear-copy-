import { auth, requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  requireAdmin(await auth());
  const { id } = await context.params;
  const customer = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      image: true,
      isActive: true,
      createdAt: true,
      addresses: true,
      orders: { orderBy: { createdAt: "desc" }, include: { items: true } },
    },
  });
  if (!customer) return fail("NOT_FOUND", "Customer not found.", 404);
  return ok(customer);
}
