import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      !cloudName.startsWith("<") &&
      !apiKey.startsWith("<")
  );
}

export function initCloudinary() {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!.trim(),
      api_key: process.env.CLOUDINARY_API_KEY!.trim(),
      api_secret: process.env.CLOUDINARY_API_SECRET!.trim(),
      secure: true,
    });
  }
}

export interface CloudinaryUploadOptions {
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  publicId?: string;
  width: number;
  height: number;
  provider: "cloudinary" | "local_mongodb";
}

/**
 * Uploads an image to Cloudinary with automatic optimization, sizing and facial gravity.
 */
export async function uploadImage(
  dataUri: string,
  options: CloudinaryUploadOptions = {}
): Promise<UploadResult> {
  const targetWidth = options.width || 800;
  const targetHeight = options.height || 1000;
  const crop = options.crop || "fill";
  const gravity = options.gravity || "face";
  const folder = options.folder || "ahsan-fitness-profile";

  if (isCloudinaryConfigured()) {
    initCloudinary();

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      public_id: "trainer_ahsan_profile",
      overwrite: true,
      invalidate: true,
      transformation: [
        {
          width: targetWidth,
          height: targetHeight,
          crop,
          gravity,
        },
        {
          quality: "auto:best",
          fetch_format: "auto",
        },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      provider: "cloudinary",
    };
  }

  // Fallback: If Cloudinary keys are not yet provided in .env.local,
  // return the formatted base64 with requested width & height for MongoDB persistence
  return {
    url: dataUri,
    width: targetWidth,
    height: targetHeight,
    provider: "local_mongodb",
  };
}

export async function deleteImage(publicId?: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return true;
  initCloudinary();

  try {
    const id = publicId || "ahsan-fitness-profile/trainer_ahsan_profile";
    await cloudinary.uploader.destroy(id, { invalidate: true });
    return true;
  } catch {
    return false;
  }
}

