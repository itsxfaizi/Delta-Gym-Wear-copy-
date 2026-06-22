import "server-only";

import NextAuth, { type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import zxcvbn from "zxcvbn";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/env";
import { loginSchema } from "@/lib/validations/auth";

class UnauthorizedError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

class ForbiddenError extends Error {
  constructor(message = "Insufficient permissions.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function isAdminRole(role: Role) {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    // Credentials auth in Auth.js requires JWT sessions; DB session tables remain for OAuth/account revocation workflows.
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  pages: {
    signIn: "/account/login",
  },
  providers: [
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const strength = zxcvbn(parsed.data.password);
        if (strength.score < 2) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            passwordHash: true,
            role: true,
            isActive: true,
          },
        });

        if (!user?.passwordHash || !user.isActive) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          isActive: user.isActive,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (!user.id) return token;
        token.id = user.id;
        token.role = user.role;
        token.isActive = user.isActive;
        return token;
      }

      if (token.id) {
        const currentUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, isActive: true },
        });
        token.role = currentUser?.role ?? Role.CUSTOMER;
        token.isActive = currentUser?.isActive ?? false;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.isActive = token.isActive;
      return session;
    },
  },
});

export function requireAuth(session: Session | null) {
  if (!session?.user?.id || !session.user.isActive) {
    throw new UnauthorizedError();
  }

  return session;
}

export function requireAdmin(session: Session | null) {
  const activeSession = requireAuth(session);
  if (!isAdminRole(activeSession.user.role)) {
    throw new ForbiddenError();
  }

  return activeSession;
}
