import type { AuthTokens } from "@/types/api";

/**
 * Luu tru token cho SPA dev.
 *
 * Giu token trong bo nho (nguon su that khi tab dang mo) va dong bo xuong
 * localStorage de reload trang khong mat phien. Backend dung Bearer trong
 * header nen token can doc duoc tu JS; day la danh doi chap nhan duoc cho moi
 * truong dev local. Refresh token xoay vong moi lan refresh, nen luon ghi de
 * ban moi nhat.
 */

const STORAGE_KEY = "meal-platform.auth-tokens";

let tokensInMemory: AuthTokens | null = null;
let hydrated = false;

type Listener = () => void;
const listeners = new Set<Listener>();

function isAuthTokens(value: unknown): value is AuthTokens {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.accessToken === "string" &&
    typeof candidate.refreshToken === "string" &&
    candidate.tokenType === "Bearer" &&
    typeof candidate.expiresIn === "number"
  );
}

function hydrateFromStorage(): void {
  if (hydrated || typeof window === "undefined") {
    return;
  }
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed: unknown = JSON.parse(raw);
    if (isAuthTokens(parsed)) {
      tokensInMemory = parsed;
    }
  } catch {
    tokensInMemory = null;
  }
}

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** Doc token hien tai, hydrate tu localStorage o lan goi dau tien. */
export function getTokens(): AuthTokens | null {
  hydrateFromStorage();
  return tokensInMemory;
}

export function getAccessToken(): string | null {
  return getTokens()?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return getTokens()?.refreshToken ?? null;
}

/** Ghi de token (dung sau login va sau moi lan refresh xoay vong). */
export function setTokens(tokens: AuthTokens): void {
  hydrated = true;
  tokensInMemory = tokens;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  }
  notify();
}

/** Xoa token khi logout hoac khi refresh that bai. */
export function clearTokens(): void {
  hydrated = true;
  tokensInMemory = null;
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  notify();
}

/**
 * Dang ky lang nghe thay doi token va goi listener ngay mot lan de ban dong
 * bo trang thai hien tai (gom ca token da hydrate tu localStorage sau mount).
 */
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  listener();
  return () => {
    listeners.delete(listener);
  };
}
