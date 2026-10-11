import { Info } from "lucide-react";

import { SessionStatusBadge } from "@/components/meal-sessions/SessionStatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionSummaryView } from "@/mappers/session-summary";

/**
 * Panel tong hop session (chi doc). Hien ngay vận hành, loai bua, trang thai
 * (text + icon) va danh sach mon da duoc chao, kem so da dang ky theo mon.
 *
 * O Phase 1 chua co dang ky nen so dang ky luon la 0; panel noi ro so lieu
 * dang ky se co o Phase 2 de nguoi dung khong hieu nham la loi.
 */
export function SessionSummaryPanel({ summary }: { summary: SessionSummaryView }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tong hop session</CardTitle>
        <CardDescription>
          {summary.serviceDate} - {summary.mealTypeLabel}
        </CardDescription>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <SessionStatusBadge label={summary.statusLabel} />
          <span className="text-muted-foreground text-sm">
            {summary.offeredDishCount} mon duoc chao
          </span>
          <span className="text-muted-foreground text-sm">
            Tong da dang ky: <span className="tabular-nums">{summary.totalRegistered}</span>
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {summary.hasNoRegistrations ? (
          <div className="text-muted-foreground flex items-start gap-2 rounded-md border border-dashed p-3 text-sm">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              Chua co dang ky. So lieu dang ky theo mon, phong ban va to se co o Phase 2; hien panel
              chi liet ke cac mon duoc chao.
            </span>
          </div>
        ) : null}

        {summary.dishes.length === 0 ? (
          <p className="text-muted-foreground text-sm">Session nay chua co mon nao.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Ma mon</th>
                  <th className="px-4 py-2 font-medium">Ten mon</th>
                  <th className="px-4 py-2 font-medium">Da dang ky</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {summary.dishes.map((dish) => (
                  <tr key={dish.dishId}>
                    <td className="px-4 py-2 font-mono text-xs">{dish.code}</td>
                    <td className="px-4 py-2">{dish.name}</td>
                    <td className="px-4 py-2 tabular-nums">
                      {dish.registeredCount === 0 ? (
                        <span className="text-muted-foreground">Chua co dang ky</span>
                      ) : (
                        dish.registeredCount
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
