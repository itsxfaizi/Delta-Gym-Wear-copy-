import { auth, requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/api-response";
import { getCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = requireAdmin(await auth());
  const { id } = await context.params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return fail("NOT_FOUND", "Media not found.", 404);

  if (media.publicId) {
    await getCloudinary().uploader.destroy(media.publicId);
  }
  await prisma.media.delete({ where: { id } });
  await writeAuditLog({ userId: session.user.id, action: "MEDIA_DELETE", resource: "Media", resourceId: id, request });
  return ok({ deleted: true });
}
