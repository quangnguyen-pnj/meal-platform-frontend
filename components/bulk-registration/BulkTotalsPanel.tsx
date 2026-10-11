import { AlertTriangle, UtensilsCrossed } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BulkGridDerived } from "@/mappers/bulk-registration";

interface BulkTotalsPanelProps {
  derived: BulkGridDerived;
}

/**
 * Bang tong hop live theo mon va theo trang thai (an / khong an / chua chon).
 * Dumb component: nhan so da dan xuat tu hook. So chua chon hien noi bat de
 * nguoi dung thay ro truoc khi submit.
 */
export function BulkTotalsPanel({ derived }: BulkTotalsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UtensilsCrossed className="size-4" aria-hidden />
          Tong hop theo mon
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {derived.dishTotals.length === 0 ? (
          <p className="text-muted-foreground text-sm">Chua co mon de thong ke.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {derived.dishTotals.map((dish) => (
              <li
                key={dish.mealSessionDishId}
                className="flex items-center justify-between text-sm"
              >
                <span>{dish.label}</span>
                <span className="font-mono font-medium">{dish.count}</span>
              </li>
            ))}
          </ul>
        )}

        <dl className="grid grid-cols-2 gap-2 border-t pt-3 text-sm">
          <dt className="text-muted-foreground">Tong nhan vien</dt>
          <dd className="text-right font-medium">{derived.totalEmployees}</dd>
          <dt className="text-muted-foreground">Co suat an</dt>
          <dd className="text-right font-medium text-emerald-700">{derived.eatingCount}</dd>
          <dt className="text-muted-foreground">Khong an</dt>
          <dd className="text-right font-medium">{derived.notEatingCount}</dd>
        </dl>

        {derived.unselectedCount > 0 ? (
          <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              Con <span className="font-semibold">{derived.unselectedCount}</span> nhan vien chua
              chon. Neu submit ngay, nhung nguoi nay se khong co suat an.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
