import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getMyMealSessions } from "@/api/my-meals";
import { cancelSelfRegistration, upsertSelfRegistration } from "@/api/meal-sessions";
import type { ApiError } from "@/lib/api-error";
import { toMyMealsSessionViews, type MyMealsSessionView } from "@/mappers/my-meals";

const MY_MEALS_SESSIONS_KEY = ["my-meals", "sessions"] as const;

/**
 * Danh sach "Bua an cua toi": cac session nhan vien du dieu kien dang ky.
 * Backend da loc theo factory/status/ngay va resolve ten mon, nen hook chi
 * goi mot endpoint roi dinh hinh thanh view model.
 */
export function useMyMealsSessions(enabled: boolean) {
  return useQuery<MyMealsSessionView[], ApiError>({
    queryKey: MY_MEALS_SESSIONS_KEY,
    queryFn: async ({ signal }) => {
      const sessions = await getMyMealSessions(signal);
      return toMyMealsSessionViews(sessions);
    },
    enabled,
  });
}

/**
 * Mutation chon/doi mon va huy dang ky. Moi lan thanh cong lam moi danh sach
 * my-meals de lua chon va trang thai cua so cap nhat ngay.
 */
export function useMyMealsMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: MY_MEALS_SESSIONS_KEY });

  const pick = useMutation<unknown, ApiError, { mealSessionId: string; mealSessionDishId: string }>(
    {
      mutationFn: ({ mealSessionId, mealSessionDishId }) =>
        upsertSelfRegistration(mealSessionId, { mealSessionDishId }),
      onSuccess: invalidate,
    },
  );

  const cancel = useMutation<unknown, ApiError, { mealSessionId: string }>({
    mutationFn: ({ mealSessionId }) => cancelSelfRegistration(mealSessionId),
    onSuccess: invalidate,
  });

  return { pick, cancel };
}
