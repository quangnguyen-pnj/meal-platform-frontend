import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createDish, disableDish, enableDish, listDishes, updateDish } from "@/api/dishes";
import type { ApiError } from "@/lib/api-error";
import { toDishViews, type DishView } from "@/mappers/dish";
import type { CreateDishRequest, UpdateDishRequest } from "@/types/api";

function dishesQueryKey(includeInactive: boolean) {
  return ["dishes", includeInactive ? "all" : "active"] as const;
}

/** Catalog mon an, co the gom ca mon da tat. */
export function useDishes(includeInactive: boolean) {
  return useQuery<DishView[], ApiError>({
    queryKey: dishesQueryKey(includeInactive),
    queryFn: async ({ signal }) => toDishViews(await listDishes(includeInactive, signal)),
  });
}

/** Mutation tao/sua/tat/bat mon; lam moi moi query dishes. */
export function useDishMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["dishes"] });

  const create = useMutation({
    mutationFn: (input: CreateDishRequest) => createDish(input),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDishRequest }) => updateDish(id, input),
    onSuccess: invalidate,
  });
  const disable = useMutation({
    mutationFn: (id: string) => disableDish(id),
    onSuccess: invalidate,
  });
  const enable = useMutation({
    mutationFn: (id: string) => enableDish(id),
    onSuccess: invalidate,
  });

  return { create, update, disable, enable };
}
