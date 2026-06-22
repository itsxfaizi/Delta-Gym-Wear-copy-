import { z } from "zod";
import { auth, requireAdmin } from "@/lib/auth";
import { ok, validationFail } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const reviewListQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export async function GET(request: Request) {
  requireAdmin(await auth());
  const parsed = reviewListQuerySchema.safeParse(Object.fromEntries(new URL(request.url).searchParams));
  if (!parsed.success) return validationFail(parsed.error);

  const reviews = await prisma.review.findMany({
    where: parsed.data.status ? { status: parsed.data.status } : {},
    include: {
      product: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return ok(reviews);
}
