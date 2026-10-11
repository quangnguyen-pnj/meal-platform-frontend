import { httpClient } from "@/lib/http-client";
import type { CreateDishRequest, DishDto, UpdateDishRequest } from "@/types/api";

/** GET /dishes: catalog mon an theo scope. Them ?includeInactive=true de lay ca mon da tat. */
export function listDishes(includeInactive: boolean, signal?: AbortSignal): Promise<DishDto[]> {
  const query = includeInactive ? "?includeInactive=true" : "";
  return httpClient.get<DishDto[]>(`/dishes${query}`, { signal });
}

export function createDish(input: CreateDishRequest): Promise<DishDto> {
  return httpClient.post<DishDto>("/dishes", input);
}

export function updateDish(id: string, input: UpdateDishRequest): Promise<DishDto> {
  return httpClient.patch<DishDto>(`/dishes/${id}`, input);
}

export function disableDish(id: string): Promise<DishDto> {
  return httpClient.post<DishDto>(`/dishes/${id}/disable`);
}

export function enableDish(id: string): Promise<DishDto> {
  return httpClient.post<DishDto>(`/dishes/${id}/enable`);
}
