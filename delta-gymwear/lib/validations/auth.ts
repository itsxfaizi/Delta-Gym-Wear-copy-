import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(72),
});

const passwordSchema = z
  .string()
  .min(8)
  .max(72)
  .regex(/[A-Z]/, "Password must include an uppercase letter.")
  .regex(/[0-9]/, "Password must include a number.")
  .regex(/[^A-Za-z0-9]/, "Password must include a special character.");

export const registerSchema = loginSchema.extend({
  name: z.string().min(2).max(80).trim(),
  phone: z.string().min(7).max(24).trim().optional(),
  password: passwordSchema,
});
