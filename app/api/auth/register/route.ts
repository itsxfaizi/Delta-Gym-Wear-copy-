import bcrypt from "bcryptjs";
import zxcvbn from "zxcvbn";
import { fail, ok, parseJson } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  const parsed = await parseJson(request, (body) => registerSchema.parse(body));
  if (parsed.error) return parsed.error;

  const strength = zxcvbn(parsed.data.password);
  if (strength.score < 2) {
    return fail("BAD_REQUEST", "Password is too weak.", 400);
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { id: true },
  });
  if (existing) return fail("CONFLICT", "An account already exists for this email.", 409);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      phone: parsed.data.phone,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
    },
    select: { id: true, email: true, name: true },
  });

  return ok(user, { status: 201 });
}
