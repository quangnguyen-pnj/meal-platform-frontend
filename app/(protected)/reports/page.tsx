"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { SessionSummaryPanel } from "@/components/reports/SessionSummaryPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useMealSessions } from "@/hooks/useMealSessions";
import { useScopeTree } from "@/hooks/useScopeTree";
import { useSessionSummary } from "@/hooks/useSessionSummary";
import type { MealSessionFilter } from "@/api/meal-sessions";
import { PERMISSIONS } from "@/mappers/principal";

/**
 * Man hinh tong hop session (P1-06, chi doc). Nguoi dung chon nha may va (tuy
 * chon) ngay vận hành de liet ke session, chon mot session roi xem tong hop.
 * Backend luon loc theo scope nen danh sach va tong hop deu gioi han trong
 * pham vi duoc cap.
 */
export default function ReportsPage() {
  const { hasPermission } = useAuth();
  const canReadReports = hasPermission(PERMISSIONS.reportRead);

  const [factoryId, setFactoryId] = useState<string>("");
  const [serviceDate, setServiceDate] = useState<string>("");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const scopeTree = useScopeTree();
  const factories = useMemo(() => scopeTree.data?.factories ?? [], [scopeTree.data]);

  const filter = useMemo<MealSessionFilter | null>(
    () => (factoryId ? { factoryId, serviceDate: serviceDate || undefined } : null),
    [factoryId, serviceDate],
  );
  const sessions = useMealSessions(filter);
  const summary = useSessionSummary(selectedSessionId);

  if (!canReadReports) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Ban khong co quyen xem tong hop session.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Tong hop session</h1>
        <p className="text-muted-foreground">
          Xem cac mon duoc chao va so dang ky cua mot session trong pham vi duoc cap.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="report-factory">Nha may</Label>
          <Select
            id="report-factory"
            className="max-w-xs"
            value={factoryId}
            onChange={(event) => {
              setFactoryId(event.target.value);
              setSelectedSessionId(null);
            }}
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
          <Label htmlFor="report-service-date">Ngay vận hanh (tuy chon)</Label>
          <Input
            id="report-service-date"
            type="date"
            className="max-w-[12rem]"
            value={serviceDate}
            onChange={(event) => {
              setServiceDate(event.target.value);
              setSelectedSessionId(null);
            }}
          />
        </div>
      </div>

      {!factoryId ? (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">Chon mot nha may de chon session.</p>
        </div>
      ) : sessions.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai danh sach session...</span>
        </div>
      ) : sessions.error ? (
        <ApiErrorNotice error={sessions.error} context="xem danh sach session" />
      ) : sessions.data && sessions.data.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {sessions.data.map((session) => (
            <Button
              key={session.id}
              variant={session.id === selectedSessionId ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSessionId(session.id)}
            >
              {session.serviceDate} - {session.mealTypeLabel}
            </Button>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground text-sm">Khong co session nao cho bo loc hien tai.</p>
        </div>
      )}

      {selectedSessionId ? (
        summary.isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            <span>Dang tai tong hop...</span>
          </div>
        ) : summary.error ? (
          <ApiErrorNotice error={summary.error} context="xem tong hop session" />
        ) : summary.data ? (
          <SessionSummaryPanel summary={summary.data} />
        ) : null
      ) : null}
    </div>
  );
}
