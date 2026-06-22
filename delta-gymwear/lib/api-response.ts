import { ZodError } from "zod";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export function ok<T>(data: T, init?: ResponseInit) {
  return Response.json({ data }, init);
}

export function fail(code: ApiErrorCode, message: string, status: number, details?: unknown) {
  return Response.json({ error: { code, message, details } }, { status });
}

export function validationFail(error: ZodError) {
  return fail("BAD_REQUEST", "Invalid request input.", 400, error.flatten().fieldErrors);
}

export async function parseJson<T>(request: Request, parse: (value: unknown) => T) {
  try {
    const body: unknown = await request.json();
    return { data: parse(body), error: null };
  } catch (error: unknown) {
    if (error instanceof ZodError) return { data: null, error: validationFail(error) };
    return { data: null, error: fail("BAD_REQUEST", "Request body must be valid JSON.", 400) };
  }
}
