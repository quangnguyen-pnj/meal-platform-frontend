import { Loader2, LogIn } from "lucide-react";
import type { FormEvent } from "react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiError } from "@/lib/api-error";

interface LoginFormProps {
  email: string;
  password: string;
  error: ApiError | null;
  isSubmitting: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/** Form dang nhap thuan trinh bay: nhan gia tri + handler, render UI. */
export function LoginForm({
  email,
  password,
  error,
  isSubmitting,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Dang nhap</CardTitle>
        <CardDescription>Quan ly suat an nha may</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mat khau</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
            />
          </div>

          {error ? <ApiErrorNotice error={error} context="dang nhap" /> : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <LogIn aria-hidden />
            )}
            Dang nhap
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
