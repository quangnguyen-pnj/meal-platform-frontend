import { AlertTriangle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface ConfirmSubmitDialogProps {
  open: boolean;
  /** So nhan vien chua chon se khong co suat an. */
  unselectedCount: number;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * Hop thoai bat buoc xac nhan truoc khi submit khi con nhan vien chua chon.
 * Neu ro co bao nhieu nguoi co the khong co suat an (quy tac cung cua ke
 * hoach). Dumb component: chi hien thi va goi handler.
 */
export function ConfirmSubmitDialog({
  open,
  unselectedCount,
  isSubmitting,
  onConfirm,
  onClose,
}: ConfirmSubmitDialogProps) {
  return (
    <Modal open={open} title="Xac nhan truoc khi gui" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p>
            Con <span className="font-semibold">{unselectedCount}</span> nhan vien chua chon mon.
            Nhung nguoi nay se <span className="font-semibold">khong co suat an</span> cho bua nay.
            Ban co chac muon gui khong?
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onClose}>
            Quay lai
          </Button>
          <Button type="button" disabled={isSubmitting} onClick={onConfirm}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Van gui
          </Button>
        </div>
      </div>
    </Modal>
  );
}
