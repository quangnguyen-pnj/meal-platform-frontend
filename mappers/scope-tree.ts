import type { ScopeTreeResponse } from "@/types/api";

/** View model phang hoa cho cay to chuc, de component chi render. */
export interface TeamNode {
  id: string;
  code: string;
  name: string;
  factoryId: string;
  departmentId: string;
}

export interface DepartmentNode {
  id: string;
  code: string;
  name: string;
  factoryId: string;
  teams: TeamNode[];
}

export interface FactoryNode {
  id: string;
  code: string;
  name: string;
  departments: DepartmentNode[];
}

export interface ScopeTreeView {
  organizationId: string;
  factories: FactoryNode[];
}

/** Lua chon to kem ngu canh factory/department, dung cho select. */
export interface TeamOption {
  teamId: string;
  teamName: string;
  teamCode: string;
  departmentId: string;
  departmentName: string;
  factoryId: string;
  factoryName: string;
  /** Nhan hien thi gon: Nha may / Phong ban / To. */
  label: string;
}

/** Phang hoa toan bo to trong cay thanh danh sach lua chon. */
export function toTeamOptions(tree: ScopeTreeView): TeamOption[] {
  const options: TeamOption[] = [];
  for (const factory of tree.factories) {
    for (const department of factory.departments) {
      for (const team of department.teams) {
        options.push({
          teamId: team.id,
          teamName: team.name,
          teamCode: team.code,
          departmentId: department.id,
          departmentName: department.name,
          factoryId: factory.id,
          factoryName: factory.name,
          label: `${factory.name} / ${department.name} / ${team.name}`,
        });
      }
    }
  }
  return options;
}

export function toScopeTreeView(dto: ScopeTreeResponse): ScopeTreeView {
  return {
    organizationId: dto.organizationId,
    factories: dto.factories.map((factory) => ({
      id: factory.id,
      code: factory.code,
      name: factory.name,
      departments: factory.departments.map((department) => ({
        id: department.id,
        code: department.code,
        name: department.name,
        factoryId: factory.id,
        teams: department.teams.map((team) => ({
          id: team.id,
          code: team.code,
          name: team.name,
          factoryId: factory.id,
          departmentId: department.id,
        })),
      })),
    })),
  };
}
