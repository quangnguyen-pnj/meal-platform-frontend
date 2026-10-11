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

/**
 * Nhap mot batch phieu giay (P2-07). Tai su dung nguyen grid bulk + totals +
 * confirm dialog + result card; chi them o nhap ma phieu giay bat buoc va
 * truyen source=PAPER_FORM de hook goi dung endpoint phieu giay.
 */
export default function PaperFormRegistrationsPage() {
  const { hasPermission } = useAuth();
  const canBulkRegister = hasPermission(PERMISSIONS.registrationBulk);

  const [teamInput, setTeamInput] = useState("");
  const [sessionInput, setSessionInput] = useState("");
  const [paperReference, setPaperReference] = useState("");
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const teamId = canBulkRegister ? activeTeamId : null;
  const sessionId = canBulkRegister ? activeSessionId : null;

  const paper = useBulkRegistration({
    teamId,
    mealSessionId: sessionId,
    source: "PAPER_FORM",
    paperReference,
  });

  const isBusy = paper.validate.isPending || paper.commit.isPending;
  const submitBlocked = isBusy || paper.paperReferenceMissing;

  function handleSubmit() {
    if (paper.paperReferenceMissing) {
      return;
    }
    if (paper.requiresUnselectedConfirmation) {
      setConfirmOpen(true);
      return;
    }
    paper.commit.run();
  }

  function handleConfirmSubmit() {
    setConfirmOpen(false);
    paper.commit.run();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Nhap phieu giay</h1>
        <p className="text-muted-foreground">
          Nhap mot batch tu phieu giay: chon team va session, ghi ma tham chieu phieu, nhap mon cho
          tung nhan vien theo thu tu phieu, xem loi tung dong va trang thai hoan tat.
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

          {!paper.isReady ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-muted-foreground text-sm">
                Nhap ma team va ma session bua an de tai danh sach nhan vien.
              </p>
            </div>
          ) : paper.gridQuery.isLoading ? (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              <span>Dang tai danh sach nhan vien...</span>
            </div>
          ) : paper.gridQuery.error ? (
            <ApiErrorNotice error={paper.gridQuery.error} context="tai danh sach nhan vien" />
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="paper-reference">
                    Ma tham chieu phieu giay <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="paper-reference"
                    value={paperReference}
                    placeholder="Vi du: PF-2025-001"
                    aria-invalid={paper.paperReferenceMissing}
                    disabled={isBusy}
                    onChange={(event) => setPaperReference(event.target.value)}
                  />
                  {paper.paperReferenceMissing ? (
                    <p className="text-destructive text-xs">
                      Ma tham chieu phieu giay la bat buoc truoc khi gui.
                    </p>
                  ) : null}
                </div>

                {paper.dishesUnavailable ? (
                  <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Khong tai duoc danh sach mon</p>
                      <p>
                        Khong xem duoc chi tiet session (co the do thieu quyen quan ly session). Ban
                        van co the danh dau nhan vien khong an, nhung chua chon duoc mon cho den khi
                        co danh sach mon.
                      </p>
                      {paper.dishesError ? (
                        <p className="text-amber-800">{paper.dishesError.message}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <BulkEntryGrid
                  rows={paper.rows}
                  dishOptions={paper.dishOptions}
                  disabled={isBusy}
                  errorsByEmployee={paper.errorsByEmployee}
                  onSelectionChange={paper.setRowSelection}
                  onApplyDishToAll={paper.applyDishToAll}
                  onMarkAllNotEating={paper.markAllNotEating}
                  onClearAll={paper.clearAll}
                />

                {paper.validate.error ? (
                  <ApiErrorNotice error={paper.validate.error} context="kiem tra phieu giay" />
                ) : null}
                {paper.commit.error ? (
                  <ApiErrorNotice error={paper.commit.error} context="gui phieu giay" />
                ) : null}

                {paper.commit.summary ? (
                  <BulkCommitResultCard summary={paper.commit.summary} />
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitBlocked}
                    onClick={() => paper.validate.run()}
                  >
                    {paper.validate.isPending ? (
                      <Loader2 className="animate-spin" aria-hidden />
                    ) : null}
                    Kiem tra (xem truoc)
                  </Button>
                  <Button type="button" disabled={submitBlocked} onClick={handleSubmit}>
                    {paper.commit.isPending ? (
                      <Loader2 className="animate-spin" aria-hidden />
                    ) : null}
                    Gui phieu giay
                  </Button>
                </div>
              </div>

              <div className="w-full lg:max-w-xs">
                <BulkTotalsPanel derived={paper.derived} />
              </div>
            </div>
          )}

          <ConfirmSubmitDialog
            open={confirmOpen}
            unselectedCount={paper.derived.unselectedCount}
            isSubmitting={paper.commit.isPending}
            onConfirm={handleConfirmSubmit}
            onClose={() => setConfirmOpen(false)}
          />
        </>
      )}
    </div>
  );
}
