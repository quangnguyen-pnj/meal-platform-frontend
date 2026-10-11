"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/contexts/AuthContext";
import { visibleNavItems } from "@/services/navigation";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { principal, isReady, logout, hasPermission } = useAuth();

  useEffect(() => {
    if (isReady && !principal) {
      router.replace("/login");
    }
  }, [isReady, principal, router]);

  if (!isReady || !principal) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang kiem tra phien dang nhap...</span>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      navItems={visibleNavItems(hasPermission)}
      userLabel={principal.displayName}
      roleNames={principal.roleNames}
      onLogout={() => void logout()}
    >
      {children}
    </AppShell>
  );
}
