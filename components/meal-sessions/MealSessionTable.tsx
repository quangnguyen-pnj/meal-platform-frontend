import { Ban, CircleDot, Lock, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SessionStatusBadge } from "@/components/meal-sessions/SessionStatusBadge";
import type { MealSessionAction, MealSessionView } from "@/mappers/meal-session";

interface MealSessionTableProps {
  sessions: MealSessionView[];
  canManage: boolean;
  /** Id session dang chay mot lenh lifecycle, de khoa nut tranh double submit. */
  pendingSessionId: string | null;
  onAction: (session: MealSessionView, action: MealSessionAction) => void;
}

const ACTION_LABELS: Record<MealSessionAction, string> = {
  publish: "Cong bo",
  open: "Mo",
  close: "Chot",
  cancel: "Huy",
};

function ActionButton({
  action,
  onClick,
  disabled,
}: {
  action: MealSessionAction;
  onClick: () => void;
  disabled: boolean;
}) {
  const label = ACTION_LABELS[action];
  const variant =
    action === "cancel" ? "destructive" : action === "publish" ? "secondary" : "default";
  return (
    <Button size="sm" variant={variant} onClick={onClick} disabled={disabled}>
      {action === "publish" ? <Send aria-hidden /> : null}
      {action === "open" ? <CircleDot aria-hidden /> : null}
      {action === "close" ? <Lock aria-hidden /> : null}
      {action === "cancel" ? <Ban aria-hidden /> : null}
      {label}
    </Button>
  );
}

/**
 * Bang meal session. Trang thai session va cua so dang ky deu hien bang text +
 * icon. Nut lifecycle chi hien theo availableActions va khi canManage.
 */
export function MealSessionTable({
  sessions,
  canManage,
  pendingSessionId,
  onAction,
}: MealSessionTableProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Khong co session nao cho bo loc hien tai.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Ngay</th>
            <th className="px-4 py-2 font-medium">Bua</th>
            <th className="px-4 py-2 font-medium">Trang thai</th>
            <th className="px-4 py-2 font-medium">Cua so dang ky</th>
            <th className="px-4 py-2 font-medium">Mo luc</th>
            <th className="px-4 py-2 font-medium">Chot luc</th>
            <th className="px-4 py-2 font-medium">So mon</th>
            {canManage ? <th className="px-4 py-2 font-medium">Thao tac</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y">
          {sessions.map((session) => {
            const isPending = pendingSessionId === session.id;
            return (
              <tr key={session.id}>
                <td className="px-4 py-2">{session.serviceDate}</td>
                <td className="px-4 py-2">{session.mealTypeLabel}</td>
                <td className="px-4 py-2">
                  <SessionStatusBadge label={session.statusLabel} />
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <SessionStatusBadge label={session.windowLabel} />
                    {session.windowReason ? (
                      <span className="text-muted-foreground text-xs">{session.windowReason}</span>
                    ) : null}
                  </div>
                </td>
                <td className="text-muted-foreground px-4 py-2 whitespace-nowrap">
                  {session.opensAtDisplay}
                </td>
                <td className="text-muted-foreground px-4 py-2 whitespace-nowrap">
                  {session.cutoffAtDisplay}
                </td>
                <td className="px-4 py-2 tabular-nums">{session.dishCount}</td>
                {canManage ? (
                  <td className="px-4 py-2">
                    {session.availableActions.length === 0 ? (
                      <span className="text-muted-foreground text-xs">-</span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1">
                        {session.availableActions.map((action) => (
                          <ActionButton
                            key={action}
                            action={action}
                            disabled={isPending}
                            onClick={() => onAction(session, action)}
                          />
                        ))}
                      </div>
                    )}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
