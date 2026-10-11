"use client";

import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { ReserveAllocationDialog } from "@/components/reserve/ReserveAllocationDialog";
import { ReserveAllocationList } from "@/components/reserve/ReserveAllocationList";
import { ReservePoolTable } from "@/components/reserve/ReservePoolTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiError } from "@/lib/api-error";
import { useReserveAllocationForm } from "@/hooks/useReserveAllocationForm";
import { useReservePool, useReservePoolMutations } from "@/hooks/useReservePool";
import { toReserveAllocationRows } from "@/mappers/reserve";
import { PERMISSIONS } from "@/mappers/principal";
import type { ReserveAllocationViewDto } from "@/types/api";

/**
 * Man hinh reserve pool (P2-11). Admin nhap ma session, xem hạn mức du phong
 * theo mon (bat/tat, da cau hinh, da cap, con lai), cau hinh truoc gio chot va
 * cap suat sau gio chot kem ly do bat buoc.
 *
 * Backend chua co endpoint liet ke allocation, nen trang chi hien thi cac
 * allocation vua cap trong phien; so lieu tong (da cap, con lai) lay tu pool
 * sau khi lam moi query. Allocation duoc trinh bay tach biet voi dang ky thuong.
 */
export default function ReservePoolsPage() {
  const { hasPermission } = useAuth();
  const canManageReserve = hasPermission(PERMISSIONS.reserveManage);

  const [sessionInput, setSessionInput] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [createdAllocations, setCreatedAllocations] = useState<ReserveAllocationViewDto[]>([]);
  const [configuringDishId, setConfiguringDishId] = useState<string | null>(null);
  const [configureError, setConfigureError] = useState<ApiError | null>(null);

  const sessionId = canManageReserve ? activeSessionId : null;
  const pool = useReservePool(sessionId);
  const { configure } = useReservePoolMutations(sessionId);

  const allocationForm = useReserveAllocationForm(sessionId, (allocation) =>
    setCreatedAllocations((prev) => [allocation, ...prev]),
  );

  const rows = useMemo(() => pool.data ?? [], [pool.data]);

  const allocationRows = useMemo(() => {
    const labelByDishId = new Map(rows.map((row) => [row.mealSessionDishId, row.dishLabel]));
    return toReserveAllocationRows(createdAllocations, labelByDishId);
  }, [createdAllocations, rows]);

  function handleConfigure(
    mealSessionDishId: string,
    input: { isEnabled: boolean; quantity: number },
  ) {
    setConfigureError(null);
    setConfiguringDishId(mealSessionDishId);
    configure.mutate(
      { mealSessionDishId, input },
      {
        onError: (error) => setConfigureError(error),
        onSettled: () => setConfiguringDishId(null),
      },
    );
  }

  if (!canManageReserve) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Ban khong co quyen quan ly suat du phong.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Suat du phong</h1>
        <p className="text-muted-foreground">
          Cau hinh hạn mức du phong theo mon truoc gio chot, va cap suat sau gio chot kem ly do.
        </p>
      </header>

      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          setConfigureError(null);
          setCreatedAllocations([]);
          setActiveSessionId(sessionInput.trim() || null);
        }}
      >
        <div className="flex flex-1 flex-col gap-1.5">
          <Label htmlFor="reserve-session-id">Ma session bua an</Label>
          <Input
            id="reserve-session-id"
            value={sessionInput}
            placeholder="Nhap ma session de xem pool du phong"
            onChange={(event) => setSessionInput(event.target.value)}
          />
        </div>
        <Button type="submit" disabled={!sessionInput.trim()}>
          Xem pool
        </Button>
      </form>

      {!sessionId ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Nhap ma session bua an de xem va cau hinh pool du phong.
          </p>
        </div>
      ) : pool.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai pool du phong...</span>
        </div>
      ) : pool.error ? (
        <ApiErrorNotice error={pool.error} context="xem pool du phong" />
      ) : (
        <>
          {configureError ? (
            <ApiErrorNotice error={configureError} context="luu cau hinh pool du phong" />
          ) : null}
          <ReservePoolTable
            rows={rows}
            configuringDishId={configuringDishId}
            onConfigure={handleConfigure}
            onAllocate={allocationForm.open}
          />
          <ReserveAllocationList allocations={allocationRows} />
        </>
      )}

      <ReserveAllocationDialog
        open={allocationForm.isOpen}
        rows={rows}
        mealSessionDishId={allocationForm.mealSessionDishId}
        employeeId={allocationForm.employeeId}
        quantity={allocationForm.quantity}
        reason={allocationForm.reason}
        error={allocationForm.error}
        canSubmit={allocationForm.canSubmit}
        isSubmitting={allocationForm.isSubmitting}
        onMealSessionDishIdChange={allocationForm.setMealSessionDishId}
        onEmployeeIdChange={allocationForm.setEmployeeId}
        onQuantityChange={allocationForm.setQuantity}
        onReasonChange={allocationForm.setReason}
        onClose={allocationForm.close}
        onSubmit={allocationForm.onSubmit}
      />
    </div>
  );
}
