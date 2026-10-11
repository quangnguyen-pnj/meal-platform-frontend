"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { EmployeeFormModal } from "@/components/workforce/EmployeeFormModal";
import { EmployeeTable } from "@/components/workforce/EmployeeTable";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeForm } from "@/hooks/useEmployeeForm";
import { useEmployeeMutations, useEmployees } from "@/hooks/useEmployees";
import { useScopeTree } from "@/hooks/useScopeTree";
import { toTeamOptions, type TeamOption } from "@/mappers/scope-tree";
import { PERMISSIONS } from "@/mappers/principal";
import type { EmployeeView } from "@/mappers/employee";

export default function EmployeesPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.employeeManage);

  const [teamId, setTeamId] = useState<string>("");

  const scopeTree = useScopeTree();
  const teamOptions = useMemo<TeamOption[]>(
    () => (scopeTree.data ? toTeamOptions(scopeTree.data) : []),
    [scopeTree.data],
  );

  const employees = useEmployees(teamId || undefined);
  const mutations = useEmployeeMutations();
  const form = useEmployeeForm(teamOptions);

  function onDelete(employee: EmployeeView) {
    if (!window.confirm(`Xoa nhan vien "${employee.fullName}" (${employee.employeeCode})?`)) {
      return;
    }
    mutations.remove.mutate(employee.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Nhan vien</h1>
          <p className="text-muted-foreground">Danh sach nhan vien trong pham vi cua ban.</p>
        </div>
        {canManage ? (
          <Button onClick={form.openCreate} disabled={teamOptions.length === 0}>
            <Plus aria-hidden />
            Them nhan vien
          </Button>
        ) : null}
      </header>

      <div className="flex items-center gap-2">
        <label className="text-muted-foreground text-sm" htmlFor="team-filter">
          Loc theo to
        </label>
        <Select
          id="team-filter"
          className="max-w-xs"
          value={teamId}
          onChange={(event) => setTeamId(event.target.value)}
        >
          <option value="">Tat ca cac to</option>
          {teamOptions.map((option) => (
            <option key={option.teamId} value={option.teamId}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      {employees.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai danh sach nhan vien...</span>
        </div>
      ) : employees.error ? (
        <ApiErrorNotice error={employees.error} context="xem danh sach nhan vien" />
      ) : employees.data ? (
        <EmployeeTable
          employees={employees.data}
          canManage={canManage}
          onEdit={form.openEdit}
          onDelete={onDelete}
        />
      ) : null}

      <EmployeeFormModal
        open={form.isOpen}
        isEdit={form.isEdit}
        fields={form.fields}
        teamOptions={teamOptions}
        error={form.error}
        isSubmitting={form.isSubmitting}
        onField={form.setField}
        onClose={form.close}
        onSubmit={form.onSubmit}
      />
    </div>
  );
}
