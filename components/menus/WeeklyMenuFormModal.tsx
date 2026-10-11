import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import type { ApiError } from "@/lib/api-error";

interface WeeklyMenuFormModalProps {
  open: boolean;
  weekStartDate: string;
  error: ApiError | null;
  isSubmitting: boolean;
  onWeekStartDateChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Modal tao menu tuan moi. Thuan trinh bay. */
export function WeeklyMenuFormModal({
  open,
  weekStartDate,
  error,
  isSubmitting,
  onWeekStartDateChange,
  onClose,
  onSubmit,
}: WeeklyMenuFormModalProps) {
  return (
    <Modal open={open} title="Tao menu tuan" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="menu-week-date">Ngay trong tuan</Label>
          <Input
            id="menu-week-date"
            type="date"
            required
            value={weekStartDate}
            onChange={(event) => onWeekStartDateChange(event.target.value)}
          />
          <p className="text-muted-foreground text-xs">
            Chon bat ky ngay nao trong tuan; he thong tu dong lay Thu Hai dau tuan.
          </p>
        </div>

        {error ? <ApiErrorNotice error={error} context="tao menu tuan" /> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Tao
          </Button>
        </div>
      </form>
    </Modal>
  );
}
