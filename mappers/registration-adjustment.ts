import { formatHcmInstant, type StatusIcon, type StatusLabel } from "@/mappers/meal-session";
import type { MealRegistrationDto, RegistrationSource, RegistrationStatus } from "@/types/api";

/** Mot lua chon status admin co the dat khi dieu chinh (P2-09). */
export type AdjustableStatus = RegistrationStatus;

/** Nhan status registration kem text + icon + tone (khong chi dua vao mau). */
const STATUS_LABELS: Record<RegistrationStatus, StatusLabel> = {
  REGISTERED: { text: "Da dang ky", icon: "open", tone: "success" },
  CANCELLED: { text: "Da huy", icon: "cancelled", tone: "destructive" },
  ABSENT: { text: "Vang", icon: "cutoff-passed", tone: "muted" },
};

/** Nhan nguon dang ky de admin biet registration den tu dau. */
const SOURCE_LABELS: Record<RegistrationSource, string> = {
  SELF: "Tu dang ky",
  BULK: "Nhap hang loat",
  PAPER_FORM: "Phieu giay",
  ADMIN_ADJUSTMENT: "Admin dieu chinh",
};

export function statusLabelFor(status: RegistrationStatus): StatusLabel {
  return STATUS_LABELS[status];
}

export function sourceLabelFor(source: RegistrationSource): string {
  return SOURCE_LABELS[source];
}

/** Cac status admin co the chuyen den qua lenh adjust, kem nhan tieng Viet. */
export const STATUS_OPTIONS: { value: AdjustableStatus; label: string }[] = [
  { value: "REGISTERED", label: STATUS_LABELS.REGISTERED.text },
  { value: "CANCELLED", label: STATUS_LABELS.CANCELLED.text },
  { value: "ABSENT", label: STATUS_LABELS.ABSENT.text },
];

/** Snapshot mot registration tai mot thoi diem, da dinh hinh de render. */
export interface RegistrationSnapshot {
  id: string;
  mealSessionId: string;
  employeeId: string;
  mealSessionDishId: string;
  status: RegistrationStatus;
  statusLabel: StatusLabel;
  sourceLabel: string;
  registeredAtDisplay: string;
  cancelledAtDisplay: string;
}

export function toRegistrationSnapshot(dto: MealRegistrationDto): RegistrationSnapshot {
  return {
    id: dto.id,
    mealSessionId: dto.mealSessionId,
    employeeId: dto.employeeId,
    mealSessionDishId: dto.mealSessionDishId,
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status],
    sourceLabel: SOURCE_LABELS[dto.source],
    registeredAtDisplay: formatHcmInstant(dto.registeredAt),
    cancelledAtDisplay: formatHcmInstant(dto.cancelledAt),
  };
}

/** Loai lenh dieu chinh admin co the thuc hien. */
export type AdjustmentKind = "cancel" | "mark-absent" | "adjust";

export const ADJUSTMENT_KIND_LABELS: Record<AdjustmentKind, string> = {
  cancel: "Huy dang ky",
  "mark-absent": "Danh dau vang",
  adjust: "Doi mon / trang thai",
};

/**
 * Mot muc trong lich su dieu chinh cua phien lam viec. Backend ghi
 * RegistrationChange nhung chua co endpoint doc, nen lich su day du can backend
 * bo sung; o day ta dung lai lich su cac lenh thanh cong trong phien nay, moi
 * muc giu snapshot truoc/sau, reason, actor va thoi diem.
 */
export interface AdjustmentHistoryEntry {
  kind: AdjustmentKind;
  kindLabel: string;
  reason: string;
  /** Nguoi thuc hien (principal hien tai), hien thi de xac nhan actor. */
  actorName: string;
  /** Thoi diem thuc hien theo gio HCM. */
  performedAtDisplay: string;
  before: RegistrationSnapshot;
  after: RegistrationSnapshot;
}

/** Icon dung cho dong "truoc" va "sau" trong panel so sanh. */
export const BEFORE_AFTER_ICONS: { before: StatusIcon; after: StatusIcon } = {
  before: "draft",
  after: "published",
};
