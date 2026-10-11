import { httpClient } from "@/lib/http-client";
import type {
  CreateMenuItemRequest,
  CreateWeeklyMenuRequest,
  UpdateMenuItemRequest,
  WeeklyMenuDto,
} from "@/types/api";

/** GET /weekly-menus?factoryId= : danh sach menu tuan cua mot factory. */
export function listWeeklyMenus(factoryId: string, signal?: AbortSignal): Promise<WeeklyMenuDto[]> {
  return httpClient.get<WeeklyMenuDto[]>(
    `/weekly-menus?factoryId=${encodeURIComponent(factoryId)}`,
    { signal },
  );
}

export function getWeeklyMenu(id: string, signal?: AbortSignal): Promise<WeeklyMenuDto> {
  return httpClient.get<WeeklyMenuDto>(`/weekly-menus/${id}`, { signal });
}

export function createWeeklyMenu(input: CreateWeeklyMenuRequest): Promise<WeeklyMenuDto> {
  return httpClient.post<WeeklyMenuDto>("/weekly-menus", input);
}

export function addMenuItem(
  weeklyMenuId: string,
  input: CreateMenuItemRequest,
): Promise<WeeklyMenuDto> {
  return httpClient.post<WeeklyMenuDto>(`/weekly-menus/${weeklyMenuId}/items`, input);
}

export function updateMenuItem(
  weeklyMenuId: string,
  itemId: string,
  input: UpdateMenuItemRequest,
): Promise<WeeklyMenuDto> {
  return httpClient.patch<WeeklyMenuDto>(`/weekly-menus/${weeklyMenuId}/items/${itemId}`, input);
}

export function removeMenuItem(weeklyMenuId: string, itemId: string): Promise<WeeklyMenuDto> {
  return httpClient.delete<WeeklyMenuDto>(`/weekly-menus/${weeklyMenuId}/items/${itemId}`);
}

export function publishWeeklyMenu(id: string): Promise<WeeklyMenuDto> {
  return httpClient.post<WeeklyMenuDto>(`/weekly-menus/${id}/publish`);
}

export function archiveWeeklyMenu(id: string): Promise<WeeklyMenuDto> {
  return httpClient.post<WeeklyMenuDto>(`/weekly-menus/${id}/archive`);
}
