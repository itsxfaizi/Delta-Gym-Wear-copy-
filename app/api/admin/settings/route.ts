import { z } from "zod";
import { auth, requireAdmin } from "@/lib/auth";
import { ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/lib/audit";

const settingsSchema = z.object({
  storeName: z.string().min(2).max(80),
  currency: z.literal("PKR"),
  freeShipping: z.union([z.number(), z.string()]).transform(String),
  shippingRate: z.union([z.number(), z.string()]).transform(String),
  maintenanceMode: z.boolean(),
});

export async function GET() {
  requireAdmin(await auth());
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {},
  });
  return ok(settings);
}

export async function PUT(request: Request) {
  const session = requireAdmin(await auth());
  const parsed = await parseJson(request, (body) => settingsSchema.parse(body));
  if (parsed.error) return parsed.error;

  const settings = await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: parsed.data,
  });

  await writeAuditLog({
    userId: session.user.id,
    action: "UPDATE",
    resource: "SiteSettings",
    resourceId: "singleton",
    diff: JSON.parse(JSON.stringify(parsed.data)),
    request,
  });
  return ok(settings);
}
