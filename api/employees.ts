import { httpClient } from "@/lib/http-client";
import type { CreateEmployeeRequest, EmployeeDto, UpdateEmployeeRequest } from "@/types/api";

/** GET /employees?teamId= : danh sach da loc theo scope o backend. */
export function listEmployees(
  teamId: string | undefined,
  signal?: AbortSignal,
): Promise<EmployeeDto[]> {
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";
  return httpClient.get<EmployeeDto[]>(`/employees${query}`, { signal });
}

export function createEmployee(input: CreateEmployeeRequest): Promise<EmployeeDto> {
  return httpClient.post<EmployeeDto>("/employees", input);
}

export function updateEmployee(id: string, input: UpdateEmployeeRequest): Promise<EmployeeDto> {
  return httpClient.patch<EmployeeDto>(`/employees/${id}`, input);
}

export function deleteEmployee(id: string): Promise<void> {
  return httpClient.delete<void>(`/employees/${id}`);
}
