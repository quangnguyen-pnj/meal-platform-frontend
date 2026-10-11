import { AlertTriangle, ShieldAlert } from "lucide-react";

import type { ApiError } from "@/lib/api-error";

interface ApiErrorNoticeProps {
  error: ApiError;
  /** Hanh dong dang thuc hien khi gap loi, dung cho thong bao 403. */
  context?: string;
}

/**
 * Hien thi ApiError co cau truc. Rieng 403 FORBIDDEN hien dang "khong co
 * quyen" ro rang thay vi coi nhu su co.
 */
export function ApiErrorNotice({ error, context }: ApiErrorNoticeProps) {
  const isForbidden = error.status === 403 || error.code === "FORBIDDEN";

  if (isForbidden) {
    return (
      <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
        <div className="flex flex-col gap-1">
          <p className="font-medium">Khong co quyen</p>
          <p>
            {context
              ? `Tai khoan cua ban khong du quyen de ${context}.`
              : "Tai khoan cua ban khong du quyen cho thao tac nay."}
          </p>
          <p className="text-amber-800">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
      <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" aria-hidden />
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="text-muted-foreground">Ma loi</dt>
        <dd className="font-mono">{error.code}</dd>
        <dt className="text-muted-foreground">Thong bao</dt>
        <dd>{error.message}</dd>
        {error.status > 0 ? (
          <>
            <dt className="text-muted-foreground">HTTP</dt>
            <dd className="font-mono">{error.status}</dd>
          </>
        ) : null}
        {error.requestId ? (
          <>
            <dt className="text-muted-foreground">Request ID</dt>
            <dd className="font-mono">{error.requestId}</dd>
          </>
        ) : null}
      </dl>
    </div>
  );
}
