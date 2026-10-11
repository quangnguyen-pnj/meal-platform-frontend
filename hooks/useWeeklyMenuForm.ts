import { useState, type FormEvent } from "react";

import { useWeeklyMenuMutations } from "@/hooks/useWeeklyMenu";
import { ApiError } from "@/lib/api-error";

/**
 * Form state cho viec tao menu tuan moi cho factory da chon. Nguoi dung nhap
 * bat ky ngay nao trong tuan; backend chuan hoa ve Thu Hai HCM.
 */
export function useWeeklyMenuForm(factoryId: string | undefined) {
  const mutations = useWeeklyMenuMutations(factoryId);

  const [open, setOpen] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openForm() {
    setWeekStartDate("");
    setError(null);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!factoryId || !weekStartDate) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await mutations.createMenu.mutateAsync({ factoryId, weekStartDate });
      close();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({ code: "unexpected_error", message: "Tao menu that bai", status: 0 }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    open,
    weekStartDate,
    error,
    isSubmitting,
    setWeekStartDate,
    openForm,
    close,
    onSubmit,
  };
}
