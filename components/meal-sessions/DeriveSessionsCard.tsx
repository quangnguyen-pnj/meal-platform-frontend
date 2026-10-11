import { type FormEvent } from "react";
import { CalendarPlus } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ApiError } from "@/lib/api-error";
import type { DeriveSessionsFormState } from "@/hooks/useDeriveSessionsForm";

interface DeriveSessionsCardProps {
  fields: DeriveSessionsFormState;
  error: ApiError | null;
  isSubmitting: boolean;
  onField: <K extends keyof DeriveSessionsFormState>(
    key: K,
    value: DeriveSessionsFormState[K],
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/**
 * Tao session DRAFT tu mot weekly menu da PUBLISHED. Nhap weekly menu id (man
 * hinh menu thuoc P1-04) cung thoi gian mo/chot theo gio HCM.
 */
export function DeriveSessionsCard({
  fields,
  error,
  isSubmitting,
  onField,
  onSubmit,
}: DeriveSessionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tao session tu thuc don tuan</CardTitle>
        <CardDescription>
          Dan xuat session nhap tu mot weekly menu da cong bo. Thoi gian nhap theo gio Ho Chi Minh.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="weekly-menu-id">Weekly menu id</Label>
            <Input
              id="weekly-menu-id"
              value={fields.weeklyMenuId}
              onChange={(event) => onField("weeklyMenuId", event.target.value)}
              placeholder="Nhap id thuc don tuan da cong bo"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="opens-at">Mo luc (gio HCM)</Label>
              <Input
                id="opens-at"
                type="datetime-local"
                value={fields.opensAt}
                onChange={(event) => onField("opensAt", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cutoff-at">Chot luc (gio HCM)</Label>
              <Input
                id="cutoff-at"
                type="datetime-local"
                value={fields.cutoffAt}
                onChange={(event) => onField("cutoffAt", event.target.value)}
              />
            </div>
          </div>
          {error ? <ApiErrorNotice error={error} context="tao session" /> : null}
          <div>
            <Button type="submit" disabled={isSubmitting}>
              <CalendarPlus aria-hidden />
              {isSubmitting ? "Dang tao..." : "Tao session"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
