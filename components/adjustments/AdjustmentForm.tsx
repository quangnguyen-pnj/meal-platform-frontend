import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { ApiError } from "@/lib/api-error";
import {
  ADJUSTMENT_KIND_LABELS,
  STATUS_OPTIONS,
  type AdjustableStatus,
  type AdjustmentKind,
} from "@/mappers/registration-adjustment";

/** Gia tri form dieu chinh, do page so huu; component chi render va bao event. */
export interface AdjustmentFormValues {
  registrationId: string;
  kind: AdjustmentKind;
  mealSessionDishId: string;
  status: AdjustableStatus;
  reason: string;
}

interface AdjustmentFormProps {
  values: AdjustmentFormValues;
  /** Loi reason client-side (null khi hop le); chan submit khi co. */
  reasonError: string | null;
  /** Loi tu lan goi API gan nhat (FORBIDDEN / VALIDATION_ERROR / CONFLICT). */
  actionError: ApiError | null;
  isSubmitting: boolean;
  onChange: (values: AdjustmentFormValues) => void;
  onSubmit: () => void;
}

const KIND_OPTIONS: AdjustmentKind[] = ["cancel", "mark-absent", "adjust"];

/**
 * Form dieu chinh dang ky (P2-09). Dumb component: nhan values + handler, chi
 * render. Reason la bat buoc o client (nut submit bi khoa khi reason rong), khop
 * yeu cau sau cutoff cua backend. Loi FORBIDDEN/VALIDATION_ERROR/CONFLICT hien
 * inline ngay trong form.
 */
export function AdjustmentForm({
  values,
  reasonError,
  actionError,
  isSubmitting,
  onChange,
  onSubmit,
}: AdjustmentFormProps) {
  const update = (patch: Partial<AdjustmentFormValues>) => onChange({ ...values, ...patch });

  const canSubmit =
    !isSubmitting && values.registrationId.trim().length > 0 && reasonError === null;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (canSubmit) {
          onSubmit();
        }
      }}
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="registration-id">Ma dang ky</Label>
        <Input
          id="registration-id"
          value={values.registrationId}
          placeholder="Nhap ma registration can dieu chinh"
          onChange={(event) => update({ registrationId: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="adjustment-kind">Loai dieu chinh</Label>
        <Select
          id="adjustment-kind"
          value={values.kind}
          onChange={(event) => update({ kind: event.target.value as AdjustmentKind })}
        >
          {KIND_OPTIONS.map((kind) => (
            <option key={kind} value={kind}>
              {ADJUSTMENT_KIND_LABELS[kind]}
            </option>
          ))}
        </Select>
      </div>

      {values.kind === "adjust" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adjust-dish">Ma mon moi (tuy chon)</Label>
            <Input
              id="adjust-dish"
              value={values.mealSessionDishId}
              placeholder="Ma MealSessionDish, de trong neu khong doi"
              onChange={(event) => update({ mealSessionDishId: event.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="adjust-status">Trang thai moi</Label>
            <Select
              id="adjust-status"
              value={values.status}
              onChange={(event) => update({ status: event.target.value as AdjustableStatus })}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="adjustment-reason">
          Ly do <span className="text-destructive">*</span>
        </Label>
        <textarea
          id="adjustment-reason"
          value={values.reason}
          rows={3}
          placeholder="Bat buoc: neu ro ly do dieu chinh (vd nhan vien bao vang sau cutoff)"
          aria-invalid={reasonError !== null}
          onChange={(event) => update({ reason: event.target.value })}
          className="border-input focus-visible:ring-ring aria-invalid:border-destructive flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        {reasonError ? <p className="text-destructive text-sm">{reasonError}</p> : null}
        <p className="text-muted-foreground text-xs">
          Sau cutoff, reason la bat buoc va duoc ghi lai kem nguoi thuc hien va thoi diem.
        </p>
      </div>

      {actionError ? <ApiErrorNotice error={actionError} context="dieu chinh dang ky" /> : null}

      <div>
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
          Gui dieu chinh
        </Button>
      </div>
    </form>
  );
}
