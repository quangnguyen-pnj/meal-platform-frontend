import { httpClient } from "@/lib/http-client";
import type {
  CreateDepartmentRequest,
  CreateFactoryRequest,
  CreateTeamRequest,
  DepartmentDto,
  FactoryDto,
  ScopeTreeResponse,
  TeamDto,
  UpdateDepartmentRequest,
  UpdateFactoryRequest,
  UpdateTeamRequest,
} from "@/types/api";

/** GET /scope-tree: ca cay factory -> department -> team trong scope. */
export function getScopeTree(signal?: AbortSignal): Promise<ScopeTreeResponse> {
  return httpClient.get<ScopeTreeResponse>("/scope-tree", { signal });
}

export function createFactory(input: CreateFactoryRequest): Promise<FactoryDto> {
  return httpClient.post<FactoryDto>("/factories", input);
}

export function updateFactory(id: string, input: UpdateFactoryRequest): Promise<FactoryDto> {
  return httpClient.patch<FactoryDto>(`/factories/${id}`, input);
}

export function deleteFactory(id: string): Promise<void> {
  return httpClient.delete<void>(`/factories/${id}`);
}

export function createDepartment(input: CreateDepartmentRequest): Promise<DepartmentDto> {
  return httpClient.post<DepartmentDto>("/departments", input);
}

export function updateDepartment(
  id: string,
  input: UpdateDepartmentRequest,
): Promise<DepartmentDto> {
  return httpClient.patch<DepartmentDto>(`/departments/${id}`, input);
}

export function deleteDepartment(id: string): Promise<void> {
  return httpClient.delete<void>(`/departments/${id}`);
}

export function createTeam(input: CreateTeamRequest): Promise<TeamDto> {
  return httpClient.post<TeamDto>("/teams", input);
}

export function updateTeam(id: string, input: UpdateTeamRequest): Promise<TeamDto> {
  return httpClient.patch<TeamDto>(`/teams/${id}`, input);
}

export function deleteTeam(id: string): Promise<void> {
  return httpClient.delete<void>(`/teams/${id}`);
}
