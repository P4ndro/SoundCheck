import { asyncHandler } from "../../lib/async-handler.js";
import { uploadBandChatImage } from "../../lib/cloudinary.js";
import {
  createChatMessage,
  listChatMessages,
  serializeChatMessageRecord,
} from "../../lib/chat-service.js";
import { bandIdFromRequest } from "../../lib/request-params.js";
import { chatImageUploadMiddleware } from "../../middleware/chat-image-upload.js";
import { ApiError } from "../../middleware/error-handler.js";
import { validate } from "../../middleware/validate.js";
import {
  createChatMessageSchema,
  listChatMessagesQuerySchema,
} from "../../schemas/chat.js";
import type {
  CreateChatMessageInput,
  ListChatMessagesQuery,
} from "../../schemas/chat.js";
import { Router } from "express";

export const chatRouter = Router({ mergeParams: true });

chatRouter.get(
  "/messages",
  validate(listChatMessagesQuerySchema, "query"),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const { after, limit } = req.validatedQuery as ListChatMessagesQuery;

    const messages = await listChatMessages(bandId, {
      after: after ? new Date(after) : undefined,
      limit,
    });

    res.json({
      messages: messages.map(serializeChatMessageRecord),
    });
  }),
);

chatRouter.post(
  "/messages",
  validate(createChatMessageSchema),
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const body = req.body as CreateChatMessageInput;

    const message = body.imageUrl
      ? await createChatMessage(bandId, req.dbUser!.id, {
          type: "image",
          imageUrl: body.imageUrl,
          imageCaption: body.imageCaption ?? body.text,
        })
      : await createChatMessage(bandId, req.dbUser!.id, {
          type: "text",
          text: body.text!,
        });

    res.status(201).json({ message: serializeChatMessageRecord(message) });
  }),
);

chatRouter.post(
  "/uploads",
  chatImageUploadMiddleware,
  asyncHandler(async (req, res) => {
    const bandId = bandIdFromRequest(req);
    const file = req.file;

    if (!file) {
      throw new ApiError(400, "Image file is required");
    }

    const imageUrl = await uploadBandChatImage(bandId, file.buffer);

    res.status(201).json({ imageUrl });
  }),
);
