"use client";

import { HealthStatusCard } from "@/components/HealthStatusCard";
import { useAuth } from "@/contexts/AuthContext";
import { useHealthCheck } from "@/hooks/useHealthCheck";

export default function DashboardPage() {
  const { principal } = useAuth();
  const { data, error, isLoading } = useHealthCheck();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Tong quan</h1>
        <p className="text-muted-foreground">
          Xin chao {principal?.displayName ?? ""}. Day la trang tong quan cua he thong.
        </p>
      </header>

      <HealthStatusCard isLoading={isLoading} data={data} error={error} />
    </div>
  );
}
