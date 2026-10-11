import { AlertTriangle, CircleCheck, Clock, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionStatusBadge } from "@/components/meal-sessions/SessionStatusBadge";
import { DishPicker } from "@/components/my-meals/DishPicker";
import type { ApiError } from "@/lib/api-error";
import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import type { MyMealsSessionView } from "@/mappers/my-meals";

interface MyMealsSessionCardProps {
  view: MyMealsSessionView;
  /** Dang chay mot thao tac (chon/doi/huy) de khoa nut tranh double submit. */
  isMutating: boolean;
  /** Loi tu lan thao tac gan nhat (vd CONFLICT khi cua so da dong). */
  actionError: ApiError | null;
  onPick: (mealSessionDishId: string) => void;
  onCancel: () => void;
}

/**
 * The hien thi mot session cho nhan vien tu dang ky. Dumb component: nhan view
 * da dinh hinh va handler, chi render. Bo cuc chay tot o mobile (1 cot) va
 * desktop (luoi mon 2 cot). Trang thai cua so dung text + icon, va he qua khi
 * khong dang ky duoc neu ro bang chu.
 */
export function MyMealsSessionCard({
  view,
  isMutating,
  actionError,
  onPick,
  onCancel,
}: MyMealsSessionCardProps) {
  const actionsDisabled = !view.canRegister || isMutating;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">
            {view.mealTypeLabel} - {view.serviceDate}
          </CardTitle>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            <Clock className="size-4" aria-hidden />
            Han chot dang ky: {view.cutoffAtDisplay}
          </p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <SessionStatusBadge label={view.windowLabel} />
          {view.windowReason ? (
            <span className="text-muted-foreground text-xs">{view.windowReason}</span>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Lua chon hien tai</p>
          {view.hasActiveRegistration ? (
            <p className="flex items-center gap-1.5 text-sm text-emerald-700">
              <CircleCheck className="size-4" aria-hidden />
              Ban da chon mon cho bua nay.
            </p>
          ) : (
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <XCircle className="size-4" aria-hidden />
              Chua chon mon.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Chon mon</p>
          <DishPicker
            dishes={view.dishes}
            selectedMealSessionDishId={view.selectedMealSessionDishId}
            disabled={actionsDisabled}
            onPick={onPick}
          />
        </div>

        {view.closedConsequence ? (
          <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p>{view.closedConsequence}</p>
          </div>
        ) : null}

        {actionError ? <ApiErrorNotice error={actionError} context="dang ky bua an" /> : null}

        {view.hasActiveRegistration && view.canRegister ? (
          <div>
            <Button variant="destructive" size="sm" disabled={actionsDisabled} onClick={onCancel}>
              {isMutating ? <Loader2 className="animate-spin" aria-hidden /> : null}
              Huy dang ky
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
