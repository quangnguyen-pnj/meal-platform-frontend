"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginForm } from "@/hooks/useLoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { principal, isReady } = useAuth();
  const form = useLoginForm("/dashboard");

  useEffect(() => {
    if (isReady && principal) {
      router.replace("/dashboard");
    }
  }, [isReady, principal, router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <LoginForm
        email={form.email}
        password={form.password}
        error={form.error}
        isSubmitting={form.isSubmitting}
        onEmailChange={form.setEmail}
        onPasswordChange={form.setPassword}
        onSubmit={form.onSubmit}
      />
    </main>
  );
}
