import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type { DishView } from "@/mappers/dish";
import { MEAL_TYPE_LABELS } from "@/mappers/weekly-menu";
import type { ApiError } from "@/lib/api-error";
import type { MealType } from "@/types/api";

interface AddMenuItemModalProps {
  open: boolean;
  serviceDate: string | null;
  mealType: MealType | null;
  /** Chi mon dang dung (ACTIVE) moi them duoc vao menu. */
  activeDishes: DishView[];
  dishId: string;
  error: ApiError | null;
  isSubmitting: boolean;
  onDishChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Modal them mot mon vao o (ngay + bua) da chon. Thuan trinh bay. */
export function AddMenuItemModal({
  open,
  serviceDate,
  mealType,
  activeDishes,
  dishId,
  error,
  isSubmitting,
  onDishChange,
  onClose,
  onSubmit,
}: AddMenuItemModalProps) {
  const mealLabel = mealType ? MEAL_TYPE_LABELS[mealType] : "";
  const title = serviceDate ? `Them mon - ${serviceDate} (${mealLabel})` : "Them mon";

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="menu-item-dish">Mon an</Label>
          {activeDishes.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Chua co mon dang dung nao. Them mon trong catalog truoc.
            </p>
          ) : (
            <Select
              id="menu-item-dish"
              required
              value={dishId}
              onChange={(event) => onDishChange(event.target.value)}
            >
              <option value="" disabled>
                Chon mon
              </option>
              {activeDishes.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name} ({dish.code})
                </option>
              ))}
            </Select>
          )}
        </div>

        {error ? <ApiErrorNotice error={error} context="them mon vao menu" /> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huy
          </Button>
          <Button type="submit" disabled={isSubmitting || activeDishes.length === 0 || !dishId}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Them
          </Button>
        </div>
      </form>
    </Modal>
  );
}
