import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";

interface UploadResult {
  publicId: string;
  secureUrl: string;
}

export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folderSuffix: string,
  filename: string,
  mimetype: string,
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${env.CLOUDINARY_FOLDER}/${folderSuffix}`,
        resource_type: "image",
        public_id: filename.replace(/\.[^/.]+$/, ""),
        overwrite: true,
        format: mimetype === "image/webp" ? "webp" : undefined,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
        });
      },
    );

    uploadStream.end(buffer);
  });
};

export const destroyCloudinaryAsset = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: "image",
  });
};
