import type { NextRequest } from "next/server";
import { handlers } from "@/lib/auth";
import { fail } from "@/lib/api-response";
import { getClientIp, limitByIp } from "@/lib/rate-limit";

function withAuthRateLimit(request: NextRequest, handler: (request: NextRequest) => Promise<Response>) {
  const rate = limitByIp("auth", getClientIp(request), 10, 60_000);
  if (!rate.success) return fail("RATE_LIMITED", "Too many auth requests.", 429);
  return handler(request);
}

export function GET(request: NextRequest) {
  return withAuthRateLimit(request, handlers.GET);
}

export function POST(request: NextRequest) {
  return withAuthRateLimit(request, handlers.POST);
}
