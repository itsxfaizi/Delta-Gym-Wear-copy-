import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { fail, ok, parseJson } from "@/lib/api-response";
import { CART_COOKIE, getOrCreateCart } from "@/lib/cart-service";
import { createCodOrderFromCart } from "@/lib/order-service";
import { checkoutSchema } from "@/lib/validations/order";

export async function POST(request: Request) {
  const session = await auth();
  const cookieStore = await cookies();
  const parsed = await parseJson(request, (body) => checkoutSchema.parse(body));
  if (parsed.error) return parsed.error;

  const sessionId = cookieStore.get(CART_COOKIE)?.value;
  const cart = await getOrCreateCart({
    userId: session?.user?.id,
    sessionId,
  });

  if (cart.id !== parsed.data.cartId) {
    return fail("NOT_FOUND", "Cart not found.", 404);
  }

  if (cart.items.length === 0) {
    return fail("BAD_REQUEST", "Cart is empty.", 400);
  }

  try {
    const order = await createCodOrderFromCart({
      cart,
      input: parsed.data,
      userId: session?.user?.id,
    });
    return ok({ orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (error: unknown) {
    return fail("BAD_REQUEST", error instanceof Error ? error.message : "Checkout failed.", 400);
  }
}
