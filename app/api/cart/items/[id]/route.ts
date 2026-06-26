import { auth } from "@/lib/auth";
import { CART_COOKIE, cartInclude } from "@/lib/cart-service";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { cartItemUpdateSchema } from "@/lib/validations/cart";
import { cookies } from "next/headers";

async function findOwnedCartItem(itemId: string) {
  const session = await auth();
  const sessionId = (await cookies()).get(CART_COOKIE)?.value;
  return prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: session?.user.id ? { userId: session.user.id } : { sessionId },
    },
    include: { variant: true, cart: true },
  });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const parsed = await parseJson(request, (body) => cartItemUpdateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const item = await findOwnedCartItem(id);
  if (!item) return fail("NOT_FOUND", "Cart item not found.", 404);
  if (item.variant.stock < parsed.data.quantity) return fail("CONFLICT", "Insufficient stock.", 409);

  await prisma.cartItem.update({ where: { id }, data: { quantity: parsed.data.quantity } });
  const cart = await prisma.cart.findUniqueOrThrow({ where: { id: item.cartId }, include: cartInclude });
  return ok(cart);
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const item = await findOwnedCartItem(id);
  if (!item) return fail("NOT_FOUND", "Cart item not found.", 404);

  await prisma.cartItem.delete({ where: { id } });
  const cart = await prisma.cart.findUniqueOrThrow({ where: { id: item.cartId }, include: cartInclude });
  return ok(cart);
}
