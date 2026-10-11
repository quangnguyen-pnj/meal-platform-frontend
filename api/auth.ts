import { httpClient } from "@/lib/http-client";
import type { AuthMeResponse, AuthTokens, LoginRequest } from "@/types/api";

/** POST /auth/login. Khong gan Bearer vi chua co phien. */
export function login(input: LoginRequest): Promise<AuthTokens> {
  return httpClient.post<AuthTokens>("/auth/login", input, { skipAuth: true });
}

/** POST /auth/logout. Vo hieu refresh session o backend. */
export function logout(refreshToken: string): Promise<void> {
  return httpClient.post<void>("/auth/logout", { refreshToken }, { skipAuth: true });
}

/** GET /auth/me: principal kem roles/permissions/scopeGrants. */
export function getMe(signal?: AbortSignal): Promise<AuthMeResponse> {
  return httpClient.get<AuthMeResponse>("/auth/me", { signal });
}
