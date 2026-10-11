import type { AuthMeResponse, ScopeGrantDto } from "@/types/api";

/** Ma permission dung o frontend de an/hien action va nav. */
export const PERMISSIONS = {
  organizationManage: "organization:manage",
  employeeRead: "employee:read",
  employeeManage: "employee:manage",
  employeeImport: "employee:import",
  mealSessionManage: "meal-session:manage",
  menuManage: "menu:manage",
  reportRead: "report:read",
  registrationSelf: "registration:self",
  // BULK ENTRY SECTION (P2-05), append-only.
  registrationBulk: "registration:bulk",
  // ADJUSTMENT SECTION (P2-09), append-only.
  registrationAdjust: "registration:adjust",
  // RESERVE SECTION (P2-11), append-only.
  reserveManage: "reserve:manage",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface PrincipalScopeGrant {
  roleCode: string;
  roleName: string;
  organizationId: string;
  factoryId: string | null;
  departmentId: string | null;
  teamId: string | null;
}

/** View model cho principal da dang nhap. */
export interface PrincipalView {
  userAccountId: string;
  email: string;
  organizationId: string;
  displayName: string;
  /** Id nhan vien gan voi tai khoan, null khi tai khoan khong co ho so nhan vien. */
  employeeId: string | null;
  roleNames: string[];
  permissions: ReadonlySet<string>;
  scopeGrants: PrincipalScopeGrant[];
}

function toScopeGrant(dto: ScopeGrantDto): PrincipalScopeGrant {
  return {
    roleCode: dto.roleCode,
    roleName: dto.roleName,
    organizationId: dto.organizationId,
    factoryId: dto.factoryId,
    departmentId: dto.departmentId,
    teamId: dto.teamId,
  };
}

export function toPrincipalView(dto: AuthMeResponse): PrincipalView {
  return {
    userAccountId: dto.userAccountId,
    email: dto.email,
    organizationId: dto.organizationId,
    displayName: dto.employee?.fullName ?? dto.email,
    employeeId: dto.employee?.id ?? null,
    roleNames: dto.roles,
    permissions: new Set(dto.permissions),
    scopeGrants: dto.scopeGrants.map(toScopeGrant),
  };
}

export function principalHasPermission(
  principal: PrincipalView | null,
  permission: PermissionCode,
): boolean {
  return principal?.permissions.has(permission) ?? false;
}
