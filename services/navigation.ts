import { PERMISSIONS, type PermissionCode } from "@/mappers/principal";

export interface NavItem {
  href: string;
  label: string;
  /** Permission can co de thay muc nay; undefined nghia la luon hien. */
  requiredPermission?: PermissionCode;
}

/**
 * Dinh nghia nav cua shell bao ve. Loc theo permission o service nay, component
 * chi render danh sach da loc.
 */
const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tong quan" },
  {
    href: "/organization",
    label: "So do to chuc",
    requiredPermission: PERMISSIONS.organizationManage,
  },
  {
    href: "/workforce/employees",
    label: "Nhan vien",
    requiredPermission: PERMISSIONS.employeeRead,
  },
  {
    href: "/workforce/imports",
    label: "Nhap nhan vien",
    requiredPermission: PERMISSIONS.employeeImport,
  },
  {
    href: "/dishes",
    label: "Mon an",
    requiredPermission: PERMISSIONS.menuManage,
  },
  {
    href: "/menus",
    label: "Menu tuan",
    requiredPermission: PERMISSIONS.menuManage,
  },
  {
    href: "/meal-sessions",
    label: "Session bua an",
    requiredPermission: PERMISSIONS.mealSessionManage,
  },
  {
    href: "/my-meals",
    label: "Bua an cua toi",
    requiredPermission: PERMISSIONS.registrationSelf,
  },
  {
    href: "/reports",
    label: "Tong hop",
    requiredPermission: PERMISSIONS.reportRead,
  },
  // BULK ENTRY SECTION (P2-05), append-only.
  {
    href: "/registrations",
    label: "Nhap hang loat",
    requiredPermission: PERMISSIONS.registrationBulk,
  },
  // PAPER FORM SECTION (P2-07), append-only.
  {
    href: "/registrations/paper-form",
    label: "Nhap phieu giay",
    requiredPermission: PERMISSIONS.registrationBulk,
  },
  // ADJUSTMENT SECTION (P2-09), append-only.
  {
    href: "/adjustments",
    label: "Dieu chinh dang ky",
    requiredPermission: PERMISSIONS.registrationAdjust,
  },
  // RESERVE SECTION (P2-11), append-only.
  {
    href: "/reserve-pools",
    label: "Suat du phong",
    requiredPermission: PERMISSIONS.reserveManage,
  },
];

/** Loc nav theo quyen cua principal. */
export function visibleNavItems(hasPermission: (permission: PermissionCode) => boolean): NavItem[] {
  return NAV_ITEMS.filter(
    (item) => item.requiredPermission === undefined || hasPermission(item.requiredPermission),
  );
}
