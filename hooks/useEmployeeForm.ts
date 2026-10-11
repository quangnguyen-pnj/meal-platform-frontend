import { useState, type FormEvent } from "react";

import { useEmployeeMutations } from "@/hooks/useEmployees";
import { ApiError } from "@/lib/api-error";
import type { EmployeeView } from "@/mappers/employee";
import type { TeamOption } from "@/mappers/scope-tree";

interface EditTarget {
  mode: "edit";
  id: string;
  employeeCode: string;
}

type FormMode = { mode: "create" } | EditTarget;

export interface EmployeeFormState {
  employeeCode: string;
  fullName: string;
  email: string;
  teamId: string;
  hasPersonalDevice: boolean;
  withAccount: boolean;
  accountEmail: string;
  accountPassword: string;
}

const emptyState: EmployeeFormState = {
  employeeCode: "",
  fullName: "",
  email: "",
  teamId: "",
  hasPersonalDevice: false,
  withAccount: false,
  accountEmail: "",
  accountPassword: "",
};

/**
 * Form state cho tao/sua nhan vien. Giu moi logic submit o day: suy ra
 * factory/department tu team da chon, dinh kem account tuy chon khi tao.
 * Component chi nhan field + setter.
 */
export function useEmployeeForm(teamOptions: TeamOption[]) {
  const mutations = useEmployeeMutations();

  const [mode, setMode] = useState<FormMode | null>(null);
  const [fields, setFields] = useState<EmployeeFormState>(emptyState);
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof EmployeeFormState>(key: K, value: EmployeeFormState[K]) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function openCreate() {
    setMode({ mode: "create" });
    setFields(emptyState);
    setError(null);
  }

  function openEdit(employee: EmployeeView) {
    setMode({ mode: "edit", id: employee.id, employeeCode: employee.employeeCode });
    setFields({
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      email: employee.email ?? "",
      teamId: employee.teamId,
      hasPersonalDevice: employee.hasPersonalDevice,
      withAccount: false,
      accountEmail: "",
      accountPassword: "",
    });
    setError(null);
  }

  function close() {
    setMode(null);
    setError(null);
  }

  async function submitCreate() {
    const option = teamOptions.find((candidate) => candidate.teamId === fields.teamId);
    if (!option) {
      throw new ApiError({ code: "validation", message: "Vui long chon to", status: 0 });
    }
    await mutations.create.mutateAsync({
      employeeCode: fields.employeeCode.trim(),
      fullName: fields.fullName.trim(),
      email: fields.email.trim() ? fields.email.trim() : undefined,
      hasPersonalDevice: fields.hasPersonalDevice,
      factoryId: option.factoryId,
      departmentId: option.departmentId,
      teamId: option.teamId,
      account: fields.withAccount
        ? { email: fields.accountEmail.trim(), password: fields.accountPassword }
        : undefined,
    });
  }

  async function submitEdit(target: EditTarget) {
    const option = teamOptions.find((candidate) => candidate.teamId === fields.teamId);
    await mutations.update.mutateAsync({
      id: target.id,
      input: {
        fullName: fields.fullName.trim(),
        email: fields.email.trim() ? fields.email.trim() : null,
        hasPersonalDevice: fields.hasPersonalDevice,
        ...(option
          ? {
              factoryId: option.factoryId,
              departmentId: option.departmentId,
              teamId: option.teamId,
            }
          : {}),
      },
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mode) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      if (mode.mode === "create") {
        await submitCreate();
      } else {
        await submitEdit(mode);
      }
      close();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({ code: "unexpected_error", message: "Luu that bai", status: 0 }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isOpen: mode !== null,
    isEdit: mode?.mode === "edit",
    fields,
    error,
    isSubmitting,
    setField,
    openCreate,
    openEdit,
    close,
    onSubmit,
  };
}
