"use client";

import { useRef, type ChangeEvent } from "react";
import { CheckCircle2, Download, Loader2, RotateCcw, Upload } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { ImportRowTable } from "@/components/workforce/ImportRowTable";
import { ImportStepper, type ImportStep } from "@/components/workforce/ImportStepper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeImport } from "@/hooks/useEmployeeImport";
import { PERMISSIONS } from "@/mappers/principal";

function currentStep(hasJob: boolean, applied: boolean): ImportStep {
  if (applied) {
    return "done";
  }
  if (hasJob) {
    return "preview";
  }
  return "upload";
}

export default function ImportsPage() {
  const { hasPermission } = useAuth();
  const canImport = hasPermission(PERMISSIONS.employeeImport);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { jobId, job, rows, applyResult, template, upload, apply, reset } = useEmployeeImport();

  function onPickFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      upload.mutate(file);
    }
  }

  const step = currentStep(jobId !== null, applyResult !== null);

  if (!canImport) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold">Nhap nhan vien</h1>
        <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p>Tai khoan cua ban khong du quyen de nhap nhan vien.</p>
        </div>
      </div>
    );
  }

  const jobData = job.data;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Nhap nhan vien</h1>
          <p className="text-muted-foreground">
            Tai mau Excel, dien du lieu, tai len de kiem tra tung dong roi xac nhan nhap.
          </p>
        </div>
        {jobId !== null ? (
          <Button variant="outline" onClick={reset}>
            <RotateCcw aria-hidden />
            Nhap file khac
          </Button>
        ) : null}
      </header>

      <ImportStepper current={step} />

      <Card>
        <CardHeader>
          <CardTitle>1. Tai mau Excel</CardTitle>
          <CardDescription>
            File .xlsx gom cac cot: employeeCode, fullName, email (tuy chon), factoryCode,
            departmentCode, teamCode, hasPersonalDevice.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div>
            <Button
              variant="outline"
              onClick={() => template.mutate()}
              disabled={template.isPending}
            >
              {template.isPending ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Download aria-hidden />
              )}
              Tai mau .xlsx
            </Button>
          </div>
          {template.error ? (
            <ApiErrorNotice error={template.error} context="tai mau nhap nhan vien" />
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. Tai file len</CardTitle>
          <CardDescription>
            He thong kiem tra toan bo cac dong ngay khi tai len. Chi nhap duoc khi tat ca cac dong
            hop le.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={onPickFile}
          />
          <div>
            <Button onClick={() => fileInputRef.current?.click()} disabled={upload.isPending}>
              {upload.isPending ? (
                <Loader2 className="animate-spin" aria-hidden />
              ) : (
                <Upload aria-hidden />
              )}
              Chon file .xlsx
            </Button>
          </div>
          {upload.error ? (
            <ApiErrorNotice error={upload.error} context="tai file nhap nhan vien" />
          ) : null}
        </CardContent>
      </Card>

      {jobId !== null ? (
        <Card>
          <CardHeader>
            <CardTitle>3. Xem truoc va xac nhan</CardTitle>
            <CardDescription>
              Doi chieu tung dong truoc khi nhap. Dong loi phai sua trong file va tai len lai; he
              thong khong nhap du lieu mot phan.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {job.isLoading || rows.isLoading ? (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                <span>Dang tai ket qua kiem tra...</span>
              </div>
            ) : job.error ? (
              <ApiErrorNotice error={job.error} context="xem ket qua import" />
            ) : rows.error ? (
              <ApiErrorNotice error={rows.error} context="xem cac dong import" />
            ) : jobData ? (
              <>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span>
                    File: <span className="font-medium">{jobData.originalFilename}</span>
                  </span>
                  <span>
                    Trang thai: <span className="font-medium">{jobData.statusLabel}</span>
                  </span>
                  <span>
                    Tong so dong: <span className="font-medium">{jobData.rowCount}</span>
                  </span>
                  <span>
                    So dong loi:{" "}
                    <span
                      className={
                        jobData.errorCount > 0 ? "text-destructive font-medium" : "font-medium"
                      }
                    >
                      {jobData.errorCount}
                    </span>
                  </span>
                </div>

                {rows.data ? <ImportRowTable rows={rows.data} /> : null}

                {applyResult ? (
                  <div className="flex items-start gap-3 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">Da nhap xong</p>
                      <p>
                        Tao moi {applyResult.created} nhan vien, cap nhat {applyResult.updated} nhan
                        vien.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {apply.error ? (
                      <ApiErrorNotice error={apply.error} context="xac nhan nhap nhan vien" />
                    ) : null}
                    {!jobData.canApply ? (
                      <p className="text-muted-foreground text-sm">
                        Khong the nhap vi con dong loi. Hay sua trong file Excel va tai len lai.
                      </p>
                    ) : null}
                    <div>
                      <Button
                        onClick={() => apply.mutate()}
                        disabled={!jobData.canApply || apply.isPending}
                      >
                        {apply.isPending ? (
                          <Loader2 className="animate-spin" aria-hidden />
                        ) : (
                          <CheckCircle2 aria-hidden />
                        )}
                        Xac nhan nhap
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
