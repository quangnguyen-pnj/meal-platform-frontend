import { SessionStatusBadge } from "@/components/meal-sessions/SessionStatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReserveAllocationRowView } from "@/mappers/reserve";

interface ReserveAllocationListProps {
  allocations: ReserveAllocationRowView[];
}

/**
 * Danh sach cac suat du phong da cap trong phien lam viec. Trinh bay tach biet
 * voi dang ky thuong, nhan ro moi dong la mot khoan cap du phong kem ly do.
 */
export function ReserveAllocationList({ allocations }: ReserveAllocationListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suat du phong da cap</CardTitle>
        <CardDescription>
          Day la cac khoan cap du phong, doc lap voi dang ky bua an thuong.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {allocations.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Chua cap suat du phong nao trong phien nay.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {allocations.map((allocation) => (
              <li key={allocation.id} className="flex flex-col gap-1 rounded-md border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{allocation.dishLabel}</span>
                  <SessionStatusBadge label={allocation.statusLabel} />
                </div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                  <dt className="text-muted-foreground">So luong</dt>
                  <dd className="font-mono">{allocation.quantity}</dd>
                  <dt className="text-muted-foreground">Nguoi nhan</dt>
                  <dd>{allocation.employeeId ?? "Khong gan nhan vien"}</dd>
                  <dt className="text-muted-foreground">Ly do</dt>
                  <dd>{allocation.reason ?? "-"}</dd>
                  <dt className="text-muted-foreground">Thoi diem</dt>
                  <dd>{allocation.allocatedAtDisplay}</dd>
                </dl>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
