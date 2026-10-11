import { useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";

import { SessionStatusBadge } from "@/components/meal-sessions/SessionStatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConfigureReservePoolRequest } from "@/types/api";
import type { ReservePoolRowView } from "@/mappers/reserve";

interface ReservePoolTableProps {
  rows: ReservePoolRowView[];
  /** mealSessionDishId dang luu cau hinh, de khoa dung dong do. */
  configuringDishId: string | null;
  onConfigure: (mealSessionDishId: string, input: ConfigureReservePoolRequest) => void;
  onAllocate: (mealSessionDishId: string) => void;
}

/**
 * Bang reserve pool theo mon: hien thi bat/tat (text + icon), so da cau hinh,
 * da cap va con lai; kem form cau hinh (bat/tat + so luong) cho tung mon va nut
 * cap suat. Thuan trinh bay: nhan gia tri va handler tu trang.
 */
export function ReservePoolTable({
  rows,
  configuringDishId,
  onConfigure,
  onAllocate,
}: ReservePoolTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Session nay chua co mon nao de cau hinh.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <PoolRow
          key={row.mealSessionDishId}
          row={row}
          isConfiguring={configuringDishId === row.mealSessionDishId}
          onConfigure={onConfigure}
          onAllocate={onAllocate}
        />
      ))}
    </div>
  );
}

interface PoolRowProps {
  row: ReservePoolRowView;
  isConfiguring: boolean;
  onConfigure: (mealSessionDishId: string, input: ConfigureReservePoolRequest) => void;
  onAllocate: (mealSessionDishId: string) => void;
}

function PoolRow({ row, isConfiguring, onConfigure, onAllocate }: PoolRowProps) {
  const [isEnabled, setIsEnabled] = useState(row.isEnabled);
  const [quantity, setQuantity] = useState(String(row.quantity));

  const quantityValue = Number(quantity);
  const isQuantityValid = Number.isInteger(quantityValue) && quantityValue >= 0;

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-medium">{row.dishLabel}</span>
          <SessionStatusBadge label={row.enabledLabel} />
        </div>
        <dl className="flex gap-6 text-sm">
          <div className="flex flex-col">
            <dt className="text-muted-foreground text-xs">Da cau hinh</dt>
            <dd className="font-mono">{row.quantity}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-muted-foreground text-xs">Da cap</dt>
            <dd className="font-mono">{row.allocated}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-muted-foreground text-xs">Con lai</dt>
            <dd className="font-mono">{row.remaining}</dd>
          </div>
        </dl>
      </div>

      <form
        className="mt-4 flex flex-wrap items-end gap-3 border-t pt-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!isQuantityValid) {
            return;
          }
          onConfigure(row.mealSessionDishId, { isEnabled, quantity: quantityValue });
        }}
      >
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={isEnabled}
            onChange={(event) => setIsEnabled(event.target.checked)}
          />
          Bat pool du phong
        </label>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`reserve-qty-${row.mealSessionDishId}`}>So luong</Label>
          <Input
            id={`reserve-qty-${row.mealSessionDishId}`}
            type="number"
            min={0}
            className="w-28"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={isConfiguring || !isQuantityValid}
        >
          {isConfiguring ? <Loader2 className="animate-spin" aria-hidden /> : null}
          Luu cau hinh
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={!row.isEnabled}
          onClick={() => onAllocate(row.mealSessionDishId)}
        >
          <PlusCircle aria-hidden />
          Cap suat
        </Button>
      </form>
      <p className="text-muted-foreground mt-2 text-xs">
        Cau hinh chi hieu luc truoc gio chot. Cap suat chi dung sau gio chot va khi pool dang bat.
      </p>
    </div>
  );
}
