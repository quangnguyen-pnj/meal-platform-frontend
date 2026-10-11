import { httpClient } from "@/lib/http-client";
import type {
  CreateMealSessionsRequest,
  MealRegistrationDto,
  MealSessionDto,
  SelfRegistrationRequest,
  UpdateMealSessionRequest,
} from "@/types/api";

/** Bo loc cho GET /meal-sessions; factoryId bat buoc o UI, serviceDate tuy chon. */
export interface MealSessionFilter {
  factoryId: string;
  serviceDate?: string;
}

/** GET /meal-sessions?factoryId=&serviceDate= : danh sach da loc theo scope o backend. */
export function listMealSessions(
  filter: MealSessionFilter,
  signal?: AbortSignal,
): Promise<MealSessionDto[]> {
  const params = new URLSearchParams({ factoryId: filter.factoryId });
  if (filter.serviceDate) {
    params.set("serviceDate", filter.serviceDate);
  }
  return httpClient.get<MealSessionDto[]>(`/meal-sessions?${params.toString()}`, { signal });
}

/**
 * POST /meal-sessions : dan xuat cac session DRAFT tu mot weekly menu da
 * PUBLISHED. Tra ve danh sach session vua tao.
 */
export function createMealSessions(input: CreateMealSessionsRequest): Promise<MealSessionDto[]> {
  return httpClient.post<MealSessionDto[]>("/meal-sessions", input);
}

/** PATCH /meal-sessions/:id : chinh thoi gian, chi cho DRAFT. */
export function updateMealSession(
  id: string,
  input: UpdateMealSessionRequest,
): Promise<MealSessionDto> {
  return httpClient.patch<MealSessionDto>(`/meal-sessions/${id}`, input);
}

export function publishMealSession(id: string): Promise<MealSessionDto> {
  return httpClient.post<MealSessionDto>(`/meal-sessions/${id}/publish`);
}

export function openMealSession(id: string): Promise<MealSessionDto> {
  return httpClient.post<MealSessionDto>(`/meal-sessions/${id}/open`);
}

export function closeMealSession(id: string): Promise<MealSessionDto> {
  return httpClient.post<MealSessionDto>(`/meal-sessions/${id}/close`);
}

export function cancelMealSession(id: string): Promise<MealSessionDto> {
  return httpClient.post<MealSessionDto>(`/meal-sessions/${id}/cancel`);
}

/* ----------------------------------------------------------------------------
 * Self-registration (P2-03): nhan vien tu dang ky cho mot session cu the.
 * Acting employee luon la nhan vien gan voi principal; khong truyen employee id.
 * ------------------------------------------------------------------------- */

/** GET /meal-sessions/:id : chi tiet session (mon, cua so dang ky, cutoff). */
export function getMealSession(
  mealSessionId: string,
  signal?: AbortSignal,
): Promise<MealSessionDto> {
  return httpClient.get<MealSessionDto>(`/meal-sessions/${mealSessionId}`, { signal });
}

/**
 * POST /meal-sessions/:id/registrations/self : chon mon hoac doi mon. Chi mot
 * ban ghi moi session; backend tu quyet dinh tao moi hay cap nhat.
 */
export function upsertSelfRegistration(
  mealSessionId: string,
  input: SelfRegistrationRequest,
): Promise<MealRegistrationDto> {
  return httpClient.post<MealRegistrationDto>(
    `/meal-sessions/${mealSessionId}/registrations/self`,
    input,
  );
}

/** POST /meal-sessions/:id/registrations/self/cancel : huy dang ky (CANCELLED). */
export function cancelSelfRegistration(mealSessionId: string): Promise<MealRegistrationDto> {
  return httpClient.post<MealRegistrationDto>(
    `/meal-sessions/${mealSessionId}/registrations/self/cancel`,
  );
}
