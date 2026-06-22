import "server-only";

type HitBucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, HitBucket>();

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function limitByIp(key: string, ip: string, max: number, windowMs: number) {
  const now = Date.now();
  const bucketKey = `${key}:${ip}`;
  const current = buckets.get(bucketKey);
  const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  buckets.set(bucketKey, bucket);

  return {
    success: bucket.count <= max,
    remaining: Math.max(0, max - bucket.count),
    resetAt: bucket.resetAt,
  };
}
