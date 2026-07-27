import multer from "multer";
import { AppError } from "./AppError.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new AppError("Only JPG, PNG, and WEBP files are allowed.", 400));
      return;
    }

    cb(null, true);
  },
});
