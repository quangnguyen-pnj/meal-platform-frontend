import { useState, type FormEvent } from "react";

import { useMealSessionMutations } from "@/hooks/useMealSessions";
import { ApiError } from "@/lib/api-error";
import { hcmLocalInputToIso } from "@/services/hcm-time";

export interface DeriveSessionsFormState {
  weeklyMenuId: string;
  /** Gia tri tu input datetime-local, hieu theo gio HCM. */
  opensAt: string;
  cutoffAt: string;
}

const emptyState: DeriveSessionsFormState = {
  weeklyMenuId: "",
  opensAt: "",
  cutoffAt: "",
};

/**
 * Form state cho viec dan xuat session tu mot weekly menu da PUBLISHED. Nguoi
 * dung nhap gio theo HCM (datetime-local); hook chuyen sang instant ISO truoc
 * khi goi API. Component chi nhan field + setter.
 */
export function useDeriveSessionsForm() {
  const mutations = useMealSessionMutations();

  const [fields, setFields] = useState<DeriveSessionsFormState>(emptyState);
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function setField<K extends keyof DeriveSessionsFormState>(
    key: K,
    value: DeriveSessionsFormState[K],
  ) {
    setFields((previous) => ({ ...previous, [key]: value }));
  }

  function reset() {
    setFields(emptyState);
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const weeklyMenuId = fields.weeklyMenuId.trim();
    const opensAt = hcmLocalInputToIso(fields.opensAt);
    const cutoffAt = hcmLocalInputToIso(fields.cutoffAt);
    if (!weeklyMenuId || !opensAt || !cutoffAt) {
      setError(
        new ApiError({
          code: "validation",
          message: "Nhap weekly menu id, thoi gian mo va thoi gian chot.",
          status: 0,
        }),
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await mutations.create.mutateAsync({ weeklyMenuId, opensAt, cutoffAt });
      reset();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({ code: "unexpected_error", message: "Tao session that bai", status: 0 }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return { fields, error, isSubmitting, setField, onSubmit };
}
