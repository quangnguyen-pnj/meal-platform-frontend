import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addMenuItem,
  archiveWeeklyMenu,
  createWeeklyMenu,
  listWeeklyMenus,
  publishWeeklyMenu,
  removeMenuItem,
} from "@/api/weekly-menus";
import type { ApiError } from "@/lib/api-error";
import type { CreateMenuItemRequest, CreateWeeklyMenuRequest, WeeklyMenuDto } from "@/types/api";

function weeklyMenusQueryKey(factoryId: string) {
  return ["weekly-menus", factoryId] as const;
}

/** Danh sach menu tuan cua mot factory; chi chay khi da chon factory. */
export function useWeeklyMenus(factoryId: string | undefined) {
  return useQuery<WeeklyMenuDto[], ApiError>({
    queryKey: weeklyMenusQueryKey(factoryId ?? ""),
    queryFn: async ({ signal }) => listWeeklyMenus(factoryId!, signal),
    enabled: Boolean(factoryId),
  });
}

/**
 * Mutation cho menu tuan va muc mon. Moi mutation lam moi lai danh sach menu cua
 * factory lien quan de UI phan anh thay doi.
 */
export function useWeeklyMenuMutations(factoryId: string | undefined) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: weeklyMenusQueryKey(factoryId ?? "") });

  const createMenu = useMutation({
    mutationFn: (input: CreateWeeklyMenuRequest) => createWeeklyMenu(input),
    onSuccess: invalidate,
  });
  const addItem = useMutation({
    mutationFn: ({ menuId, input }: { menuId: string; input: CreateMenuItemRequest }) =>
      addMenuItem(menuId, input),
    onSuccess: invalidate,
  });
  const removeItem = useMutation({
    mutationFn: ({ menuId, itemId }: { menuId: string; itemId: string }) =>
      removeMenuItem(menuId, itemId),
    onSuccess: invalidate,
  });
  const publish = useMutation({
    mutationFn: (menuId: string) => publishWeeklyMenu(menuId),
    onSuccess: invalidate,
  });
  const archive = useMutation({
    mutationFn: (menuId: string) => archiveWeeklyMenu(menuId),
    onSuccess: invalidate,
  });

  return { createMenu, addItem, removeItem, publish, archive };
}
