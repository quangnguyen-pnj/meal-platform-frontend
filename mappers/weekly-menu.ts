import type { MealType, MenuItemDto, WeeklyMenuDto, WeeklyMenuStatus } from "@/types/api";

/** Nhan tieng Viet cho tung bua. */
export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  LUNCH: "Trua",
  DINNER: "Toi",
};

export const MEAL_TYPES: MealType[] = ["LUNCH", "DINNER"];

/** Dinh danh icon (ten Lucide) + nhan cho trang thai menu. Component map sang component icon. */
export interface MenuStatusPresentation {
  label: string;
  icon: "pencil" | "check-circle" | "archive";
}

const STATUS_PRESENTATION: Record<WeeklyMenuStatus, MenuStatusPresentation> = {
  DRAFT: { label: "Ban nhap", icon: "pencil" },
  PUBLISHED: { label: "Da phat hanh", icon: "check-circle" },
  ARCHIVED: { label: "Da luu tru", icon: "archive" },
};

export function menuStatusPresentation(status: WeeklyMenuStatus): MenuStatusPresentation {
  return STATUS_PRESENTATION[status];
}

/** Mot muc mon trong grid, da gan ten mon de hien thi. */
export interface MenuItemView {
  id: string;
  serviceDate: string;
  mealType: MealType;
  dishId: string;
  dishName: string;
  sortOrder: number;
}

/** Mot o trong grid: cac muc mon cua mot ngay + mot bua, da sap theo sortOrder. */
export interface MenuCell {
  serviceDate: string;
  mealType: MealType;
  items: MenuItemView[];
}

/** Mot ngay trong tuan voi cac o theo bua. */
export interface MenuDayRow {
  serviceDate: string;
  /** Nhan ngay tieng Viet, vd "Thu 2, 06/01". */
  dateLabel: string;
  cells: MenuCell[];
}

export interface WeeklyMenuView {
  id: string;
  factoryId: string;
  weekStartDate: string;
  status: WeeklyMenuStatus;
  statusLabel: string;
  statusIcon: MenuStatusPresentation["icon"];
  /** Chi sua duoc muc mon khi menu con la ban nhap. */
  isEditable: boolean;
  publishedAt: string | null;
  itemCount: number;
  /** 7 ngay cua tuan voi cac o mon theo bua. */
  days: MenuDayRow[];
}

const WEEKDAY_LABELS = ["CN", "Thu 2", "Thu 3", "Thu 4", "Thu 5", "Thu 6", "Thu 7"];

/** Doc YYYY-MM-DD thanh Date local, tranh lech mui gio khi dung new Date(string). */
function parseDate(value: string): Date {
  const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Nhan ngay vd "Thu 2, 06/01". */
function toDateLabel(date: Date): string {
  const weekday = WEEKDAY_LABELS[date.getDay()];
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${weekday}, ${day}/${month}`;
}

/** Danh sach 7 ngay YYYY-MM-DD bat dau tu weekStartDate (Thu Hai). */
export function weekDates(weekStartDate: string): string[] {
  const start = parseDate(weekStartDate);
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    return toIsoDate(date);
  });
}

function toItemView(dto: MenuItemDto, dishNameById: Map<string, string>): MenuItemView {
  return {
    id: dto.id,
    serviceDate: dto.serviceDate,
    mealType: dto.mealType,
    dishId: dto.dishId,
    dishName: dishNameById.get(dto.dishId) ?? dto.dishId,
    sortOrder: dto.sortOrder,
  };
}

/**
 * Dinh hinh menu DTO thanh grid 7 ngay x 2 bua. `dishNameById` map id mon sang
 * ten de hien thi; neu thieu thi hien id de khong vo giao dien.
 */
export function toWeeklyMenuView(
  dto: WeeklyMenuDto,
  dishNameById: Map<string, string>,
): WeeklyMenuView {
  const dates = weekDates(dto.weekStartDate);
  const itemsByCell = new Map<string, MenuItemView[]>();
  for (const item of dto.items) {
    const key = `${item.serviceDate}|${item.mealType}`;
    const bucket = itemsByCell.get(key) ?? [];
    bucket.push(toItemView(item, dishNameById));
    itemsByCell.set(key, bucket);
  }
  for (const bucket of itemsByCell.values()) {
    bucket.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const days: MenuDayRow[] = dates.map((serviceDate) => ({
    serviceDate,
    dateLabel: toDateLabel(parseDate(serviceDate)),
    cells: MEAL_TYPES.map((mealType) => ({
      serviceDate,
      mealType,
      items: itemsByCell.get(`${serviceDate}|${mealType}`) ?? [],
    })),
  }));

  const presentation = menuStatusPresentation(dto.status);

  return {
    id: dto.id,
    factoryId: dto.factoryId,
    weekStartDate: dto.weekStartDate,
    status: dto.status,
    statusLabel: presentation.label,
    statusIcon: presentation.icon,
    isEditable: dto.status === "DRAFT",
    publishedAt: dto.publishedAt,
    itemCount: dto.items.length,
    days,
  };
}

/** Nhan gon cho mot menu trong danh sach, vd "Tuan 06/01/2025". */
export function weekRangeLabel(weekStartDate: string): string {
  const start = parseDate(weekStartDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (date: Date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(start)} - ${fmt(end)}/${start.getFullYear()}`;
}
