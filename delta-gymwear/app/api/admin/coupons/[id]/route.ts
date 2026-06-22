import { auth, requireAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { couponUpdateSchema } from "@/lib/validations/coupon";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAdmin(await auth());
  const { id } = await context.params;
  const parsed = await parseJson(request, (body) => couponUpdateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Coupon not found.", 404);

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      ...parsed.data,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : undefined,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    },
  });

  await writeAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    resource: "Coupon",
    resourceId: id,
    diff: JSON.parse(JSON.stringify(parsed.data)),
    request,
  });

  return ok(coupon);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAdmin(await auth());
  const { id } = await context.params;
  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Coupon not found.", 404);

  await prisma.coupon.delete({ where: { id } });
  await writeAuditLog({ userId: session.user.id, action: "DELETE", resource: "Coupon", resourceId: id, request });
  return ok({ deleted: true });
}
