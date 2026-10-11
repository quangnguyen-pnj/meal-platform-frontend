"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type ReactNode } from "react";

import { AuthProvider } from "@/contexts/AuthContext";
import { makeQueryClient } from "@/lib/query-client";

/**
 * Cung cap QueryClient va AuthProvider cho cay App Router.
 *
 * Tao client mot lan trong useState de moi request/render khong tao lai cache.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
