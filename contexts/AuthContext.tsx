"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getMe, login as loginRequest, logout as logoutRequest } from "@/api/auth";
import type { ApiError } from "@/lib/api-error";
import {
  clearTokens,
  getRefreshToken,
  getTokens,
  setTokens,
  subscribe,
} from "@/services/auth-session";
import {
  principalHasPermission,
  toPrincipalView,
  type PermissionCode,
  type PrincipalView,
} from "@/mappers/principal";
import type { LoginRequest } from "@/types/api";

interface AuthContextValue {
  /** Principal da dang nhap, hoac null khi chua co phien. */
  principal: PrincipalView | null;
  /** Dang tai /auth/me (chi khi co token). */
  isLoading: boolean;
  /** Da hoan tat lan kiem tra phien dau tien. */
  isReady: boolean;
  error: ApiError | null;
  login: (input: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: PermissionCode) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // Bat dau false de khop server render; subscribe se dong bo gia tri that sau
  // mount (bao gom token da hydrate tu localStorage), tranh lech hydration.
  const [hasToken, setHasToken] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    return subscribe(() => {
      setHasToken(getTokens() !== null);
      setHydrated(true);
    });
  }, []);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async ({ signal }) => toPrincipalView(await getMe(signal)),
    enabled: hasToken,
    retry: false,
    staleTime: Infinity,
  });

  const login = useCallback(
    async (input: LoginRequest) => {
      const tokens = await loginRequest(input);
      setTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await logoutRequest(refreshToken);
      } catch {
        // Logout backend that bai van xoa phien local; token se het han.
      }
    }
    clearTokens();
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
    queryClient.clear();
  }, [queryClient]);

  const principal = hasToken ? (meQuery.data ?? null) : null;

  const hasPermission = useCallback(
    (permission: PermissionCode) => principalHasPermission(principal, permission),
    [principal],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      principal,
      isLoading: hasToken && meQuery.isLoading,
      isReady: hydrated && (!hasToken || meQuery.isFetched),
      error: (meQuery.error as ApiError | null) ?? null,
      login,
      logout,
      hasPermission,
    }),
    [
      principal,
      hasToken,
      hydrated,
      meQuery.isLoading,
      meQuery.isFetched,
      meQuery.error,
      login,
      logout,
      hasPermission,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phai duoc dung ben trong AuthProvider");
  }
  return context;
}
