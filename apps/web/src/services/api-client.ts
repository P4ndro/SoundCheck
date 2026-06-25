import { env } from "@/lib/env";
import { normalizeInviteCode } from "@/lib/invite-code";
import type {
  BandRole,
  BandWorkspace,
  BandEvent,
  ChatMessage,
  MemberProfile,
  OnboardingState,
  Setlist,
  Song,
  User,
} from "@/types";
import type { CreateSongInput } from "@/services/songs";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type TokenGetter = () => Promise<string | null>;

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  getToken: TokenGetter;
  body?: unknown;
  /** Retry count for transient failures (default 0). */
  retries?: number;
  /** Request timeout in ms (default 25s). */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 25_000;

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, "Request timed out");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRetryableStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

export async function apiFetch<T>(
  path: string,
  {
    getToken,
    body,
    headers,
    retries = 0,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    ...init
  }: ApiFetchOptions,
): Promise<T> {
  const token = await getToken();

  if (!token) {
    throw new ApiError(401, "Not signed in");
  }

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Authorization", `Bearer ${token}`);

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        `${env.apiUrl}${path}`,
        {
          ...init,
          headers: requestHeaders,
          body: body !== undefined ? JSON.stringify(body) : undefined,
        },
        timeoutMs,
      );

      if (response.status === 204) {
        return undefined as T;
      }

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          payload && typeof payload === "object" && "error" in payload
            ? String(payload.error)
            : response.statusText;

        if (attempt < retries && isRetryableStatus(response.status)) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          continue;
        }

        throw new ApiError(response.status, message || "Request failed");
      }

      return payload as T;
    } catch (error) {
      lastError = error;
      const retryable =
        error instanceof ApiError
          ? isRetryableStatus(error.status)
          : error instanceof TypeError;

      if (attempt < retries && retryable) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export interface MeResponse {
  user: User;
  bands: {
    id: string;
    name: string;
    role: string;
    joinedAt: string;
  }[];
  onboarding: OnboardingState;
}

export interface UpdateProfileInput {
  primaryRole: BandRole;
  customRoleLabel?: string;
}

export interface CreateBandResponse {
  band: { id: string; name: string; createdAt: string };
  inviteCode: string;
}

export interface JoinBandResponse {
  band: { id: string; name: string; createdAt: string };
}

export interface BandInviteResponse {
  code: string;
  shareUrl: string;
  status: "active" | "expired";
}

export function fetchMe(getToken: TokenGetter): Promise<MeResponse> {
  return apiFetch<MeResponse>("/api/me", {
    method: "GET",
    getToken,
    retries: 1,
  });
}

export function updateProfileRequest(
  data: UpdateProfileInput,
  getToken: TokenGetter,
): Promise<{ user: User; onboarding: OnboardingState }> {
  return apiFetch<{ user: User; onboarding: OnboardingState }>(
    "/api/me/profile",
    {
      method: "PATCH",
      getToken,
      body: data,
    },
  );
}

export function createBandRequest(
  name: string,
  getToken: TokenGetter,
): Promise<CreateBandResponse> {
  return apiFetch<CreateBandResponse>("/api/bands", {
    method: "POST",
    getToken,
    body: { name },
  });
}

export function joinBandRequest(
  code: string,
  getToken: TokenGetter,
): Promise<JoinBandResponse> {
  return apiFetch<JoinBandResponse>("/api/bands/join", {
    method: "POST",
    getToken,
    body: { code: normalizeInviteCode(code) },
  });
}

export function fetchBandInvite(
  bandId: string,
  getToken: TokenGetter,
): Promise<BandInviteResponse> {
  return apiFetch<BandInviteResponse>(`/api/bands/${bandId}/invite`, {
    method: "GET",
    getToken,
  });
}

export function fetchWorkspace(
  bandId: string,
  getToken: TokenGetter,
): Promise<BandWorkspace> {
  return apiFetch<BandWorkspace>(`/api/bands/${bandId}/workspace`, {
    method: "GET",
    getToken,
    retries: 1,
  });
}

export function createSongRequest(
  bandId: string,
  data: CreateSongInput,
  getToken: TokenGetter,
): Promise<{ song: Song }> {
  return apiFetch<{ song: Song }>(`/api/bands/${bandId}/songs`, {
    method: "POST",
    getToken,
    body: data,
  });
}

export function updateSongRequest(
  bandId: string,
  songId: string,
  data: Partial<CreateSongInput>,
  getToken: TokenGetter,
): Promise<{ song: Song }> {
  return apiFetch<{ song: Song }>(`/api/bands/${bandId}/songs/${songId}`, {
    method: "PATCH",
    getToken,
    body: data,
  });
}

export interface CreateSetlistInput {
  name: string;
  description: string;
}

export function createSetlistRequest(
  bandId: string,
  data: CreateSetlistInput,
  getToken: TokenGetter,
): Promise<{ setlist: Setlist }> {
  return apiFetch<{ setlist: Setlist }>(`/api/bands/${bandId}/setlists`, {
    method: "POST",
    getToken,
    body: data,
  });
}

export function duplicateSetlistRequest(
  bandId: string,
  setlistId: string,
  getToken: TokenGetter,
): Promise<{ setlist: Setlist }> {
  return apiFetch<{ setlist: Setlist }>(
    `/api/bands/${bandId}/setlists/${setlistId}/duplicate`,
    {
      method: "POST",
      getToken,
    },
  );
}

export function deleteSetlistRequest(
  bandId: string,
  setlistId: string,
  getToken: TokenGetter,
): Promise<void> {
  return apiFetch<void>(`/api/bands/${bandId}/setlists/${setlistId}`, {
    method: "DELETE",
    getToken,
  });
}

export function addSongToSetlistRequest(
  bandId: string,
  setlistId: string,
  songId: string,
  getToken: TokenGetter,
): Promise<{ setlist: Setlist }> {
  return apiFetch<{ setlist: Setlist }>(
    `/api/bands/${bandId}/setlists/${setlistId}/items`,
    {
      method: "POST",
      getToken,
      body: { songId },
    },
  );
}

export function removeSongFromSetlistRequest(
  bandId: string,
  setlistId: string,
  songId: string,
  getToken: TokenGetter,
): Promise<{ setlist: Setlist }> {
  return apiFetch<{ setlist: Setlist }>(
    `/api/bands/${bandId}/setlists/${setlistId}/items/${songId}`,
    {
      method: "DELETE",
      getToken,
    },
  );
}

export function reorderSetlistRequest(
  bandId: string,
  setlistId: string,
  songIds: string[],
  getToken: TokenGetter,
): Promise<{ setlist: Setlist }> {
  return apiFetch<{ setlist: Setlist }>(
    `/api/bands/${bandId}/setlists/${setlistId}/items/order`,
    {
      method: "PUT",
      getToken,
      body: { songIds },
    },
  );
}

export interface CreateEventInput {
  title: string;
  type: BandEvent["type"];
  start: string;
  end: string;
  location: string;
  notes: string;
  setlistId?: string;
}

export function createEventRequest(
  bandId: string,
  data: CreateEventInput,
  getToken: TokenGetter,
): Promise<{ event: BandEvent }> {
  return apiFetch<{ event: BandEvent }>(`/api/bands/${bandId}/events`, {
    method: "POST",
    getToken,
    body: data,
  });
}

export function updateEventRequest(
  bandId: string,
  eventId: string,
  data: Partial<CreateEventInput>,
  getToken: TokenGetter,
): Promise<{ event: BandEvent }> {
  return apiFetch<{ event: BandEvent }>(
    `/api/bands/${bandId}/events/${eventId}`,
    {
      method: "PATCH",
      getToken,
      body: data,
    },
  );
}

export function deleteEventRequest(
  bandId: string,
  eventId: string,
  getToken: TokenGetter,
): Promise<void> {
  return apiFetch<void>(`/api/bands/${bandId}/events/${eventId}`, {
    method: "DELETE",
    getToken,
  });
}

export function fetchMemberProfile(
  bandId: string,
  userId: string,
  getToken: TokenGetter,
): Promise<MemberProfile> {
  return apiFetch<MemberProfile>(
    `/api/bands/${bandId}/members/${userId}`,
    {
      method: "GET",
      getToken,
    },
  );
}

export function fetchChatMessages(
  bandId: string,
  getToken: TokenGetter,
): Promise<{ messages: ChatMessage[] }> {
  return apiFetch<{ messages: ChatMessage[] }>(
    `/api/bands/${bandId}/chat/messages`,
    {
      method: "GET",
      getToken,
    },
  );
}

export type SendChatMessageData =
  | { text: string }
  | { imageUrl: string; imageCaption?: string };

export function sendChatMessageRequest(
  bandId: string,
  data: SendChatMessageData,
  getToken: TokenGetter,
): Promise<{ message: ChatMessage }> {
  return apiFetch<{ message: ChatMessage }>(
    `/api/bands/${bandId}/chat/messages`,
    {
      method: "POST",
      getToken,
      body: data,
    },
  );
}

export async function uploadChatImageRequest(
  bandId: string,
  file: Blob,
  fileName: string,
  getToken: TokenGetter,
): Promise<{ imageUrl: string }> {
  const token = await getToken();

  if (!token) {
    throw new ApiError(401, "Not signed in");
  }

  const formData = new FormData();
  formData.append("image", file, fileName);

  const response = await fetchWithTimeout(
    `${env.apiUrl}/api/bands/${bandId}/chat/uploads`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
    DEFAULT_TIMEOUT_MS,
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : response.statusText;
    throw new ApiError(response.status, message);
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    !("imageUrl" in payload) ||
    typeof payload.imageUrl !== "string"
  ) {
    throw new ApiError(500, "Invalid upload response");
  }

  return { imageUrl: payload.imageUrl };
}
