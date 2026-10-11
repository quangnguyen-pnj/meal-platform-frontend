import { Clock, User } from "lucide-react";

import { SessionStatusBadge } from "@/components/meal-sessions/SessionStatusBadge";
import type { AdjustmentHistoryEntry } from "@/mappers/registration-adjustment";

interface AdjustmentHistoryListProps {
  entries: AdjustmentHistoryEntry[];
}

/**
 * Lich su cac dieu chinh (P2-09). Dumb component: render danh sach da dinh hinh.
 * Backend ghi RegistrationChange nhung chua co endpoint doc lich su, nen o day
 * ta hien lich su cac dieu chinh thanh cong trong phien lam viec nay; moi muc co
 * reason, nguoi thuc hien, thoi diem va chuyen trang thai truoc -> sau. Lich su
 * day du can backend bo sung endpoint doc.
 */
export function AdjustmentHistoryList({ entries }: AdjustmentHistoryListProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-medium">Lich su dieu chinh</h2>
        <p className="text-muted-foreground text-xs">
          Hien cac dieu chinh ban vua thuc hien trong phien nay. Lich su day du theo thoi gian can
          backend bo sung endpoint doc RegistrationChange.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground rounded-md border border-dashed p-4 text-sm">
          Chua co dieu chinh nao trong phien nay.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry, index) => (
            <li
              key={`${entry.after.id}-${index}`}
              className="flex flex-col gap-2 rounded-md border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">{entry.kindLabel}</span>
                <span className="text-muted-foreground font-mono text-xs">{entry.after.id}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <SessionStatusBadge label={entry.before.statusLabel} />
                <span className="text-muted-foreground text-xs">-&gt;</span>
                <SessionStatusBadge label={entry.after.statusLabel} />
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Ly do: </span>
                {entry.reason}
              </p>
              <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" aria-hidden />
                  {entry.actorName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" aria-hidden />
                  {entry.performedAtDisplay}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
