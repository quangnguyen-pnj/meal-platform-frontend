import { formatHcmInstant, type StatusLabel } from "@/mappers/meal-session";
import type { ReserveAllocationViewDto, ReservePoolViewDto } from "@/types/api";

/**
 * View model cho mot dong reserve pool (mot mon cua session). Khong co endpoint
 * ten mon cho man hinh nay (GET /dishes can menu:manage), nen hien thi mon theo
 * so thu tu giong man "Bua an cua toi" thay vi tu bia ten.
 */
export interface ReservePoolRowView {
  mealSessionId: string;
  mealSessionDishId: string;
  /** Nhan hien thi cho mon, dang "Mon N". */
  dishLabel: string;
  isEnabled: boolean;
  /** Trang thai bat/tat kem text + icon (khong chi dua vao mau). */
  enabledLabel: StatusLabel;
  /** So suat du phong da cau hinh. */
  quantity: number;
  /** So suat da cap. */
  allocated: number;
  /** So suat con lai. */
  remaining: number;
}

/** View model cho mot allocation (doc lap voi registration thuong). */
export interface ReserveAllocationRowView {
  id: string;
  mealSessionDishId: string;
  dishLabel: string;
  employeeId: string | null;
  quantity: number;
  isCancelled: boolean;
  statusLabel: StatusLabel;
  reason: string | null;
  allocatedAtDisplay: string;
}

const ENABLED_LABEL: StatusLabel = {
  text: "Dang bat",
  icon: "open",
  tone: "success",
};

const DISABLED_LABEL: StatusLabel = {
  text: "Dang tat",
  icon: "closed",
  tone: "muted",
};

const ALLOCATED_LABEL: StatusLabel = {
  text: "Da cap",
  icon: "published",
  tone: "default",
};

const CANCELLED_LABEL: StatusLabel = {
  text: "Da huy",
  icon: "cancelled",
  tone: "destructive",
};

function dishLabelFor(index: number): string {
  return `Mon ${index + 1}`;
}

/**
 * Chuyen danh sach reserve pool thanh view. Thu tu phan tu quyet dinh nhan
 * "Mon N" de admin phan biet cac mon trong session.
 */
export function toReservePoolRows(dtos: ReservePoolViewDto[]): ReservePoolRowView[] {
  return dtos.map((dto, index) => ({
    mealSessionId: dto.mealSessionId,
    mealSessionDishId: dto.mealSessionDishId,
    dishLabel: dishLabelFor(index),
    isEnabled: dto.isEnabled,
    enabledLabel: dto.isEnabled ? ENABLED_LABEL : DISABLED_LABEL,
    quantity: dto.quantity,
    allocated: dto.allocated,
    remaining: dto.remaining,
  }));
}

/**
 * Chuyen danh sach allocation thanh view. Nhan mon lay tu thu tu cac dong pool
 * (mealSessionDishId -> "Mon N") de hien thi nhat quan voi bang pool.
 */
export function toReserveAllocationRows(
  dtos: ReserveAllocationViewDto[],
  dishLabelByMealSessionDishId: Map<string, string>,
): ReserveAllocationRowView[] {
  return dtos.map((dto) => ({
    id: dto.id,
    mealSessionDishId: dto.mealSessionDishId,
    dishLabel: dishLabelByMealSessionDishId.get(dto.mealSessionDishId) ?? "Mon khac",
    employeeId: dto.employeeId,
    quantity: dto.quantity,
    isCancelled: dto.status === "CANCELLED",
    statusLabel: dto.status === "CANCELLED" ? CANCELLED_LABEL : ALLOCATED_LABEL,
    reason: dto.reason,
    allocatedAtDisplay: formatHcmInstant(dto.allocatedAt),
  }));
}
