import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type { ApiError } from "@/lib/api-error";
import type { ReservePoolRowView } from "@/mappers/reserve";

interface ReserveAllocationDialogProps {
  open: boolean;
  rows: ReservePoolRowView[];
  mealSessionDishId: string;
  employeeId: string;
  quantity: string;
  reason: string;
  error: ApiError | null;
  canSubmit: boolean;
  isSubmitting: boolean;
  onMealSessionDishIdChange: (value: string) => void;
  onEmployeeIdChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/**
 * Dialog cap mot suat du phong (sau gio chot). Chon mon, nguoi nhan (tuy chon),
 * so luong (mac dinh 1) va ly do (bat buoc). Nut gui bi khoa khi ly do rong.
 * Thuan trinh bay: nhan gia tri + handler tu trang.
 */
export function ReserveAllocationDialog({
  open,
  rows,
  mealSessionDishId,
  employeeId,
  quantity,
  reason,
  error,
  canSubmit,
  isSubmitting,
  onMealSessionDishIdChange,
  onEmployeeIdChange,
  onQuantityChange,
  onReasonChange,
  onClose,
  onSubmit,
}: ReserveAllocationDialogProps) {
  const reasonMissing = reason.trim().length === 0;

  return (
    <Modal
      open={open}
      title="Cap suat du phong"
      description="Suat du phong la mot khoan cap doc lap, khong phai dang ky thuong."
      onClose={onClose}
    >
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="allocate-dish">Mon</Label>
          <Select
            id="allocate-dish"
            required
            value={mealSessionDishId}
            onChange={(event) => onMealSessionDishIdChange(event.target.value)}
          >
            <option value="">Chon mon</option>
            {rows
              .filter((row) => row.isEnabled)
              .map((row) => (
                <option key={row.mealSessionDishId} value={row.mealSessionDishId}>
                  {row.dishLabel} (con lai {row.remaining})
                </option>
              ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="allocate-employee">Ma nhan vien nhan (tuy chon)</Label>
          <Input
            id="allocate-employee"
            value={employeeId}
            placeholder="De trong neu khong gan nhan vien"
            onChange={(event) => onEmployeeIdChange(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="allocate-quantity">So luong</Label>
          <Input
            id="allocate-quantity"
            type="number"
            min={1}
            className="w-28"
            value={quantity}
            onChange={(event) => onQuantityChange(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="allocate-reason">Ly do (bat buoc)</Label>
          <Input
            id="allocate-reason"
            required
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
          />
          {reasonMissing ? (
            <p className="text-destructive text-xs">Phai nhap ly do truoc khi cap suat.</p>
          ) : null}
        </div>

        {error ? <ApiErrorNotice error={error} context="cap suat du phong" /> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huy
          </Button>
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Cap suat
          </Button>
        </div>
      </form>
    </Modal>
  );
}
