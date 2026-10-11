import { useState, type FormEvent } from "react";

import { useReservePoolMutations } from "@/hooks/useReservePool";
import { ApiError } from "@/lib/api-error";
import type { ReserveAllocationViewDto } from "@/types/api";

/**
 * Form state cho dialog cap suat du phong. reason la bat buoc; `canSubmit`
 * chan submit o client khi reason rong (ngoai ra backend van tra
 * VALIDATION_ERROR). Mutation nam o useReservePoolMutations.
 *
 * `onCreated` nhan allocation vua tao de trang hien thi no tach biet voi
 * registration thuong.
 */
export function useReserveAllocationForm(
  mealSessionId: string | null,
  onCreated: (allocation: ReserveAllocationViewDto) => void,
) {
  const { allocate } = useReservePoolMutations(mealSessionId);

  const [isOpen, setIsOpen] = useState(false);
  const [mealSessionDishId, setMealSessionDishId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<ApiError | null>(null);

  const reasonTrimmed = reason.trim();
  const quantityValue = Number(quantity);
  const isQuantityValid = Number.isInteger(quantityValue) && quantityValue >= 1;
  const canSubmit = mealSessionDishId !== "" && reasonTrimmed.length > 0 && isQuantityValid;

  function open(defaultMealSessionDishId: string) {
    setMealSessionDishId(defaultMealSessionDishId);
    setEmployeeId("");
    setQuantity("1");
    setReason("");
    setError(null);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }
    setError(null);
    try {
      const allocation = await allocate.mutateAsync({
        mealSessionDishId,
        employeeId: employeeId.trim() || undefined,
        quantity: quantityValue,
        reason: reasonTrimmed,
      });
      onCreated(allocation);
      close();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({ code: "unexpected_error", message: "Cap suat that bai", status: 0 }),
      );
    }
  }

  return {
    isOpen,
    mealSessionDishId,
    employeeId,
    quantity,
    reason,
    error,
    canSubmit,
    isSubmitting: allocate.isPending,
    setMealSessionDishId,
    setEmployeeId,
    setQuantity,
    setReason,
    open,
    close,
    onSubmit,
  };
}
