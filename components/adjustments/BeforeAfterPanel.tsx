import { ArrowRight } from "lucide-react";

import { SessionStatusBadge } from "@/components/meal-sessions/SessionStatusBadge";
import type { RegistrationSnapshot } from "@/mappers/registration-adjustment";

interface SnapshotColumnProps {
  title: string;
  snapshot: RegistrationSnapshot;
}

function SnapshotColumn({ title, snapshot }: SnapshotColumnProps) {
  return (
    <div className="flex flex-1 flex-col gap-2 rounded-md border p-4">
      <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{title}</p>
      <SessionStatusBadge label={snapshot.statusLabel} />
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Mon</dt>
        <dd className="font-mono">{snapshot.mealSessionDishId}</dd>
        <dt className="text-muted-foreground">Nguon</dt>
        <dd>{snapshot.sourceLabel}</dd>
        <dt className="text-muted-foreground">Dang ky luc</dt>
        <dd>{snapshot.registeredAtDisplay}</dd>
        <dt className="text-muted-foreground">Huy luc</dt>
        <dd>{snapshot.cancelledAtDisplay}</dd>
      </dl>
    </div>
  );
}

interface BeforeAfterPanelProps {
  before: RegistrationSnapshot | null;
  after: RegistrationSnapshot | null;
}

/**
 * So sanh trang thai dang ky truoc va sau dieu chinh (P2-09). Dumb component:
 * nhan hai snapshot da dinh hinh va render. Khi chua co "truoc" (chua co endpoint
 * doc registration don le), neu ro gioi han thay vi bia du lieu.
 */
export function BeforeAfterPanel({ before, after }: BeforeAfterPanelProps) {
  if (!before && !after) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">Truoc / sau dieu chinh</h2>
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        {before ? (
          <SnapshotColumn title="Truoc" snapshot={before} />
        ) : (
          <div className="flex flex-1 flex-col justify-center rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Chua co trang thai truoc. Backend chua co endpoint doc registration don le, nen trang
            thai truoc chi hien sau khi ban thuc hien them mot dieu chinh trong phien nay.
          </div>
        )}
        <ArrowRight
          className="text-muted-foreground mx-auto size-5 shrink-0 rotate-90 sm:rotate-0"
          aria-hidden
        />
        {after ? (
          <SnapshotColumn title="Sau" snapshot={after} />
        ) : (
          <div className="flex flex-1 flex-col justify-center rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            Thuc hien mot dieu chinh de xem trang thai moi.
          </div>
        )}
      </div>
    </div>
  );
}
