import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { createId } from "@/lib/create-id";
import { queryKeys } from "@/lib/query-keys";
import {
  sendChatMessageRequest,
  uploadChatImageRequest,
} from "@/services/api-client";
import { useToast } from "@/providers/ToastProvider";
import type { ChatMessage } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface SendChatMessagePayload {
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
}

type ChatQueryData = { messages: ChatMessage[] };

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

function extensionForBlob(blob: Blob): string {
  const subtype = blob.type.split("/")[1];
  if (!subtype || subtype === "jpeg") return "jpg";
  return subtype;
}

export function useSendChatMessage(bandId: string | undefined) {
  const { getToken, isSignedIn } = useAuth();
  const { currentUser } = useBandWorkspace();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: SendChatMessagePayload) => {
      if (!bandId) {
        throw new Error("No active band");
      }

      const caption = payload.text?.trim() || payload.imageCaption?.trim();

      if (payload.imageUrl) {
        let imageUrl = payload.imageUrl;

        if (imageUrl.startsWith("data:")) {
          const blob = await dataUrlToBlob(imageUrl);
          const uploaded = await uploadChatImageRequest(
            bandId,
            blob,
            `photo.${extensionForBlob(blob)}`,
            getToken,
          );
          imageUrl = uploaded.imageUrl;
        }

        return sendChatMessageRequest(
          bandId,
          {
            imageUrl,
            imageCaption: caption || undefined,
          },
          getToken,
        );
      }

      const text = payload.text?.trim();
      if (!text) {
        throw new Error("Message cannot be empty");
      }

      return sendChatMessageRequest(bandId, { text }, getToken);
    },
    onMutate: async (payload) => {
      if (!bandId || !isSignedIn) return undefined;

      const text = payload.text?.trim();
      const imageUrl = payload.imageUrl;

      if (!text && !imageUrl) return undefined;

      await queryClient.cancelQueries({ queryKey: queryKeys.chat(bandId) });

      const previous = queryClient.getQueryData<ChatQueryData>(
        queryKeys.chat(bandId),
      );

      const optimisticId = createId("msg");
      const optimistic: ChatMessage = imageUrl
        ? {
            id: optimisticId,
            bandId,
            senderId: currentUser.id,
            type: "image",
            imageUrl,
            imageCaption: text,
            createdAt: new Date().toISOString(),
          }
        : {
            id: optimisticId,
            bandId,
            senderId: currentUser.id,
            type: "text",
            text: text!,
            createdAt: new Date().toISOString(),
          };

      queryClient.setQueryData<ChatQueryData>(queryKeys.chat(bandId), (old) => ({
        messages: [...(old?.messages ?? []), optimistic],
      }));

      return { previous, optimisticId };
    },
    onSuccess: (data, _payload, context) => {
      if (!bandId || !context?.optimisticId) return;

      queryClient.setQueryData<ChatQueryData>(queryKeys.chat(bandId), (old) => ({
        messages: (old?.messages ?? [])
          .filter((message) => message.id !== context.optimisticId)
          .concat(data.message),
      }));
    },
    onError: (error, _payload, context) => {
      if (bandId && context?.previous) {
        queryClient.setQueryData(queryKeys.chat(bandId), context.previous);
      }

      const message =
        error instanceof Error ? error.message : "Failed to send message";
      toast(message, "info");
    },
  });
}
