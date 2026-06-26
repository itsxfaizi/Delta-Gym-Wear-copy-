import { auth, isAdminRole, requireAuth } from "@/lib/auth";
import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAuth(await auth());
  const { id } = await context.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, timeline: { orderBy: { createdAt: "asc" } } },
  });

  if (!order) return fail("NOT_FOUND", "Order not found.", 404);
  if (order.userId !== session.user.id && !isAdminRole(session.user.role)) {
    return fail("FORBIDDEN", "You cannot access this order.", 403);
  }

  return ok(order);
}
