import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApiError } from "@/lib/api-error";
import type { HealthView } from "@/mappers/health";

interface HealthStatusCardProps {
  isLoading: boolean;
  data?: HealthView;
  error: ApiError | null;
}

/**
 * Hien thi trang thai goi health endpoint. Component chi nhan props da dinh
 * hinh va render, khong goi API hay chuyen doi du lieu.
 */
export function HealthStatusCard({ isLoading, data, error }: HealthStatusCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ket noi backend</CardTitle>
        <CardDescription>GET /v1/health qua HTTP client</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" aria-hidden />
            <span>Dang kiem tra ket noi...</span>
          </div>
        ) : error ? (
          <ErrorState error={error} />
        ) : data ? (
          <div className="flex items-center gap-2 text-sm">
            {data.isHealthy ? (
              <Badge variant="success">
                <CheckCircle2 className="size-3.5" aria-hidden />
                Khoe manh
              </Badge>
            ) : (
              <Badge variant="muted">{data.statusLabel}</Badge>
            )}
            <span className="text-muted-foreground">Trang thai: {data.statusLabel}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ErrorState({ error }: { error: ApiError }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Badge variant="destructive">
        <AlertTriangle className="size-3.5" aria-hidden />
        Loi ket noi
      </Badge>
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
