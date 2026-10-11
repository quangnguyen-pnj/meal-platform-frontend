import { httpClient } from "@/lib/http-client";
import type { SessionSummaryDto } from "@/types/api";

/**
 * GET /reports/meal-sessions/:id/summary : tong hop chi doc cua mot session.
 * Backend luon loc theo scope, nen principal ngoai scope cua nha may se nhan
 * loi FORBIDDEN.
 */
export function getSessionSummary(
  sessionId: string,
  signal?: AbortSignal,
): Promise<SessionSummaryDto> {
  return httpClient.get<SessionSummaryDto>(`/reports/meal-sessions/${sessionId}/summary`, {
    signal,
  });
}
