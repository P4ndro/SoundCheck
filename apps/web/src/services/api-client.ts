import { env } from "@/lib/env";
import type { BandRole, BandWorkspace, OnboardingState, Song, User } from "@/types";
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
}

export async function apiFetch<T>(
  path: string,
  { getToken, body, headers, ...init }: ApiFetchOptions,
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

  const response = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? String(payload.error)
        : response.statusText;
    throw new ApiError(response.status, message || "Request failed");
  }

  return payload as T;
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

export function fetchMe(getToken: TokenGetter): Promise<MeResponse> {
  return apiFetch<MeResponse>("/api/me", { method: "GET", getToken });
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
    body: { code },
  });
}

export function fetchWorkspace(
  bandId: string,
  getToken: TokenGetter,
): Promise<BandWorkspace> {
  return apiFetch<BandWorkspace>(`/api/bands/${bandId}/workspace`, {
    method: "GET",
    getToken,
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
