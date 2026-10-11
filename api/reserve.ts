import { httpClient } from "@/lib/http-client";
import type {
  ConfigureReservePoolRequest,
  CreateReserveAllocationRequest,
  ReserveAllocationViewDto,
  ReservePoolViewDto,
} from "@/types/api";

/**
 * REST wrapper cho reserve pool (P2-10/P2-11). Moi endpoint nam duoi mot
 * session cu the va can quyen reserve:manage; backend luon loc theo scope.
 */

/**
 * GET /meal-sessions/:id/reserve-pool : hạn mức du phong theo tung mon cua
 * session (mot phan tu moi mon).
 */
export function getReservePool(
  mealSessionId: string,
  signal?: AbortSignal,
): Promise<ReservePoolViewDto[]> {
  return httpClient.get<ReservePoolViewDto[]>(`/meal-sessions/${mealSessionId}/reserve-pool`, {
    signal,
  });
}

/**
 * POST /meal-sessions/:id/reserve-pool/dishes/:mealSessionDishId : cau hinh
 * bat/tat va hạn mức cho mot mon. Chi hop le TRUOC cutoff; sau cutoff backend
 * tra CONFLICT, quantity nho hon so da cap tra VALIDATION_ERROR.
 */
export function configureReservePool(
  mealSessionId: string,
  mealSessionDishId: string,
  input: ConfigureReservePoolRequest,
): Promise<ReservePoolViewDto> {
  return httpClient.post<ReservePoolViewDto>(
    `/meal-sessions/${mealSessionId}/reserve-pool/dishes/${mealSessionDishId}`,
    input,
  );
}

/**
 * POST /meal-sessions/:id/reserve-pool/allocations : cap mot suat du phong SAU
 * cutoff. Pool tat/khong co -> CONFLICT; vuot remaining -> CONFLICT; reason
 * rong -> VALIDATION_ERROR.
 */
export function createReserveAllocation(
  mealSessionId: string,
  input: CreateReserveAllocationRequest,
): Promise<ReserveAllocationViewDto> {
  return httpClient.post<ReserveAllocationViewDto>(
    `/meal-sessions/${mealSessionId}/reserve-pool/allocations`,
    input,
  );
}
