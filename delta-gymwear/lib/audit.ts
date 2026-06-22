import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function writeAuditLog(input: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  diff?: Prisma.InputJsonValue;
  request?: Request;
}) {
  await prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      resource: input.resource,
      resourceId: input.resourceId,
      diff: input.diff,
      ip: input.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    },
  });
}
