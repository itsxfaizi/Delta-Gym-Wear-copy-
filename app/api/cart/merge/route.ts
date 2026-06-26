import { cookies } from "next/headers";
import { auth, requireAuth } from "@/lib/auth";
import { CART_COOKIE, buildCartCookie, mergeGuestCartIntoUserCart } from "@/lib/cart-service";
import { fail, ok } from "@/lib/api-response";

export async function POST() {
  const session = requireAuth(await auth());
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(CART_COOKIE)?.value;
  if (!sessionId) return fail("NOT_FOUND", "No guest cart to merge.", 404);

  const cart = await mergeGuestCartIntoUserCart(sessionId, session.user.id);
  const response = ok(cart);
  response.headers.append("Set-Cookie", buildCartCookie("", 0));
  return response;
}
