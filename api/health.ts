import { httpClient } from "@/lib/http-client";
import type { HealthResponse } from "@/types/api";

/** Wrapper mong cho GET /v1/health. */
export function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return httpClient.get<HealthResponse>("/health", { signal });
}
