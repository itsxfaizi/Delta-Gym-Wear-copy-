import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { CART_COOKIE, buildCartCookie, getOrCreateCart } from "@/lib/cart-service";
import { ok } from "@/lib/api-response";

export async function GET() {
  const session = await auth();
  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get(CART_COOKIE)?.value;
  const sessionId = existingSessionId ?? randomUUID();
  const cart = await getOrCreateCart({ userId: session?.user.id, sessionId });
  const response = ok(cart);

  if (!session?.user.id && !existingSessionId) {
    response.headers.append("Set-Cookie", buildCartCookie(sessionId, 60 * 60 * 24 * 30));
  }

  return response;
}
