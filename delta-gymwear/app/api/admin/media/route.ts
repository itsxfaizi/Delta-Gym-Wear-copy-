import { auth, requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/api-response";
import { assertAllowedImage, getCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

export async function GET() {
  requireAdmin(await auth());
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return ok(media);
}

export async function POST(request: Request) {
  const session = requireAdmin(await auth());
  const form = await request.formData();
  const file = form.get("file");
  const altText = form.get("altText");

  if (!(file instanceof File)) return fail("BAD_REQUEST", "File is required.", 400);
  try {
    assertAllowedImage(file);
  } catch (error: unknown) {
    return fail("BAD_REQUEST", error instanceof Error ? error.message : "Invalid file.", 400);
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
  const upload = await getCloudinary().uploader.upload(dataUri, { folder: "delta-gymwear" });

  const media = await prisma.media.create({
    data: {
      url: upload.secure_url,
      publicId: upload.public_id,
      mimeType: file.type,
      size: file.size,
      altText: typeof altText === "string" ? altText : undefined,
      uploadedBy: session.user.id,
    },
  });

  await writeAuditLog({ userId: session.user.id, action: "MEDIA_UPLOAD", resource: "Media", resourceId: media.id, request });
  return ok(media, { status: 201 });
}
