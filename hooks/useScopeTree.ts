import { useQuery } from "@tanstack/react-query";

import { getScopeTree } from "@/api/organization";
import type { ApiError } from "@/lib/api-error";
import { toScopeTreeView, type ScopeTreeView } from "@/mappers/scope-tree";

export const scopeTreeQueryKey = ["scope-tree"] as const;

/** Tai cay to chuc da dinh hinh cho man hinh organization. */
export function useScopeTree() {
  return useQuery<ScopeTreeView, ApiError>({
    queryKey: scopeTreeQueryKey,
    queryFn: async ({ signal }) => toScopeTreeView(await getScopeTree(signal)),
  });
}
