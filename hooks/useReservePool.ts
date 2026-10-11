import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { configureReservePool, createReserveAllocation, getReservePool } from "@/api/reserve";
import type { ApiError } from "@/lib/api-error";
import { toReservePoolRows, type ReservePoolRowView } from "@/mappers/reserve";
import type {
  ConfigureReservePoolRequest,
  CreateReserveAllocationRequest,
  ReserveAllocationViewDto,
} from "@/types/api";

function reservePoolQueryKey(mealSessionId: string | null) {
  return ["reserve-pool", mealSessionId] as const;
}

/**
 * Hạn mức du phong theo mon cua mot session. Chi chay khi da co session id; du
 * lieu da duoc backend loc theo scope (ngoai scope -> FORBIDDEN).
 */
export function useReservePool(mealSessionId: string | null) {
  return useQuery<ReservePoolRowView[], ApiError>({
    queryKey: reservePoolQueryKey(mealSessionId),
    queryFn: async ({ signal }) => toReservePoolRows(await getReservePool(mealSessionId!, signal)),
    enabled: mealSessionId !== null,
  });
}

interface ConfigureVariables {
  mealSessionDishId: string;
  input: ConfigureReservePoolRequest;
}

/**
 * Mutations cho reserve pool cua mot session: cau hinh (truoc cutoff) va cap
 * suat (sau cutoff). Moi lan thanh cong lam moi query pool de allocated/
 * remaining phan anh so lieu moi nhat tu backend.
 *
 * Backend chua co endpoint liet ke allocation, nen hook giu danh sach cac
 * allocation vua tao trong phien (tach biet voi registration thuong) de admin
 * thay ngay ket qua. `reason` bat buoc duoc chan o form truoc khi goi mutation.
 */
export function useReservePoolMutations(mealSessionId: string | null) {
  const queryClient = useQueryClient();
  const invalidatePool = () =>
    queryClient.invalidateQueries({ queryKey: reservePoolQueryKey(mealSessionId) });

  const configure = useMutation<unknown, ApiError, ConfigureVariables>({
    mutationFn: ({ mealSessionDishId, input }) =>
      configureReservePool(mealSessionId!, mealSessionDishId, input),
    onSuccess: invalidatePool,
  });

  const allocate = useMutation<ReserveAllocationViewDto, ApiError, CreateReserveAllocationRequest>({
    mutationFn: (input) => createReserveAllocation(mealSessionId!, input),
    onSuccess: invalidatePool,
  });

  return { configure, allocate };
}
