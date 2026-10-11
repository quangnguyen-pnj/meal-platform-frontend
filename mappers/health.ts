import type { HealthResponse } from "@/types/api";

/** View model cho the hien thi trang thai health. */
export interface HealthView {
  isHealthy: boolean;
  statusLabel: string;
}

/** Chuyen DTO health thanh view model cho UI. */
export function toHealthView(dto: HealthResponse): HealthView {
  const isHealthy = dto.status.toLowerCase() === "ok" || dto.status.toLowerCase() === "healthy";
  return {
    isHealthy,
    statusLabel: dto.status,
  };
}
