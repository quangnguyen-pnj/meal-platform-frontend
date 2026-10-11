import {
  Ban,
  CircleCheck,
  CircleDot,
  Clock,
  FileText,
  Lock,
  TimerOff,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { StatusIcon, StatusLabel, StatusTone } from "@/mappers/meal-session";

const ICONS: Record<StatusIcon, LucideIcon> = {
  draft: FileText,
  published: CircleCheck,
  open: CircleDot,
  closed: Lock,
  cancelled: Ban,
  "before-open": Clock,
  "cutoff-passed": TimerOff,
};

const TONE_TO_VARIANT: Record<StatusTone, "default" | "success" | "destructive" | "muted"> = {
  default: "default",
  success: "success",
  destructive: "destructive",
  muted: "muted",
};

/**
 * Hien thi trang thai session hoac cua so dang ky bang text + icon (khong chi
 * dua vao mau), dap ung yeu cau moi status deu co nhan chu ro rang.
 */
export function SessionStatusBadge({ label }: { label: StatusLabel }) {
  const Icon = ICONS[label.icon];
  return (
    <Badge variant={TONE_TO_VARIANT[label.tone]}>
      <Icon className="size-3.5" aria-hidden />
      {label.text}
    </Badge>
  );
}
