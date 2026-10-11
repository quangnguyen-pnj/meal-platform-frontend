import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MyMealDishView } from "@/mappers/my-meals";

interface DishPickerProps {
  dishes: MyMealDishView[];
  selectedMealSessionDishId: string | null;
  /** Khoa khi cua so dong hoac dang co thao tac chay. */
  disabled: boolean;
  onPick: (mealSessionDishId: string) => void;
}

/**
 * Danh sach mon de nhan vien chon, dang nut radio-like. Mon dang chon co text
 * "Dang chon" + icon tick, khong chi dua vao mau. Co the chon lai de doi mon.
 */
export function DishPicker({
  dishes,
  selectedMealSessionDishId,
  disabled,
  onPick,
}: DishPickerProps) {
  if (dishes.length === 0) {
    return <p className="text-muted-foreground text-sm">Session nay chua co mon nao de chon.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {dishes.map((dish) => {
        const isSelected = dish.mealSessionDishId === selectedMealSessionDishId;
        return (
          <li key={dish.mealSessionDishId}>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onPick(dish.mealSessionDishId)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg border p-4 text-left text-sm transition-colors",
                "focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
                isSelected
                  ? "border-emerald-600 bg-emerald-50"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">{dish.name}</span>
                <span className="text-muted-foreground text-xs">{dish.code}</span>
              </span>
              {isSelected ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <Check className="size-4" aria-hidden />
                  Dang chon
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
