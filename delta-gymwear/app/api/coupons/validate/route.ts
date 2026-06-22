import { CouponType, Prisma } from "@prisma/client";
import { z } from "zod";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const couponValidationSchema = z.object({
  code: z.string().min(3).max(40).trim().toUpperCase(),
  cartTotal: z.union([z.number(), z.string()]).transform((value) => new Prisma.Decimal(value)),
});

export async function POST(request: Request) {
  const parsed = await parseJson(request, (body) => couponValidationSchema.parse(body));
  if (parsed.error) return parsed.error;

  const coupon = await prisma.coupon.findUnique({ where: { code: parsed.data.code } });
  if (!coupon?.isActive) return fail("NOT_FOUND", "Coupon is not active.", 404);

  const now = new Date();
  if (coupon.startsAt > now || (coupon.expiresAt && coupon.expiresAt < now)) {
    return fail("BAD_REQUEST", "Coupon is not valid for this date.", 400);
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return fail("BAD_REQUEST", "Coupon usage limit reached.", 400);
  }

  if (coupon.minOrderValue && parsed.data.cartTotal.lessThan(coupon.minOrderValue)) {
    return fail("BAD_REQUEST", "Cart total does not meet this coupon minimum.", 400);
  }

  const cartTotal = parsed.data.cartTotal;
  let discount = new Prisma.Decimal(0);
  if (coupon.type === CouponType.PERCENTAGE) {
    const percentageDiscount = cartTotal.mul(coupon.value).div(100);
    discount = percentageDiscount.greaterThan(cartTotal) ? cartTotal : percentageDiscount;
  }
  if (coupon.type === CouponType.FIXED_AMOUNT) {
    discount = coupon.value.greaterThan(cartTotal) ? cartTotal : coupon.value;
  }

  return ok({
    code: coupon.code,
    type: coupon.type,
    discount: discount.toFixed(2),
    freeShipping: coupon.type === CouponType.FREE_SHIPPING,
  });
}
