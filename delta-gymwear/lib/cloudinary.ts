import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { env } from "@/lib/env";

export function getCloudinary() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary credentials are not configured.");
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  return cloudinary;
}

const allowedImageMimeTypes = ["image/jpeg", "image/png", "image/webp"] as const;

export function assertAllowedImage(file: File) {
  if (!allowedImageMimeTypes.includes(file.type as (typeof allowedImageMimeTypes)[number])) {
    throw new Error("Unsupported image type.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5MB or smaller.");
  }
}
