import { ApiError } from "./error-handler.js";
import type { NextFunction, Request, Response } from "express";
import multer, { MulterError } from "multer";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new ApiError(400, "Only image files are allowed"));
      return;
    }

    callback(null, true);
  },
});

export function chatImageUploadMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  upload.single("image")(req, res, (error) => {
    if (error instanceof MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(new ApiError(413, "Image must be 5 MB or smaller"));
        return;
      }

      next(new ApiError(400, error.message));
      return;
    }

    if (error) {
      next(error);
      return;
    }

    next();
  });
}
