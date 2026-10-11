"use client";

import { useState } from "react";

import { AdjustmentForm, type AdjustmentFormValues } from "@/components/adjustments/AdjustmentForm";
import { AdjustmentHistoryList } from "@/components/adjustments/AdjustmentHistoryList";
import { BeforeAfterPanel } from "@/components/adjustments/BeforeAfterPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { reasonError, useRegistrationAdjustment } from "@/hooks/useRegistrationAdjustment";
import { formatHcmInstant } from "@/mappers/meal-session";
import { PERMISSIONS } from "@/mappers/principal";
import {
  ADJUSTMENT_KIND_LABELS,
  toRegistrationSnapshot,
  type AdjustmentHistoryEntry,
  type RegistrationSnapshot,
} from "@/mappers/registration-adjustment";

const INITIAL_VALUES: AdjustmentFormValues = {
  registrationId: "",
  kind: "cancel",
  mealSessionDishId: "",
  status: "REGISTERED",
  reason: "",
};

function NotAllowedNotice() {
  return (
    <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex flex-col gap-1">
        <p className="font-medium">Khong co quyen</p>
        <p>Tai khoan cua ban khong co quyen dieu chinh dang ky (registration:adjust).</p>
      </div>
    </div>
  );
}

export default function AdjustmentsPage() {
  const { principal, hasPermission } = useAuth();
  const canAdjust = hasPermission(PERMISSIONS.registrationAdjust);

  const [values, setValues] = useState<AdjustmentFormValues>(INITIAL_VALUES);
  const [before, setBefore] = useState<RegistrationSnapshot | null>(null);
  const [after, setAfter] = useState<RegistrationSnapshot | null>(null);
  const [history, setHistory] = useState<AdjustmentHistoryEntry[]>([]);

  const adjustment = useRegistrationAdjustment();
  const currentReasonError = reasonError(values.reason);

  function handleSubmit() {
    if (currentReasonError !== null) {
      return;
    }
    // Trang thai dang hien (ket qua lan truoc cho cung registration) tro thanh
    // "truoc" cua lan nay; neu dang doi registration khac thi khong co truoc.
    const priorSnapshot = after && after.id === values.registrationId.trim() ? after : null;

    adjustment.mutate(
      {
        registrationId: values.registrationId.trim(),
        kind: values.kind,
        reason: values.reason,
        mealSessionDishId:
          values.kind === "adjust" && values.mealSessionDishId.trim().length > 0
            ? values.mealSessionDishId.trim()
            : undefined,
        status: values.kind === "adjust" ? values.status : undefined,
      },
      {
        onSuccess: (dto) => {
          const nextSnapshot = toRegistrationSnapshot(dto);
          setBefore(priorSnapshot);
          setAfter(nextSnapshot);
          if (priorSnapshot) {
            setHistory((entries) => [
              {
                kind: values.kind,
                kindLabel: ADJUSTMENT_KIND_LABELS[values.kind],
                reason: values.reason.trim(),
                actorName: principal?.displayName ?? "Khong ro",
                performedAtDisplay: formatHcmInstant(new Date().toISOString()),
                before: priorSnapshot,
                after: nextSnapshot,
              },
              ...entries,
            ]);
          }
          setValues((current) => ({ ...current, reason: "" }));
        },
      },
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Dieu chinh dang ky</h1>
        <p className="text-muted-foreground">
          Huy, danh dau vang hoac doi mon/trang thai cho mot dang ky. Sau cutoff chi admin co quyen
          moi dieu chinh duoc va bat buoc nhap ly do; thay doi duoc ghi lai kem nguoi thuc hien va
          thoi diem.
        </p>
      </header>

      {!canAdjust ? (
        <NotAllowedNotice />
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thao tac dieu chinh</CardTitle>
            </CardHeader>
            <CardContent>
              <AdjustmentForm
                values={values}
                reasonError={currentReasonError}
                actionError={adjustment.error ?? null}
                isSubmitting={adjustment.isPending}
                onChange={setValues}
                onSubmit={handleSubmit}
              />
            </CardContent>
          </Card>

          <BeforeAfterPanel before={before} after={after} />

          <AdjustmentHistoryList entries={history} />
        </>
      )}
    </div>
  );
}
