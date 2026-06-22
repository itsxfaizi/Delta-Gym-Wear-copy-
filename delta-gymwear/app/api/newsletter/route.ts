import { z } from "zod";
import { fail, ok, parseJson } from "@/lib/api-response";
import { getClientIp, limitByIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";

const newsletterSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
});

export async function POST(request: Request) {
  const rate = limitByIp("newsletter", getClientIp(request), 3, 60_000);
  if (!rate.success) return fail("RATE_LIMITED", "Too many newsletter requests.", 429);

  const parsed = await parseJson(request, (body) => newsletterSchema.parse(body));
  if (parsed.error) return parsed.error;

  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: {},
    create: parsed.data,
  });

  return ok(subscriber, { status: 201 });
}
