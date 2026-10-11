import { useQuery } from "@tanstack/react-query";

import { getSessionSummary } from "@/api/reports";
import type { ApiError } from "@/lib/api-error";
import { toSessionSummaryView, type SessionSummaryView } from "@/mappers/session-summary";

/**
 * Tong hop chi doc cua mot session. Chi chay khi da chon session; du lieu da
 * duoc backend loc theo scope (principal ngoai scope nhan FORBIDDEN).
 */
export function useSessionSummary(sessionId: string | null) {
  return useQuery<SessionSummaryView, ApiError>({
    queryKey: ["session-summary", sessionId],
    queryFn: async ({ signal }) =>
      toSessionSummaryView(await getSessionSummary(sessionId!, signal)),
    enabled: sessionId !== null,
  });
}
