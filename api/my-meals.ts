import { httpClient } from "@/lib/http-client";
import type { MyMealSessionViewDto } from "@/types/api";

/* ----------------------------------------------------------------------------
 * My meals (P2-03 follow-up): endpoint doc self-service cho nhan vien.
 * Guard registration:self; acting employee luon la nhan vien gan voi principal,
 * nen KHONG truyen employee id hay factory id.
 * ------------------------------------------------------------------------- */

/**
 * GET /my-meals/sessions : cac session nhan vien du dieu kien dang ky (dung
 * factory, status PUBLISHED/OPEN, serviceDate hom nay tro di theo gio HCM).
 */
export function getMyMealSessions(signal?: AbortSignal): Promise<MyMealSessionViewDto[]> {
  return httpClient.get<MyMealSessionViewDto[]>("/my-meals/sessions", { signal });
}

/**
 * GET /my-meals/sessions/:mealSessionId : mot session du dieu kien. Session cua
 * factory khac tra 404.
 */
export function getMyMealSession(
  mealSessionId: string,
  signal?: AbortSignal,
): Promise<MyMealSessionViewDto> {
  return httpClient.get<MyMealSessionViewDto>(`/my-meals/sessions/${mealSessionId}`, { signal });
}
