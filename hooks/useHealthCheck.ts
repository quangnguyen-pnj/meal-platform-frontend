import { useQuery } from "@tanstack/react-query";

import { getHealth } from "@/api/health";
import type { ApiError } from "@/lib/api-error";
import { toHealthView, type HealthView } from "@/mappers/health";

/**
 * Goi GET /v1/health qua HTTP client va tra ve view model da dinh hinh.
 *
 * Giu toan bo logic query o day thay vi trong page. Loi tra ve la ApiError
 * co cau truc nen UI co the hien thi code, message va requestId.
 */
export function useHealthCheck() {
  return useQuery<HealthView, ApiError>({
    queryKey: ["health"],
    queryFn: async ({ signal }) => {
      const dto = await getHealth(signal);
      return toHealthView(dto);
    },
    retry: false,
  });
}
