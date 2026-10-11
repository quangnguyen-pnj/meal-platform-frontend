import type {
  MealSessionDto,
  MealSessionStatus,
  MealType,
  RegistrationWindowState,
} from "@/types/api";

const HCM_TIME_ZONE = "Asia/Ho_Chi_Minh";

/**
 * Dinh danh icon (khong phai component React) de mapper khong phu thuoc UI.
 * Component tra icon tuong ung tu Lucide dua tren gia tri nay.
 */
export type StatusIcon =
  "draft" | "published" | "open" | "closed" | "cancelled" | "before-open" | "cutoff-passed";

export type StatusTone = "default" | "success" | "destructive" | "muted";

/** Lenh lifecycle co the goi tren mot session. */
export type MealSessionAction = "publish" | "open" | "close" | "cancel";

/** Nhan hien thi kem icon + tone, dung chung cho status va window state. */
export interface StatusLabel {
  text: string;
  icon: StatusIcon;
  tone: StatusTone;
}

export interface MealSessionDishView {
  id: string;
  dishId: string;
  sortOrder: number;
}

/** View model cho mot dong session trong danh sach. */
export interface MealSessionView {
  id: string;
  factoryId: string;
  weeklyMenuId: string | null;
  serviceDate: string;
  mealTypeLabel: string;
  status: MealSessionStatus;
  statusLabel: StatusLabel;
  windowLabel: StatusLabel;
  windowReason: string;
  /** Thoi gian mo/chot da format theo gio HCM de hien thi. */
  opensAtDisplay: string;
  cutoffAtDisplay: string;
  dishCount: number;
  dishes: MealSessionDishView[];
  /** Lenh lifecycle hop le voi trang thai hien tai. */
  availableActions: MealSessionAction[];
}

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: HCM_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: HCM_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Format mot instant ISO theo gio HCM; tra "-" neu khong parse duoc. */
export function formatHcmInstant(iso: string | null): string {
  if (!iso) {
    return "-";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return dateTimeFormatter.format(date);
}

/** Format mot ngay vận hành YYYY-MM-DD theo lich HCM. */
export function formatServiceDate(serviceDate: string): string {
  // serviceDate la ngay lich HCM; cong gio tru 00:00 UTC roi format o HCM se
  // lech ngay, nen parse thanh phan ngay truc tiep.
  const match = serviceDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return serviceDate;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  if (Number.isNaN(date.getTime())) {
    return serviceDate;
  }
  return dateFormatter.format(date);
}

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  LUNCH: "Bua trua",
  DINNER: "Bua toi",
};

const STATUS_LABELS: Record<MealSessionStatus, StatusLabel> = {
  DRAFT: { text: "Nhap", icon: "draft", tone: "muted" },
  PUBLISHED: { text: "Da cong bo", icon: "published", tone: "default" },
  OPEN: { text: "Dang mo", icon: "open", tone: "success" },
  CLOSED: { text: "Da chot", icon: "closed", tone: "muted" },
  CANCELLED: { text: "Da huy", icon: "cancelled", tone: "destructive" },
};

/** Nhan tieng Viet cho loai bua, dung chung cho session va report. */
export function mealTypeLabel(mealType: MealType): string {
  return MEAL_TYPE_LABELS[mealType];
}

/** Nhan status (text + icon + tone) cho mot session, dung chung voi report. */
export function statusLabelFor(status: MealSessionStatus): StatusLabel {
  return STATUS_LABELS[status];
}

const WINDOW_LABELS: Record<RegistrationWindowState, StatusLabel> = {
  OPEN: { text: "Dang mo dang ky", icon: "open", tone: "success" },
  BEFORE_OPEN: { text: "Chua mo", icon: "before-open", tone: "muted" },
  CUTOFF_PASSED: { text: "Qua gio chot", icon: "cutoff-passed", tone: "destructive" },
  CLOSED: { text: "Da chot", icon: "closed", tone: "muted" },
  CANCELLED: { text: "Da huy", icon: "cancelled", tone: "destructive" },
};

/** Nhan (text + icon + tone) cho trang thai cua so dang ky, dung chung. */
export function windowLabelFor(state: RegistrationWindowState): StatusLabel {
  return WINDOW_LABELS[state];
}

/**
 * Lenh lifecycle hop le theo trang thai. Chuyen trang thai:
 * DRAFT -> PUBLISHED -> OPEN -> CLOSED; cancel tu moi trang thai chua ket thuc.
 */
function actionsForStatus(status: MealSessionStatus): MealSessionAction[] {
  switch (status) {
    case "DRAFT":
      return ["publish", "cancel"];
    case "PUBLISHED":
      return ["open", "cancel"];
    case "OPEN":
      return ["close", "cancel"];
    case "CLOSED":
    case "CANCELLED":
      return [];
  }
}

export function toMealSessionView(dto: MealSessionDto): MealSessionView {
  return {
    id: dto.id,
    factoryId: dto.factoryId,
    weeklyMenuId: dto.weeklyMenuId,
    serviceDate: formatServiceDate(dto.serviceDate),
    mealTypeLabel: MEAL_TYPE_LABELS[dto.mealType],
    status: dto.status,
    statusLabel: STATUS_LABELS[dto.status],
    windowLabel: WINDOW_LABELS[dto.registrationWindow.state],
    windowReason: dto.registrationWindow.reason,
    opensAtDisplay: formatHcmInstant(dto.opensAt),
    cutoffAtDisplay: formatHcmInstant(dto.cutoffAt),
    dishCount: dto.dishes.length,
    dishes: dto.dishes.map((dish) => ({
      id: dish.id,
      dishId: dish.dishId,
      sortOrder: dish.sortOrder,
    })),
    availableActions: actionsForStatus(dto.status),
  };
}

export function toMealSessionViews(dtos: MealSessionDto[]): MealSessionView[] {
  return dtos.map(toMealSessionView);
}
