import { revalidateTag } from "next/cache";
import { auth, requireAdmin } from "@/lib/auth";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";
import { productUpdateSchema } from "@/lib/validations/product";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAdmin(await auth());
  const { id } = await context.params;
  const parsed = await parseJson(request, (body) => productUpdateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Product not found.", 404);

  const product = await prisma.$transaction(async (tx) => {
    if (parsed.data.variants) {
      for (const variant of parsed.data.variants) {
        const { id: variantId, ...variantData } = variant;
        if (variantId) await tx.productVariant.update({ where: { id: variantId }, data: variantData });
        else await tx.productVariant.create({ data: { ...variantData, productId: id } });
      }
    }

    if (parsed.data.images) {
      for (const image of parsed.data.images) {
        const { id: imageId, ...imageData } = image;
        if (imageId) await tx.productImage.update({ where: { id: imageId }, data: imageData });
        else await tx.productImage.create({ data: { ...imageData, productId: id } });
      }
    }

    return tx.product.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        subtitle: parsed.data.subtitle,
        description: parsed.data.description,
        categoryId: parsed.data.categoryId,
        status: parsed.data.status,
        isFeatured: parsed.data.isFeatured,
        metaTitle: parsed.data.metaTitle,
        metaDesc: parsed.data.metaDesc,
        tags: parsed.data.tagIds ? { set: parsed.data.tagIds.map((tagId) => ({ id: tagId })) } : undefined,
      },
      include: { category: true, variants: true, images: true, tags: true },
    });
  });

  await writeAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    resource: "Product",
    resourceId: id,
    diff: JSON.parse(JSON.stringify(parsed.data)),
    request,
  });
  revalidateTag("products", "max");
  revalidateTag(existing.slug, "max");
  return ok(product);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAdmin(await auth());
  const { id } = await context.params;
  const product = await prisma.product.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  await writeAuditLog({ userId: session.user.id, action: "DELETE", resource: "Product", resourceId: id, request });
  revalidateTag("products", "max");
  revalidateTag(product.slug, "max");
  return ok(product);
}
