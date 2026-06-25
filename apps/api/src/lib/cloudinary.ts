import { env } from "../config/env.js";
import { ApiError } from "../middleware/error-handler.js";
import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME &&
      env.CLOUDINARY_API_KEY &&
      env.CLOUDINARY_API_SECRET,
  );
}

export function assertCloudinaryConfigured(): void {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(503, "Image uploads are not configured");
  }
}

function getCloudinaryClient() {
  assertCloudinaryConfigured();

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}

export async function uploadBandChatImage(
  bandId: string,
  buffer: Buffer,
): Promise<string> {
  const client = getCloudinaryClient();

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: `soundcheck/bands/${bandId}/chat`,
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error) {
          reject(error);
          return;
        }

        if (!uploadResult?.secure_url) {
          reject(new Error("Cloudinary upload returned no URL"));
          return;
        }

        resolve({ secure_url: uploadResult.secure_url });
      },
    );

    stream.end(buffer);
  });

  return result.secure_url;
}
