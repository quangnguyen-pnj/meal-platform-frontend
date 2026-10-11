import { CircleCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BulkCommitSummary } from "@/mappers/bulk-registration";

interface BulkCommitResultCardProps {
  summary: BulkCommitSummary;
}

/**
 * The hien thi ket qua commit thanh cong: ma batch va cac so lieu da ghi. Dumb
 * component.
 */
export function BulkCommitResultCard({ summary }: BulkCommitResultCardProps) {
  return (
    <Card className="border-emerald-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-emerald-700">
          <CircleCheck className="size-4" aria-hidden />
          Da ghi dang ky hang loat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <dt className="text-muted-foreground">Ma batch</dt>
          <dd className="text-right font-mono">{summary.batchId}</dd>
          {summary.paperReference ? (
            <>
              <dt className="text-muted-foreground">Ma phieu giay</dt>
              <dd className="text-right font-medium">{summary.paperReference}</dd>
            </>
          ) : null}
          <dt className="text-muted-foreground">Trang thai</dt>
          <dd className="text-right font-medium">{summary.status}</dd>
          <dt className="text-muted-foreground">So dang ky ghi</dt>
          <dd className="text-right font-medium">{summary.registeredCount}</dd>
          <dt className="text-muted-foreground">Co suat an</dt>
          <dd className="text-right font-medium text-emerald-700">{summary.eatingCount}</dd>
          <dt className="text-muted-foreground">Khong an</dt>
          <dd className="text-right font-medium">{summary.notEatingCount}</dd>
          <dt className="text-muted-foreground">Chua chon</dt>
          <dd className="text-right font-medium">{summary.unselectedCount}</dd>
          <dt className="text-muted-foreground">Nhan vien trong scope</dt>
          <dd className="text-right font-medium">{summary.inScopeEmployeeCount}</dd>
        </dl>
      </CardContent>
    </Card>
  );
}
