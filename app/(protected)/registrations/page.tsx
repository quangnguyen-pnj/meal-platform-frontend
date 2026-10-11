"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { BulkCommitResultCard } from "@/components/bulk-registration/BulkCommitResultCard";
import { BulkEntryGrid } from "@/components/bulk-registration/BulkEntryGrid";
import { BulkTotalsPanel } from "@/components/bulk-registration/BulkTotalsPanel";
import { ConfirmSubmitDialog } from "@/components/bulk-registration/ConfirmSubmitDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useBulkRegistration } from "@/hooks/useBulkRegistration";
import { PERMISSIONS } from "@/mappers/principal";

function NotEligibleNotice({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      <div className="flex flex-col gap-1">
        <p className="font-medium">{title}</p>
        <p>{detail}</p>
      </div>
    </div>
  );
}

export default function RegistrationsPage() {
  const { hasPermission } = useAuth();
  const canBulkRegister = hasPermission(PERMISSIONS.registrationBulk);

  const [teamInput, setTeamInput] = useState("");
  const [sessionInput, setSessionInput] = useState("");
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const teamId = canBulkRegister ? activeTeamId : null;
  const sessionId = canBulkRegister ? activeSessionId : null;

  const bulk = useBulkRegistration({ teamId, mealSessionId: sessionId });

  const isBusy = bulk.validate.isPending || bulk.commit.isPending;

  function handleSubmit() {
    if (bulk.requiresUnselectedConfirmation) {
      setConfirmOpen(true);
      return;
    }
    bulk.commit.run();
  }

  function handleConfirmSubmit() {
    setConfirmOpen(false);
    bulk.commit.run();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Nhap dang ky hang loat</h1>
        <p className="text-muted-foreground">
          Chon team va session, nhap mon cho tung nhan vien hoac ap hang loat, xem tong theo mon va
          xac nhan truoc khi gui.
        </p>
      </header>

      {!canBulkRegister ? (
        <NotEligibleNotice
          title="Khong co quyen"
          detail="Tai khoan cua ban khong co quyen nhap dang ky hang loat."
        />
      ) : (
        <>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              setConfirmOpen(false);
              setActiveTeamId(teamInput.trim() || null);
              setActiveSessionId(sessionInput.trim() || null);
            }}
          >
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="team-id">Ma team</Label>
              <Input
                id="team-id"
                value={teamInput}
                placeholder="Nhap ma team"
                onChange={(event) => setTeamInput(event.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="session-id">Ma session bua an</Label>
              <Input
                id="session-id"
                value={sessionInput}
                placeholder="Nhap ma session"
                onChange={(event) => setSessionInput(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={!teamInput.trim() || !sessionInput.trim()}>
              Tai danh sach
            </Button>
          </form>

          {!bulk.isReady ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-muted-foreground text-sm">
                Nhap ma team va ma session bua an de tai danh sach nhan vien.
              </p>
            </div>
          ) : bulk.gridQuery.isLoading ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              <span>Dang tai danh sach nhan vien...</span>
            </div>
          ) : bulk.gridQuery.error ? (
            <ApiErrorNotice error={bulk.gridQuery.error} context="tai danh sach nhan vien" />
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex flex-1 flex-col gap-4">
                {bulk.dishesUnavailable ? (
                  <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Khong tai duoc danh sach mon</p>
                      <p>
                        Khong xem duoc chi tiet session (co the do thieu quyen quan ly session). Ban
                        van co the danh dau nhan vien khong an, nhung chua chon duoc mon cho den khi
                        co danh sach mon.
                      </p>
                      {bulk.dishesError ? (
                        <p className="text-amber-800">{bulk.dishesError.message}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <BulkEntryGrid
                  rows={bulk.rows}
                  dishOptions={bulk.dishOptions}
                  disabled={isBusy}
                  errorsByEmployee={bulk.errorsByEmployee}
                  onSelectionChange={bulk.setRowSelection}
                  onApplyDishToAll={bulk.applyDishToAll}
                  onMarkAllNotEating={bulk.markAllNotEating}
                  onClearAll={bulk.clearAll}
                />

                {bulk.validate.error ? (
                  <ApiErrorNotice error={bulk.validate.error} context="kiem tra danh sach" />
                ) : null}
                {bulk.commit.error ? (
                  <ApiErrorNotice error={bulk.commit.error} context="gui dang ky hang loat" />
                ) : null}

                {bulk.commit.summary ? (
                  <BulkCommitResultCard summary={bulk.commit.summary} />
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => bulk.validate.run()}
                  >
                    {bulk.validate.isPending ? (
                      <Loader2 className="animate-spin" aria-hidden />
                    ) : null}
                    Kiem tra (xem truoc)
                  </Button>
                  <Button type="button" disabled={isBusy} onClick={handleSubmit}>
                    {bulk.commit.isPending ? (
                      <Loader2 className="animate-spin" aria-hidden />
                    ) : null}
                    Gui dang ky
                  </Button>
                </div>
              </div>

              <div className="w-full lg:max-w-xs">
                <BulkTotalsPanel derived={bulk.derived} />
              </div>
            </div>
          )}

          <ConfirmSubmitDialog
            open={confirmOpen}
            unselectedCount={bulk.derived.unselectedCount}
            isSubmitting={bulk.commit.isPending}
            onConfirm={handleConfirmSubmit}
            onClose={() => setConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}
