import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelMealSession,
  closeMealSession,
  createMealSessions,
  listMealSessions,
  openMealSession,
  publishMealSession,
  type MealSessionFilter,
} from "@/api/meal-sessions";
import type { ApiError } from "@/lib/api-error";
import { toMealSessionViews, type MealSessionView } from "@/mappers/meal-session";
import type { CreateMealSessionsRequest } from "@/types/api";

function mealSessionsQueryKey(filter: MealSessionFilter | null) {
  return ["meal-sessions", filter?.factoryId ?? null, filter?.serviceDate ?? null] as const;
}

/**
 * Danh sach session cho mot factory (va ngay vận hành tuy chon). Chi chay khi
 * da chon factory; danh sach da duoc backend loc theo scope.
 */
export function useMealSessions(filter: MealSessionFilter | null) {
  return useQuery<MealSessionView[], ApiError>({
    queryKey: mealSessionsQueryKey(filter),
    queryFn: async ({ signal }) => toMealSessionViews(await listMealSessions(filter!, signal)),
    enabled: filter !== null,
  });
}

/**
 * Mutation tao session va cac lenh lifecycle (publish/open/close/cancel). Moi
 * lan thanh cong lam moi toan bo danh sach meal-sessions.
 */
export function useMealSessionMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["meal-sessions"] });

  const create = useMutation<unknown, ApiError, CreateMealSessionsRequest>({
    mutationFn: (input) => createMealSessions(input),
    onSuccess: invalidate,
  });
  const publish = useMutation<unknown, ApiError, string>({
    mutationFn: (id) => publishMealSession(id),
    onSuccess: invalidate,
  });
  const open = useMutation<unknown, ApiError, string>({
    mutationFn: (id) => openMealSession(id),
    onSuccess: invalidate,
  });
  const close = useMutation<unknown, ApiError, string>({
    mutationFn: (id) => closeMealSession(id),
    onSuccess: invalidate,
  });
  const cancel = useMutation<unknown, ApiError, string>({
    mutationFn: (id) => cancelMealSession(id),
    onSuccess: invalidate,
  });

  return { create, publish, open, close, cancel };
}
