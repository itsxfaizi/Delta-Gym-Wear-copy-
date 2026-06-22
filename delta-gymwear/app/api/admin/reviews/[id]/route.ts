import { z } from "zod";
import { auth, requireAdmin } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

const reviewUpdateSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAdmin(await auth());
  const { id } = await context.params;
  const parsed = await parseJson(request, (body) => reviewUpdateSchema.parse(body));
  if (parsed.error) return parsed.error;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return fail("NOT_FOUND", "Review not found.", 404);

  const review = await prisma.review.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await writeAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    resource: "Review",
    resourceId: id,
    diff: JSON.parse(JSON.stringify(parsed.data)),
    request,
  });

  return ok(review);
}
