import { auth, requireAdmin } from "@/lib/auth";
import { ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { couponCreateSchema } from "@/lib/validations/coupon";

export async function GET() {
  requireAdmin(await auth());
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return ok(coupons);
}

export async function POST(request: Request) {
  const session = requireAdmin(await auth());
  const parsed = await parseJson(request, (body) => couponCreateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const coupon = await prisma.coupon.create({
    data: {
      ...parsed.data,
      startsAt: new Date(parsed.data.startsAt),
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : undefined,
    },
  });

  await writeAuditLog({ userId: session.user.id, action: "CREATE", resource: "Coupon", resourceId: coupon.id, request });
  return ok(coupon, { status: 201 });
}
