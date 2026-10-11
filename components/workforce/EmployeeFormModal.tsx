import { Loader2 } from "lucide-react";
import type { FormEvent } from "react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import type { ApiError } from "@/lib/api-error";
import type { EmployeeFormState } from "@/hooks/useEmployeeForm";
import type { TeamOption } from "@/mappers/scope-tree";

interface EmployeeFormModalProps {
  open: boolean;
  isEdit: boolean;
  fields: EmployeeFormState;
  teamOptions: TeamOption[];
  error: ApiError | null;
  isSubmitting: boolean;
  onField: <K extends keyof EmployeeFormState>(key: K, value: EmployeeFormState[K]) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/** Modal form tao/sua nhan vien. Thuan trinh bay. */
export function EmployeeFormModal({
  open,
  isEdit,
  fields,
  teamOptions,
  error,
  isSubmitting,
  onField,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  return (
    <Modal open={open} title={isEdit ? "Sua nhan vien" : "Them nhan vien"} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emp-code">Ma nhan vien</Label>
          <Input
            id="emp-code"
            required
            value={fields.employeeCode}
            disabled={isEdit}
            onChange={(event) => onField("employeeCode", event.target.value)}
          />
          {isEdit ? (
            <p className="text-muted-foreground text-xs">Ma nhan vien khong doi sau khi tao.</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emp-name">Ho ten</Label>
          <Input
            id="emp-name"
            required
            value={fields.fullName}
            onChange={(event) => onField("fullName", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emp-email">Email (tuy chon)</Label>
          <Input
            id="emp-email"
            type="email"
            value={fields.email}
            onChange={(event) => onField("email", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="emp-team">To</Label>
          <Select
            id="emp-team"
            required
            value={fields.teamId}
            onChange={(event) => onField("teamId", event.target.value)}
          >
            <option value="" disabled>
              Chon to
            </option>
            {teamOptions.map((option) => (
              <option key={option.teamId} value={option.teamId}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={fields.hasPersonalDevice}
            onChange={(event) => onField("hasPersonalDevice", event.target.checked)}
          />
          Co thiet bi ca nhan
        </label>

        {!isEdit ? (
          <div className="flex flex-col gap-3 rounded-md border p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={fields.withAccount}
                onChange={(event) => onField("withAccount", event.target.checked)}
              />
              Tao tai khoan dang nhap
            </label>
            {fields.withAccount ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="acc-email">Email tai khoan</Label>
                  <Input
                    id="acc-email"
                    type="email"
                    required
                    value={fields.accountEmail}
                    onChange={(event) => onField("accountEmail", event.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="acc-password">Mat khau</Label>
                  <Input
                    id="acc-password"
                    type="password"
                    required
                    value={fields.accountPassword}
                    onChange={(event) => onField("accountPassword", event.target.value)}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {error ? <ApiErrorNotice error={error} context="luu nhan vien" /> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Luu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
