import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from "@/api/employees";
import type { ApiError } from "@/lib/api-error";
import { toEmployeeViews, type EmployeeView } from "@/mappers/employee";
import type { CreateEmployeeRequest, UpdateEmployeeRequest } from "@/types/api";

function employeesQueryKey(teamId: string | undefined) {
  return ["employees", teamId ?? "all"] as const;
}

/** Danh sach nhan vien da loc theo scope o backend, co the loc them theo team. */
export function useEmployees(teamId: string | undefined) {
  return useQuery<EmployeeView[], ApiError>({
    queryKey: employeesQueryKey(teamId),
    queryFn: async ({ signal }) => toEmployeeViews(await listEmployees(teamId, signal)),
  });
}

/** Mutation tao/sua/xoa nhan vien; lam moi moi danh sach employees. */
export function useEmployeeMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["employees"] });

  const create = useMutation({
    mutationFn: (input: CreateEmployeeRequest) => createEmployee(input),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEmployeeRequest }) =>
      updateEmployee(id, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
