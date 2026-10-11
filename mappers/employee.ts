import type { EmployeeDto } from "@/types/api";

/** View model cho dong nhan vien trong danh sach. */
export interface EmployeeView {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string | null;
  factoryId: string;
  departmentId: string;
  teamId: string;
  hasPersonalDevice: boolean;
  hasAccount: boolean;
}

export function toEmployeeView(dto: EmployeeDto): EmployeeView {
  return {
    id: dto.id,
    employeeCode: dto.employeeCode,
    fullName: dto.fullName,
    email: dto.email,
    factoryId: dto.factoryId,
    departmentId: dto.departmentId,
    teamId: dto.teamId,
    hasPersonalDevice: dto.hasPersonalDevice,
    hasAccount: dto.userAccountId !== null,
  };
}

export function toEmployeeViews(dtos: EmployeeDto[]): EmployeeView[] {
  return dtos.map(toEmployeeView);
}
