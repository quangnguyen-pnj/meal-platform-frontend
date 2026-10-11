import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DepartmentNode, FactoryNode, ScopeTreeView, TeamNode } from "@/mappers/scope-tree";

export interface OrgNodeRef {
  id: string;
  code: string;
  name: string;
}

export interface OrganizationTreeHandlers {
  onCreateFactory: () => void;
  onEditFactory: (factory: OrgNodeRef) => void;
  onDeleteFactory: (factory: OrgNodeRef) => void;
  onCreateDepartment: (factoryId: string) => void;
  onEditDepartment: (department: OrgNodeRef) => void;
  onDeleteDepartment: (department: OrgNodeRef) => void;
  onCreateTeam: (factoryId: string, departmentId: string) => void;
  onEditTeam: (team: OrgNodeRef) => void;
  onDeleteTeam: (team: OrgNodeRef) => void;
}

interface OrganizationTreeProps {
  tree: ScopeTreeView;
  /** Chi hien action khi co quyen organization:manage. */
  canManage: boolean;
  handlers: OrganizationTreeHandlers;
}

/**
 * Render cay to chuc. Component chi hien thi; moi thao tac goi handler truyen
 * vao. Khi canManage=false, khong render nut tao/sua/xoa.
 */
export function OrganizationTree({ tree, canManage, handlers }: OrganizationTreeProps) {
  if (tree.factories.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Chua co nha may nao trong pham vi cua ban.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tree.factories.map((factory) => (
        <FactoryBlock
          key={factory.id}
          factory={factory}
          canManage={canManage}
          handlers={handlers}
        />
      ))}
    </div>
  );
}

function NodeActions({
  canManage,
  onAddChild,
  addChildLabel,
  onEdit,
  onDelete,
}: {
  canManage: boolean;
  onAddChild?: () => void;
  addChildLabel?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  if (!canManage) {
    return null;
  }
  return (
    <div className="flex items-center gap-1">
      {onAddChild ? (
        <Button variant="ghost" size="sm" onClick={onAddChild}>
          <Plus aria-hidden />
          {addChildLabel}
        </Button>
      ) : null}
      <Button variant="ghost" size="icon" aria-label="Sua" onClick={onEdit}>
        <Pencil aria-hidden />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Xoa" onClick={onDelete}>
        <Trash2 aria-hidden />
      </Button>
    </div>
  );
}

function nodeRef(node: { id: string; code: string; name: string }): OrgNodeRef {
  return { id: node.id, code: node.code, name: node.name };
}

function FactoryBlock({
  factory,
  canManage,
  handlers,
}: {
  factory: FactoryNode;
  canManage: boolean;
  handlers: OrganizationTreeHandlers;
}) {
  return (
    <section className="rounded-xl border">
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold">{factory.name}</span>
          <span className="text-muted-foreground font-mono text-xs">{factory.code}</span>
        </div>
        <NodeActions
          canManage={canManage}
          onAddChild={() => handlers.onCreateDepartment(factory.id)}
          addChildLabel="Them phong ban"
          onEdit={() => handlers.onEditFactory(nodeRef(factory))}
          onDelete={() => handlers.onDeleteFactory(nodeRef(factory))}
        />
      </header>

      <div className="flex flex-col gap-3 p-4">
        {factory.departments.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chua co phong ban.</p>
        ) : (
          factory.departments.map((department) => (
            <DepartmentBlock
              key={department.id}
              department={department}
              canManage={canManage}
              handlers={handlers}
            />
          ))
        )}
      </div>
    </section>
  );
}

function DepartmentBlock({
  department,
  canManage,
  handlers,
}: {
  department: DepartmentNode;
  canManage: boolean;
  handlers: OrganizationTreeHandlers;
}) {
  return (
    <div className="bg-muted/20 rounded-lg border">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
        <div className="flex items-baseline gap-2">
          <span className="font-medium">{department.name}</span>
          <span className="text-muted-foreground font-mono text-xs">{department.code}</span>
        </div>
        <NodeActions
          canManage={canManage}
          onAddChild={() => handlers.onCreateTeam(department.factoryId, department.id)}
          addChildLabel="Them to"
          onEdit={() => handlers.onEditDepartment(nodeRef(department))}
          onDelete={() => handlers.onDeleteDepartment(nodeRef(department))}
        />
      </div>

      <ul className="flex flex-col divide-y">
        {department.teams.length === 0 ? (
          <li className="text-muted-foreground px-4 py-2 text-sm">Chua co to.</li>
        ) : (
          department.teams.map((team: TeamNode) => (
            <li key={team.id} className="flex items-center justify-between gap-3 px-4 py-2">
              <div className="flex items-baseline gap-2">
                <span className="text-sm">{team.name}</span>
                <span className="text-muted-foreground font-mono text-xs">{team.code}</span>
              </div>
              <NodeActions
                canManage={canManage}
                onEdit={() => handlers.onEditTeam(nodeRef(team))}
                onDelete={() => handlers.onDeleteTeam(nodeRef(team))}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
