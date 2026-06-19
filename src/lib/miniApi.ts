import type { TierResult, TierTemplate } from "../types/tier";

export interface ComsUser {
  studentId: string;
  name: string;
  role?: string;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface MiniDocumentRequest<TPayload> {
  title: string;
  description: string;
  shared: boolean;
  payload: TPayload;
}

export interface MiniDocument<TPayload> {
  id: number;
  app: "tier";
  contentType: "template" | "result";
  contentId: string;
  title: string;
  description?: string | null;
  ownerStudentId: string;
  ownerName?: string | null;
  shared: boolean;
  shareSlug?: string | null;
  shareUrl?: string | null;
  payload: TPayload;
  createdAt: string;
  updatedAt: string;
  sharedAt?: string | null;
}

type TierPayload = TierTemplate | TierResult;

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const app = "tier";

const apiUrl = (path: string): string => `${API_BASE}${path}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const userFromPayload = (value: unknown): ComsUser | null => {
  if (!isRecord(value) || typeof value.studentId !== "string" || typeof value.name !== "string") {
    return null;
  }
  return {
    studentId: value.studentId,
    name: value.name,
    role: typeof value.role === "string" ? value.role : undefined,
  };
};

const readApiError = async (response: Response, fallback: string): Promise<string> => {
  const data = (await response.json().catch(() => null)) as unknown;
  if (isRecord(data) && typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }
  return fallback;
};

const requestJson = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(apiUrl(path), {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`COMS API request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
};

export const getCurrentUser = async (): Promise<ComsUser | null> => {
  let response = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
  if (!response.ok && (response.status === 401 || response.status === 403)) {
    const refreshed = await fetch(apiUrl("/api/auth/refresh"), { method: "POST", credentials: "include" });
    if (refreshed.ok) {
      response = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
    }
  }
  if (!response.ok) {
    return null;
  }
  const data = (await response.json().catch(() => null)) as unknown;
  return userFromPayload(data);
};

export const loginComsUser = async (credentials: LoginCredentials): Promise<ComsUser> => {
  const response = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error(await readApiError(response, "로그인에 실패했습니다."));
  }
  const data = (await response.json().catch(() => null)) as unknown;
  const user = userFromPayload(data) ?? (await getCurrentUser());
  if (!user) {
    throw new Error("로그인 후 사용자 정보를 불러오지 못했습니다.");
  }
  return user;
};

export const logoutComsUser = async (): Promise<void> => {
  const response = await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
  if (!response.ok) {
    throw new Error(await readApiError(response, "로그아웃에 실패했습니다."));
  }
};

const topTierSummary = (result: TierResult): string => {
  const top = result.rows[0];
  const names = top?.items.map((item) => item.name).join(", ") || "비어 있음";
  return `${top?.row.name ?? "S"}티어: ${names}`;
};

export const toMiniDocumentRequest = (
  value: TierPayload,
  shared: boolean,
): MiniDocumentRequest<TierPayload> => {
  const isResult = "placements" in value;
  return {
    title: isResult ? value.templateTitle : value.title,
    description: isResult ? topTierSummary(value) : value.description,
    shared,
    payload: value,
  };
};

export const saveProfileDocument = async (
  contentType: "template" | "result",
  value: TierPayload,
  shared = false,
): Promise<MiniDocument<TierPayload>> =>
  requestJson<MiniDocument<TierPayload>>(`/api/mini-apps/${app}/profile/${contentType}/${value.id}`, {
    method: "PUT",
    body: JSON.stringify(toMiniDocumentRequest(value, shared)),
  });

export const trySaveProfileDocument = async (
  contentType: "template" | "result",
  value: TierPayload,
): Promise<MiniDocument<TierPayload> | null> => {
  try {
    return await saveProfileDocument(contentType, value);
  } catch {
    return null;
  }
};

export const shareProfileDocument = async (
  contentType: "template" | "result",
  value: TierPayload,
): Promise<MiniDocument<TierPayload>> => {
  await saveProfileDocument(contentType, value);
  return requestJson<MiniDocument<TierPayload>>(`/api/mini-apps/${app}/profile/${contentType}/${value.id}/share`, {
    method: "POST",
  });
};

export const listProfileDocuments = async (): Promise<MiniDocument<TierPayload>[]> =>
  requestJson<MiniDocument<TierPayload>[]>(`/api/mini-apps/${app}/profile`);

export const listSharedDocuments = async (): Promise<MiniDocument<TierPayload>[]> => {
  const response = await fetch(apiUrl(`/api/mini-apps/${app}/shared`), { credentials: "include" });
  if (!response.ok) {
    return [];
  }
  return response.json() as Promise<MiniDocument<TierPayload>[]>;
};

export const getSharedDocument = async (slug: string): Promise<MiniDocument<TierPayload>> => {
  const response = await fetch(apiUrl(`/api/mini-apps/${app}/shared/${slug}`), { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Shared tier not found: ${response.status}`);
  }
  return response.json() as Promise<MiniDocument<TierPayload>>;
};

export const uploadMediaFile = async (file: File, title: string): Promise<string> => {
  const form = new FormData();
  form.append("title", title.trim() || file.name);
  form.append("description", "COMS 티어표 항목 미디어");
  form.append("category", "GENERAL");
  form.append("file", file);
  const response = await fetch(apiUrl("/api/files"), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const data = (await response.json().catch(() => null)) as unknown;
  if (!response.ok || !isRecord(data) || typeof data.id !== "number") {
    throw new Error("미디어 업로드에 실패했습니다. COMS 로그인 상태를 확인해주세요.");
  }
  return apiUrl(`/api/files/${data.id}/inline`);
};
