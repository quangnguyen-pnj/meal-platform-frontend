import { Archive, CheckCircle2, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { MenuStatusPresentation } from "@/mappers/weekly-menu";

interface MenuStatusBadgeProps {
  label: string;
  icon: MenuStatusPresentation["icon"];
}

/** Badge trang thai menu: luon kem text + icon, khong chi dua vao mau. */
export function MenuStatusBadge({ label, icon }: MenuStatusBadgeProps) {
  if (icon === "check-circle") {
    return (
      <Badge variant="success">
        <CheckCircle2 className="size-3.5" aria-hidden />
        {label}
      </Badge>
    );
  }
  if (icon === "archive") {
    return (
      <Badge variant="muted">
        <Archive className="size-3.5" aria-hidden />
        {label}
      </Badge>
    );
  }
  return (
    <Badge variant="default">
      <Pencil className="size-3.5" aria-hidden />
      {label}
    </Badge>
  );
}
