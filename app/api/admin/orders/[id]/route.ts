import { auth, requireAdmin } from "@/lib/auth";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { orderStatusUpdateSchema } from "@/lib/validations/order";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  requireAdmin(await auth());
  const { id } = await context.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { user: true, items: true, timeline: { orderBy: { createdAt: "asc" } } },
  });
  if (!order) return fail("NOT_FOUND", "Order not found.", 404);
  return ok(order);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAdmin(await auth());
  const { id } = await context.params;
  const parsed = await parseJson(request, (body) => orderStatusUpdateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: parsed.data.status,
      timeline: {
        create: {
          status: parsed.data.status,
          note: parsed.data.note,
          createdBy: session.user.id,
        },
      },
    },
    include: { items: true, timeline: { orderBy: { createdAt: "asc" } } },
  });

  await writeAuditLog({
    userId: session.user.id,
    action: "STATUS_CHANGE",
    resource: "Order",
    resourceId: id,
    diff: JSON.parse(JSON.stringify(parsed.data)),
    request,
  });
  return ok(order);
}
