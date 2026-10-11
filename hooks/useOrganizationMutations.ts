import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createDepartment,
  createFactory,
  createTeam,
  deleteDepartment,
  deleteFactory,
  deleteTeam,
  updateDepartment,
  updateFactory,
  updateTeam,
} from "@/api/organization";
import { scopeTreeQueryKey } from "@/hooks/useScopeTree";
import type {
  CreateDepartmentRequest,
  CreateFactoryRequest,
  CreateTeamRequest,
  UpdateDepartmentRequest,
  UpdateFactoryRequest,
  UpdateTeamRequest,
} from "@/types/api";

/**
 * Mutation tao/sua/xoa cho factory, department, team.
 *
 * Moi mutation lam moi lai cay scope-tree de UI phan anh thay doi. Giu chung
 * mot hook vi cung tac dong len cung cache.
 */
export function useOrganizationMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: scopeTreeQueryKey });

  const createFactoryMutation = useMutation({
    mutationFn: (input: CreateFactoryRequest) => createFactory(input),
    onSuccess: invalidate,
  });
  const updateFactoryMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFactoryRequest }) =>
      updateFactory(id, input),
    onSuccess: invalidate,
  });
  const deleteFactoryMutation = useMutation({
    mutationFn: (id: string) => deleteFactory(id),
    onSuccess: invalidate,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: (input: CreateDepartmentRequest) => createDepartment(input),
    onSuccess: invalidate,
  });
  const updateDepartmentMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDepartmentRequest }) =>
      updateDepartment(id, input),
    onSuccess: invalidate,
  });
  const deleteDepartmentMutation = useMutation({
    mutationFn: (id: string) => deleteDepartment(id),
    onSuccess: invalidate,
  });

  const createTeamMutation = useMutation({
    mutationFn: (input: CreateTeamRequest) => createTeam(input),
    onSuccess: invalidate,
  });
  const updateTeamMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTeamRequest }) => updateTeam(id, input),
    onSuccess: invalidate,
  });
  const deleteTeamMutation = useMutation({
    mutationFn: (id: string) => deleteTeam(id),
    onSuccess: invalidate,
  });

  return {
    createFactory: createFactoryMutation,
    updateFactory: updateFactoryMutation,
    deleteFactory: deleteFactoryMutation,
    createDepartment: createDepartmentMutation,
    updateDepartment: updateDepartmentMutation,
    deleteDepartment: deleteDepartmentMutation,
    createTeam: createTeamMutation,
    updateTeam: updateTeamMutation,
    deleteTeam: deleteTeamMutation,
  };
}
