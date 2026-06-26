import "server-only";

import { addDays } from "@/lib/date";
import { prisma } from "@/lib/prisma";

export const CART_COOKIE = "delta_cart_session";

export function buildCartCookie(value: string, maxAgeSeconds: number) {
  const secure = process.env.NODE_ENV === "production";
  return `${CART_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSeconds}${secure ? "; Secure" : ""}`;
}

export const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: "asc" as const } },
              category: true,
            },
          },
        },
      },
    },
    orderBy: { addedAt: "asc" as const },
  },
};

export type CartWithItems = NonNullable<Awaited<ReturnType<typeof getCartById>>>;

export async function getCartById(id: string) {
  return prisma.cart.findUnique({
    where: { id },
    include: cartInclude,
  });
}

export async function getOrCreateCart(identity: { userId?: string; sessionId?: string }) {
  if (identity.userId) {
    const existing = await prisma.cart.findUnique({
      where: { userId: identity.userId },
      include: cartInclude,
    });
    if (existing) return existing;

    return prisma.cart.create({
      data: {
        userId: identity.userId,
        expiresAt: addDays(new Date(), 90),
      },
      include: cartInclude,
    });
  }

  if (!identity.sessionId) {
    throw new Error("Guest cart requires a session id.");
  }

  const existing = await prisma.cart.findUnique({
    where: { sessionId: identity.sessionId },
    include: cartInclude,
  });
  if (existing) return existing;

  return prisma.cart.create({
    data: {
      sessionId: identity.sessionId,
      expiresAt: addDays(new Date(), 30),
    },
    include: cartInclude,
  });
}

export async function mergeGuestCartIntoUserCart(sessionId: string, userId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: true },
  });
  if (!guestCart) return getOrCreateCart({ userId });

  const userCart = await getOrCreateCart({ userId });

  await prisma.$transaction(
    guestCart.items.map((item) =>
      prisma.cartItem.upsert({
        where: { cartId_variantId: { cartId: userCart.id, variantId: item.variantId } },
        update: { quantity: { increment: item.quantity } },
        create: {
          cartId: userCart.id,
          variantId: item.variantId,
          quantity: item.quantity,
        },
      }),
    ),
  );

  await prisma.cart.delete({ where: { id: guestCart.id } });
  return getCartById(userCart.id);
}
