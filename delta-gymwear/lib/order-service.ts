import "server-only";

import { CouponType, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CartWithItems } from "@/lib/cart-service";
import { generateOrderNumber } from "@/lib/utils/order-number";
import type { checkoutSchema, shippingAddressSchema } from "@/lib/validations/order";
import type { z } from "zod";

type ShippingAddress = z.infer<typeof shippingAddressSchema>;
type CheckoutInput = z.infer<typeof checkoutSchema>;

function assertCartStock(cart: CartWithItems) {
  for (const item of cart.items) {
    if (!item.variant.isActive || item.quantity > item.variant.stock) {
      throw new Error(`Insufficient stock for ${item.variant.sku}.`);
    }
  }
}

async function calculateCartTotals(cart: CartWithItems, couponCode?: string) {
  assertCartStock(cart);

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {},
  });

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);
  const coupon = couponCode
    ? await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } })
    : null;

  let discount = 0;
  let shippingCost = subtotal >= Number(settings.freeShipping) ? 0 : Number(settings.shippingRate);

  if (coupon?.isActive) {
    const now = new Date();
    const started = coupon.startsAt <= now;
    const notExpired = !coupon.expiresAt || coupon.expiresAt >= now;
    const hasUses = !coupon.maxUses || coupon.usedCount < coupon.maxUses;
    const meetsMinimum = !coupon.minOrderValue || subtotal >= Number(coupon.minOrderValue);

    if (started && notExpired && hasUses && meetsMinimum) {
      if (coupon.type === CouponType.PERCENTAGE) discount = Math.min(subtotal, subtotal * (Number(coupon.value) / 100));
      if (coupon.type === CouponType.FIXED_AMOUNT) discount = Math.min(subtotal, Number(coupon.value));
      if (coupon.type === CouponType.FREE_SHIPPING) shippingCost = 0;
    }
  }

  const total = subtotal - discount + shippingCost;

  return {
    coupon,
    subtotal: new Prisma.Decimal(subtotal),
    discount: new Prisma.Decimal(discount),
    shippingCost: new Prisma.Decimal(shippingCost),
    total: new Prisma.Decimal(total),
  };
}

export async function createCodOrderFromCart(params: {
  cart: CartWithItems;
  input: CheckoutInput;
  userId?: string;
}) {
  const totals = await calculateCartTotals(params.cart, params.input.couponCode);
  const orderNumber = await generateOrderNumber();

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: params.userId,
        email: params.input.email,
        phone: params.input.phone,
        shippingAddress: addressToJson(params.input.shippingAddress),
        status: "PENDING",
        paymentStatus: PaymentStatus.UNPAID,
        paymentMethod: PaymentMethod.COD,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shippingCost: totals.shippingCost,
        total: totals.total,
        couponCode: totals.coupon?.code,
        notes: params.input.notes,
        items: {
          create: params.cart.items.map((item) => ({
            variantId: item.variantId,
            productName: item.variant.product.name,
            variantSku: item.variant.sku,
            size: item.variant.size,
            price: item.variant.price,
            quantity: item.quantity,
            subtotal: new Prisma.Decimal(Number(item.variant.price) * item.quantity),
          })),
        },
        timeline: {
          create: {
            status: "PENDING",
            note: "COD order created from checkout.",
            createdBy: params.userId,
          },
        },
      },
      include: { items: true, timeline: true },
    });

    for (const item of params.cart.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (totals.coupon) {
      await tx.coupon.update({
        where: { id: totals.coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: params.cart.id } });
    return order;
  });
}

function addressToJson(address: ShippingAddress) {
  return JSON.parse(JSON.stringify(address)) as Prisma.InputJsonValue;
}
