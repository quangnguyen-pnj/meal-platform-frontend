import { useState, type FormEvent } from "react";

import { useOrganizationMutations } from "@/hooks/useOrganizationMutations";
import { ApiError } from "@/lib/api-error";

/** Loai node dang thao tac. */
export type OrgEntity = "factory" | "department" | "team";

interface CreateContext {
  mode: "create";
  entity: OrgEntity;
  /** Factory cha khi tao department/team. */
  factoryId?: string;
  /** Department cha khi tao team. */
  departmentId?: string;
}

interface EditContext {
  mode: "edit";
  entity: OrgEntity;
  id: string;
  code: string;
}

export type OrgFormContext = CreateContext | EditContext;

/**
 * Giu toan bo form state cho CRUD cay to chuc.
 *
 * Modal mo khi `context` khac null. Khi create, backend yeu cau code + name;
 * khi edit chi doi name (code bat bien). Mutation nam o useOrganizationMutations;
 * hook nay chi so khop field va goi dung mutation theo entity + mode.
 */
export function useOrganizationForm() {
  const mutations = useOrganizationMutations();

  const [context, setContext] = useState<OrgFormContext | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openCreate(entity: OrgEntity, parents?: { factoryId?: string; departmentId?: string }) {
    setContext({ mode: "create", entity, ...parents });
    setCode("");
    setName("");
    setError(null);
  }

  function openEdit(entity: OrgEntity, node: { id: string; code: string; name: string }) {
    setContext({ mode: "edit", entity, id: node.id, code: node.code });
    setCode(node.code);
    setName(node.name);
    setError(null);
  }

  function close() {
    setContext(null);
    setError(null);
  }

  async function runCreate(current: CreateContext) {
    switch (current.entity) {
      case "factory":
        await mutations.createFactory.mutateAsync({ code, name });
        return;
      case "department":
        await mutations.createDepartment.mutateAsync({
          code,
          name,
          factoryId: current.factoryId!,
        });
        return;
      case "team":
        await mutations.createTeam.mutateAsync({
          code,
          name,
          factoryId: current.factoryId!,
          departmentId: current.departmentId!,
        });
    }
  }

  async function runEdit(current: EditContext) {
    switch (current.entity) {
      case "factory":
        await mutations.updateFactory.mutateAsync({ id: current.id, input: { name } });
        return;
      case "department":
        await mutations.updateDepartment.mutateAsync({ id: current.id, input: { name } });
        return;
      case "team":
        await mutations.updateTeam.mutateAsync({ id: current.id, input: { name } });
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!context) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      if (context.mode === "create") {
        await runCreate(context);
      } else {
        await runEdit(context);
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
    context,
    code,
    name,
    error,
    isSubmitting,
    setCode,
    setName,
    openCreate,
    openEdit,
    close,
    onSubmit,
  };
}
