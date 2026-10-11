import { QueryClient } from "@tanstack/react-query";

/** Tao QueryClient voi default dung chung cho toan app. */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}
