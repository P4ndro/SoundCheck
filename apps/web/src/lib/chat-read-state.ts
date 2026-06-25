const STORAGE_PREFIX = "soundcheck:chatLastRead:";
export const CHAT_READ_CHANGE_EVENT = "soundcheck:chat-read-change";

export function getChatLastReadAt(bandId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${STORAGE_PREFIX}${bandId}`);
}

export function setChatLastReadAt(bandId: string, readAt: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}${bandId}`, readAt);
  window.dispatchEvent(
    new CustomEvent(CHAT_READ_CHANGE_EVENT, { detail: { bandId } }),
  );
}

export function subscribeChatReadState(onStoreChange: () => void): () => void {
  const handler = () => onStoreChange();

  window.addEventListener(CHAT_READ_CHANGE_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(CHAT_READ_CHANGE_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
