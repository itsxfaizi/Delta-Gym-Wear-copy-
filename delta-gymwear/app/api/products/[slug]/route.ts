import { getCachedProduct } from "@/lib/cache";
import { fail, ok } from "@/lib/api-response";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const product = await getCachedProduct(slug);
  if (!product || product.status !== "ACTIVE") {
    return fail("NOT_FOUND", "Product not found.", 404);
  }

  return ok(product);
}
