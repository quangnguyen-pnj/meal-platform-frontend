"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { MyMealsSessionCard } from "@/components/my-meals/MyMealsSessionCard";
import { useAuth } from "@/contexts/AuthContext";
import type { ApiError } from "@/lib/api-error";
import { useMyMealsMutations, useMyMealsSessions } from "@/hooks/useMyMeals";
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

export default function MyMealsPage() {
  const { principal, hasPermission } = useAuth();
  const canSelfRegister = hasPermission(PERMISSIONS.registrationSelf);
  const hasLinkedEmployee = principal?.employeeId != null;
  const isEligible = canSelfRegister && hasLinkedEmployee;

  const sessions = useMyMealsSessions(isEligible);
  const mutations = useMyMealsMutations();

  // Loi thao tac theo tung session de khong lan sang the khac.
  const [actionError, setActionError] = useState<{ mealSessionId: string; error: ApiError } | null>(
    null,
  );
  const isMutating = mutations.pick.isPending || mutations.cancel.isPending;

  function handlePick(mealSessionId: string, mealSessionDishId: string) {
    setActionError(null);
    mutations.pick.mutate(
      { mealSessionId, mealSessionDishId },
      { onError: (error) => setActionError({ mealSessionId, error }) },
    );
  }

  function handleCancel(mealSessionId: string) {
    if (!window.confirm("Huy dang ky bua an nay?")) {
      return;
    }
    setActionError(null);
    mutations.cancel.mutate(
      { mealSessionId },
      { onError: (error) => setActionError({ mealSessionId, error }) },
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Bua an cua toi</h1>
        <p className="text-muted-foreground">
          Xem menu, chon mon va xac nhan truoc gio chot. Neu khong dang ky, ban se khong duoc cung
          cap suat an.
        </p>
      </header>

      {!canSelfRegister ? (
        <NotEligibleNotice
          title="Khong co quyen"
          detail="Tai khoan cua ban khong co quyen tu dang ky bua an."
        />
      ) : !hasLinkedEmployee ? (
        <NotEligibleNotice
          title="Chua gan nhan vien"
          detail="Tai khoan cua ban chua gan voi ho so nhan vien nen khong the tu dang ky bua an."
        />
      ) : sessions.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai danh sach bua an...</span>
        </div>
      ) : sessions.error ? (
        <ApiErrorNotice error={sessions.error} context="xem bua an cua ban" />
      ) : sessions.data && sessions.data.length > 0 ? (
        <div className="flex flex-col gap-4">
          {sessions.data.map((session) => (
            <MyMealsSessionCard
              key={session.mealSessionId}
              view={session}
              isMutating={isMutating}
              actionError={
                actionError?.mealSessionId === session.mealSessionId ? actionError.error : null
              }
              onPick={(mealSessionDishId) => handlePick(session.mealSessionId, mealSessionDishId)}
              onCancel={() => handleCancel(session.mealSessionId)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">
            Hien chua co bua an nao mo dang ky cho ban. Vui long quay lai sau.
          </p>
        </div>
      )}
    </div>
  );
}
