import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import type { ApiError } from "@/lib/api-error";
import type { OrgEntity, OrgFormContext } from "@/hooks/useOrganizationForm";

const ENTITY_LABELS: Record<OrgEntity, string> = {
  factory: "Nha may",
  department: "Phong ban",
  team: "To",
};

interface OrganizationFormModalProps {
  context: OrgFormContext | null;
  code: string;
  name: string;
  error: ApiError | null;
  isSubmitting: boolean;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Modal form tao/sua node to chuc. Thuan trinh bay. */
export function OrganizationFormModal({
  context,
  code,
  name,
  error,
  isSubmitting,
  onCodeChange,
  onNameChange,
  onClose,
  onSubmit,
}: OrganizationFormModalProps) {
  const open = context !== null;
  const entityLabel = context ? ENTITY_LABELS[context.entity] : "";
  const isCreate = context?.mode === "create";
  const title = `${isCreate ? "Them" : "Sua"} ${entityLabel.toLowerCase()}`;

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="org-code">Ma</Label>
          <Input
            id="org-code"
            required
            value={code}
            disabled={!isCreate}
            onChange={(event) => onCodeChange(event.target.value)}
          />
          {!isCreate ? (
            <p className="text-muted-foreground text-xs">Ma khong doi sau khi tao.</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="org-name">Ten</Label>
          <Input
            id="org-name"
            required
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </div>

        {error ? <ApiErrorNotice error={error} context="luu thay doi" /> : null}

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
