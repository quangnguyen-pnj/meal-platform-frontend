import {
  formatServiceDate,
  mealTypeLabel,
  statusLabelFor,
  type StatusLabel,
} from "@/mappers/meal-session";
import type { SessionSummaryDto } from "@/types/api";

/** View model cho mot mon trong tong hop session. */
export interface SessionSummaryDishView {
  dishId: string;
  code: string;
  name: string;
  /** So da dang ky; Phase 1 luon 0 (chua co dang ky). */
  registeredCount: number;
}

/** View model cho man hinh tong hop session (chi doc). */
export interface SessionSummaryView {
  mealSessionId: string;
  serviceDate: string;
  mealTypeLabel: string;
  statusLabel: StatusLabel;
  offeredDishCount: number;
  totalRegistered: number;
  /** True khi chua co dang ky nao, de UI noi ro so lieu den o Phase 2. */
  hasNoRegistrations: boolean;
  dishes: SessionSummaryDishView[];
}

export function toSessionSummaryView(dto: SessionSummaryDto): SessionSummaryView {
  return {
    mealSessionId: dto.mealSessionId,
    serviceDate: formatServiceDate(dto.serviceDate),
    mealTypeLabel: mealTypeLabel(dto.mealType),
    statusLabel: statusLabelFor(dto.status),
    offeredDishCount: dto.offeredDishCount,
    totalRegistered: dto.totalRegistered,
    hasNoRegistrations: dto.totalRegistered === 0,
    dishes: dto.dishes.map((dish) => ({
      dishId: dish.dishId,
      code: dish.code,
      name: dish.name,
      registeredCount: dish.registeredCount,
    })),
  };
}
