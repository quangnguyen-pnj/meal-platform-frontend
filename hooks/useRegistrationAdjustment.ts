import { useMutation } from "@tanstack/react-query";

import {
  adjustRegistration,
  cancelRegistration,
  markRegistrationAbsent,
} from "@/api/registration-adjustments";
import type { ApiError } from "@/lib/api-error";
import type { MealRegistrationDto } from "@/types/api";
import type { AdjustableStatus, AdjustmentKind } from "@/mappers/registration-adjustment";

/**
 * Mot lenh dieu chinh da dinh hinh ma hook se gui len. `reason` luon di kem vi
 * UI thu reason cho moi dieu chinh (bat buoc sau cutoff, va la good practice).
 */
export interface AdjustmentCommand {
  registrationId: string;
  kind: AdjustmentKind;
  reason: string;
  /** Chi dung cho kind "adjust": doi mon. */
  mealSessionDishId?: string;
  /** Chi dung cho kind "adjust": dat status moi. */
  status?: AdjustableStatus;
}

/**
 * Kiem tra reason truoc khi gui, dap ung tieu chi hoan thanh P2-09: admin
 * khong the gui dieu chinh thieu reason. Gating nay o client la lop dau; backend
 * van la nguon su that cho quy tac sau cutoff. Tra null khi hop le.
 */
export function reasonError(reason: string): string | null {
  return reason.trim().length === 0 ? "Vui long nhap ly do truoc khi gui dieu chinh." : null;
}

function runCommand(command: AdjustmentCommand): Promise<MealRegistrationDto> {
  const reason = command.reason.trim();
  switch (command.kind) {
    case "cancel":
      return cancelRegistration(command.registrationId, { reason });
    case "mark-absent":
      return markRegistrationAbsent(command.registrationId, { reason });
    case "adjust":
      return adjustRegistration(command.registrationId, {
        mealSessionDishId: command.mealSessionDishId,
        status: command.status,
        reason,
      });
  }
}

/**
 * Mutation dieu chinh dang ky (cancel / mark-absent / adjust) cho P2-09.
 *
 * Chi tra ve mot mutation vi ba lenh cung tra MealRegistrationDto va cung mot
 * dong xu ly reason; `kind` trong command quyet dinh endpoint. Khong co endpoint
 * doc danh sach/lich su, nen hook chi thuc hien lenh va tra registration moi;
 * page giu before/after va lich su phien tu cac response thanh cong.
 */
export function useRegistrationAdjustment() {
  return useMutation<MealRegistrationDto, ApiError, AdjustmentCommand>({
    mutationFn: runCommand,
  });
}
