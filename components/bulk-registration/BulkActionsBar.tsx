import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { BulkDishOption } from "@/mappers/bulk-registration";

interface BulkActionsBarProps {
  dishOptions: BulkDishOption[];
  disabled: boolean;
  onApplyDishToAll: (mealSessionDishId: string) => void;
  onMarkAllNotEating: () => void;
  onClearAll: () => void;
}

/**
 * Thanh thao tac hang loat: chon mot mon roi ap cho tat ca nhan vien, danh dau
 * tat ca khong an, hoac xoa het lua chon. Dumb component: giu local state cho o
 * select va goi handler.
 */
export function BulkActionsBar({
  dishOptions,
  disabled,
  onApplyDishToAll,
  onMarkAllNotEating,
  onClearAll,
}: BulkActionsBarProps) {
  const [dishToApply, setDishToApply] = useState("");

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-muted/30 p-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-sm font-medium" htmlFor="bulk-apply-dish">
          Ap mon cho tat ca
        </label>
        <div className="flex gap-2">
          <Select
            id="bulk-apply-dish"
            value={dishToApply}
            disabled={disabled || dishOptions.length === 0}
            onChange={(event) => setDishToApply(event.target.value)}
          >
            <option value="">Chon mon de ap...</option>
            {dishOptions.map((dish) => (
              <option key={dish.mealSessionDishId} value={dish.mealSessionDishId}>
                {dish.label}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            variant="secondary"
            disabled={disabled || dishToApply === ""}
            onClick={() => onApplyDishToAll(dishToApply)}
          >
            Ap tat ca
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" disabled={disabled} onClick={onMarkAllNotEating}>
          Tat ca khong an
        </Button>
        <Button type="button" variant="ghost" disabled={disabled} onClick={onClearAll}>
          Xoa lua chon
        </Button>
      </div>
    </div>
  );
}
