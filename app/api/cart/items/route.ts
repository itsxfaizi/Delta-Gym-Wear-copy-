import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { CART_COOKIE, buildCartCookie, cartInclude, getOrCreateCart } from "@/lib/cart-service";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { cartItemCreateSchema } from "@/lib/validations/cart";

export async function POST(request: Request) {
  const parsed = await parseJson(request, (body) => cartItemCreateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const session = await auth();
  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get(CART_COOKIE)?.value;
  const sessionId = existingSessionId ?? randomUUID();
  const cart = await getOrCreateCart({ userId: session?.user.id, sessionId });

  const variant = await prisma.productVariant.findUnique({
    where: { id: parsed.data.variantId },
    select: { id: true, stock: true, isActive: true },
  });
  if (!variant?.isActive) return fail("NOT_FOUND", "Variant not found.", 404);
  const existingItem = cart.items.find((item) => item.variantId === variant.id);
  const nextQuantity = (existingItem?.quantity ?? 0) + parsed.data.quantity;
  if (variant.stock < nextQuantity) return fail("CONFLICT", "Insufficient stock.", 409);

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
    update: { quantity: { increment: parsed.data.quantity } },
    create: { cartId: cart.id, variantId: variant.id, quantity: parsed.data.quantity },
  });

  const updated = await prisma.cart.findUniqueOrThrow({ where: { id: cart.id }, include: cartInclude });
  const response = ok(updated, { status: 201 });
  if (!session?.user.id && !existingSessionId) {
    response.headers.append("Set-Cookie", buildCartCookie(sessionId, 60 * 60 * 24 * 30));
  }
  return response;
}
