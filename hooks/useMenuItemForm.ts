import { useState, type FormEvent } from "react";

import { useWeeklyMenuMutations } from "@/hooks/useWeeklyMenu";
import { ApiError } from "@/lib/api-error";
import type { MealType } from "@/types/api";

interface AddItemContext {
  menuId: string;
  serviceDate: string;
  mealType: MealType;
}

/**
 * Form state cho viec them mot muc mon vao o (ngay + bua) da chon. Modal mo khi
 * `context` khac null; nguoi dung chi can chon mon. serviceDate/mealType lay tu
 * o duoc bam nen khong cho sua.
 */
export function useMenuItemForm(factoryId: string | undefined) {
  const mutations = useWeeklyMenuMutations(factoryId);

  const [context, setContext] = useState<AddItemContext | null>(null);
  const [dishId, setDishId] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function open(next: AddItemContext) {
    setContext(next);
    setDishId("");
    setError(null);
  }

  function close() {
    setContext(null);
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!context || !dishId) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await mutations.addItem.mutateAsync({
        menuId: context.menuId,
        input: {
          serviceDate: context.serviceDate,
          mealType: context.mealType,
          dishId,
        },
      });
      close();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({ code: "unexpected_error", message: "Them mon that bai", status: 0 }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    context,
    dishId,
    error,
    isSubmitting,
    setDishId,
    open,
    close,
    onSubmit,
  };
}
