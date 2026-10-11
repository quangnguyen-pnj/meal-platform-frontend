"use client";

import { Loader2, Plus } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { OrganizationFormModal } from "@/components/organization/OrganizationFormModal";
import {
  OrganizationTree,
  type OrganizationTreeHandlers,
  type OrgNodeRef,
} from "@/components/organization/OrganizationTree";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganizationForm } from "@/hooks/useOrganizationForm";
import { useOrganizationMutations } from "@/hooks/useOrganizationMutations";
import { useScopeTree } from "@/hooks/useScopeTree";
import { PERMISSIONS } from "@/mappers/principal";

export default function OrganizationPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.organizationManage);

  const scopeTree = useScopeTree();
  const form = useOrganizationForm();
  const mutations = useOrganizationMutations();

  function confirmDelete(entity: "factory" | "department" | "team", node: OrgNodeRef) {
    const label = { factory: "nha may", department: "phong ban", team: "to" }[entity];
    if (!window.confirm(`Xoa ${label} "${node.name}" (${node.code})?`)) {
      return;
    }
    if (entity === "factory") mutations.deleteFactory.mutate(node.id);
    if (entity === "department") mutations.deleteDepartment.mutate(node.id);
    if (entity === "team") mutations.deleteTeam.mutate(node.id);
  }

  const handlers: OrganizationTreeHandlers = {
    onCreateFactory: () => form.openCreate("factory"),
    onEditFactory: (factory) => form.openEdit("factory", factory),
    onDeleteFactory: (factory) => confirmDelete("factory", factory),
    onCreateDepartment: (factoryId) => form.openCreate("department", { factoryId }),
    onEditDepartment: (department) => form.openEdit("department", department),
    onDeleteDepartment: (department) => confirmDelete("department", department),
    onCreateTeam: (factoryId, departmentId) => form.openCreate("team", { factoryId, departmentId }),
    onEditTeam: (team) => form.openEdit("team", team),
    onDeleteTeam: (team) => confirmDelete("team", team),
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">So do to chuc</h1>
          <p className="text-muted-foreground">Nha may, phong ban va to trong pham vi cua ban.</p>
        </div>
        {canManage ? (
          <Button onClick={handlers.onCreateFactory}>
            <Plus aria-hidden />
            Them nha may
          </Button>
        ) : null}
      </header>

      {scopeTree.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai so do to chuc...</span>
        </div>
      ) : scopeTree.error ? (
        <ApiErrorNotice error={scopeTree.error} context="xem so do to chuc" />
      ) : scopeTree.data ? (
        <OrganizationTree tree={scopeTree.data} canManage={canManage} handlers={handlers} />
      ) : null}

      <OrganizationFormModal
        context={form.context}
        code={form.code}
        name={form.name}
        error={form.error}
        isSubmitting={form.isSubmitting}
        onCodeChange={form.setCode}
        onNameChange={form.setName}
        onClose={form.close}
        onSubmit={form.onSubmit}
      />
    </div>
  );
}
