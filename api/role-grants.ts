import { httpClient } from "@/lib/http-client";
import type { CreateRoleGrantRequest } from "@/types/api";

export function createRoleGrant(input: CreateRoleGrantRequest): Promise<{ id: string }> {
  return httpClient.post<{ id: string }>("/role-grants", input);
}

export function deleteRoleGrant(id: string): Promise<void> {
  return httpClient.delete<void>(`/role-grants/${id}`);
}
