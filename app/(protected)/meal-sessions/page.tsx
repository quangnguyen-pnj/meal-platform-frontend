"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { DeriveSessionsCard } from "@/components/meal-sessions/DeriveSessionsCard";
import { MealSessionTable } from "@/components/meal-sessions/MealSessionTable";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiError } from "@/lib/api-error";
import { useDeriveSessionsForm } from "@/hooks/useDeriveSessionsForm";
import { useMealSessionMutations, useMealSessions } from "@/hooks/useMealSessions";
import { useScopeTree } from "@/hooks/useScopeTree";
import type { MealSessionFilter } from "@/api/meal-sessions";
import type { MealSessionAction, MealSessionView } from "@/mappers/meal-session";
import { PERMISSIONS } from "@/mappers/principal";

const ACTION_CONFIRM: Record<MealSessionAction, string> = {
  publish: "Cong bo session nay?",
  open: "Mo dang ky cho session nay?",
  close: "Chot session nay? Nhan vien se khong the thay doi dang ky.",
  cancel: "Huy session nay? Thao tac khong the hoan tac.",
};

export default function MealSessionsPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.mealSessionManage);

  const [factoryId, setFactoryId] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");

  const scopeTree = useScopeTree();
  const factories = useMemo(() => scopeTree.data?.factories ?? [], [scopeTree.data]);

  const filter = useMemo<MealSessionFilter | null>(
    () => (factoryId ? { factoryId, serviceDate: serviceDate || undefined } : null),
    [factoryId, serviceDate],
  );

  const sessions = useMealSessions(filter);
  const mutations = useMealSessionMutations();
  const deriveForm = useDeriveSessionsForm();

  const [actionError, setActionError] = useState<ApiError | null>(null);
  const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

  function runAction(session: MealSessionView, action: MealSessionAction) {
    if (!window.confirm(ACTION_CONFIRM[action])) {
      return;
    }
    setActionError(null);
    setPendingSessionId(session.id);
    const mutation = mutations[action];
    mutation.mutate(session.id, {
      onError: (error) => setActionError(error),
      onSettled: () => setPendingSessionId(null),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Session bua an</h1>
        <p className="text-muted-foreground">
          Trang thai, thoi gian chot va thao tac vong doi cua session theo nha may.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="factory-filter">Nha may</Label>
          <Select
            id="factory-filter"
            className="max-w-xs"
            value={factoryId}
            onChange={(event) => setFactoryId(event.target.value)}
          >
            <option value="">Chon nha may</option>
            {factories.map((factory) => (
              <option key={factory.id} value={factory.id}>
                {factory.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="service-date-filter">Ngay vận hanh (tuy chon)</Label>
          <Input
            id="service-date-filter"
            type="date"
            className="max-w-[12rem]"
            value={serviceDate}
            onChange={(event) => setServiceDate(event.target.value)}
          />
        </div>
      </div>

      {actionError ? <ApiErrorNotice error={actionError} context="thao tac tren session" /> : null}

      {!factoryId ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Chon mot nha may de xem danh sach session.
          </p>
        </div>
      ) : sessions.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai danh sach session...</span>
        </div>
      ) : sessions.error ? (
        <ApiErrorNotice error={sessions.error} context="xem danh sach session" />
      ) : sessions.data ? (
        <MealSessionTable
          sessions={sessions.data}
          canManage={canManage}
          pendingSessionId={pendingSessionId}
          onAction={runAction}
        />
      ) : null}

      {canManage ? (
        <DeriveSessionsCard
          fields={deriveForm.fields}
          error={deriveForm.error}
          isSubmitting={deriveForm.isSubmitting}
          onField={deriveForm.setField}
          onSubmit={deriveForm.onSubmit}
        />
      ) : null}
    </div>
  );
}
