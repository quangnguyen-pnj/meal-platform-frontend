import type {
  ImportApplyResultDto,
  ImportJobDto,
  ImportJobStatus,
  ImportRowDto,
  ImportRowStatus,
} from "@/types/api";

/** View model cho job import, kem nhan trang thai tieng Viet. */
export interface ImportJobView {
  id: string;
  status: ImportJobStatus;
  statusLabel: string;
  originalFilename: string;
  rowCount: number;
  errorCount: number;
  /** Chi co the apply khi job da VALIDATED (moi row hop le). */
  canApply: boolean;
}

const JOB_STATUS_LABELS: Record<ImportJobStatus, string> = {
  UPLOADED: "Da tai len",
  VALIDATED: "Hop le, san sang nhap",
  COMMITTED: "Da nhap xong",
  FAILED: "Co dong loi, chua nhap",
};

export function toImportJobView(dto: ImportJobDto): ImportJobView {
  return {
    id: dto.id,
    status: dto.status,
    statusLabel: JOB_STATUS_LABELS[dto.status],
    originalFilename: dto.originalFilename,
    rowCount: dto.rowCount,
    errorCount: dto.errorCount,
    canApply: dto.status === "VALIDATED",
  };
}

export interface ImportRowFieldError {
  field: string;
  message: string;
}

/** View model cho mot dong preview. */
export interface ImportRowView {
  id: string;
  rowNumber: number;
  employeeCode: string;
  fullName: string;
  email: string;
  factoryCode: string;
  departmentCode: string;
  teamCode: string;
  hasPersonalDeviceLabel: string;
  status: ImportRowStatus;
  isValid: boolean;
  errors: ImportRowFieldError[];
}

function cell(value: string | null): string {
  return value ?? "-";
}

function deviceLabel(value: boolean | null): string {
  if (value === null) {
    return "-";
  }
  return value ? "Co" : "Khong";
}

export function toImportRowView(dto: ImportRowDto): ImportRowView {
  return {
    id: dto.id,
    rowNumber: dto.rowNumber,
    employeeCode: cell(dto.employeeCode),
    fullName: cell(dto.fullName),
    email: cell(dto.email),
    factoryCode: cell(dto.factoryCode),
    departmentCode: cell(dto.departmentCode),
    teamCode: cell(dto.teamCode),
    hasPersonalDeviceLabel: deviceLabel(dto.hasPersonalDevice),
    status: dto.status,
    isValid: dto.status === "VALID",
    errors: dto.errors.map((error) => ({ field: error.field, message: error.message })),
  };
}

export function toImportRowViews(dtos: ImportRowDto[]): ImportRowView[] {
  return dtos.map(toImportRowView);
}

/** View model cho ket qua apply, kem nhan tieng Viet. */
export interface ImportApplyResultView {
  jobId: string;
  status: ImportJobStatus;
  created: number;
  updated: number;
}

export function toImportApplyResultView(dto: ImportApplyResultDto): ImportApplyResultView {
  return {
    jobId: dto.jobId,
    status: dto.status,
    created: dto.created,
    updated: dto.updated,
  };
}
