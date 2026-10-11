import type { EmployeeView } from "@/mappers/employee";
import type {
  BulkCommitResultDto,
  BulkRegistrationEntryInput,
  BulkValidationResultDto,
  RegistrationBatchSource,
} from "@/types/api";

/**
 * Mot lua chon mon trong session de ap cho tung dong grid. Khong co endpoint
 * ten mon cho representative (GET /dishes can menu:manage), nen hien thi mon
 * theo so thu tu giong luong "Bua an cua toi".
 */
export interface BulkDishOption {
  /** Id cua MealSessionDish, dung lam gia tri gui len. */
  mealSessionDishId: string;
  dishId: string;
  label: string;
  sortOrder: number;
}

/** Lua chon cua mot dong: chon mon, danh dau khong an, hoac chua chon. */
export type BulkRowSelection =
  { kind: "dish"; mealSessionDishId: string } | { kind: "not-eating" } | { kind: "none" };

/** Trang thai local cua mot dong grid: nhan vien + lua chon hien tai. */
export interface BulkGridRow {
  employee: EmployeeView;
  selection: BulkRowSelection;
}

/** Nhan hien thi mon theo so thu tu trong session. */
export function bulkDishLabel(sortOrder: number): string {
  return `Mon ${sortOrder + 1}`;
}

/** Tra ve danh sach lua chon mon da sap xep tu cac MealSessionDish. */
export function toBulkDishOptions(
  dishes: { id: string; dishId: string; sortOrder: number }[],
): BulkDishOption[] {
  return [...dishes]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((dish) => ({
      mealSessionDishId: dish.id,
      dishId: dish.dishId,
      label: bulkDishLabel(dish.sortOrder),
      sortOrder: dish.sortOrder,
    }));
}

/** Khoi tao grid tu danh sach nhan vien, moi dong bat dau o trang thai chua chon. */
export function initBulkGridRows(employees: EmployeeView[]): BulkGridRow[] {
  return employees.map((employee) => ({ employee, selection: { kind: "none" } }));
}

/**
 * Chuyen cac dong co lua chon (chon mon hoac khong an) thanh entries gui len
 * backend. Dong chua chon (`none`) bi bo qua: backend coi do la unselected.
 *
 * Khi `withRowNumber` bat (luong phieu giay P2-07), moi entry mang rowNumber la
 * so thu tu dong tren phieu (1-based theo thu tu grid) de doi chieu voi phieu
 * giay. Bulk thuong de rowNumber null.
 */
export function rowsToEntries(
  rows: BulkGridRow[],
  options?: { withRowNumber?: boolean },
): BulkRegistrationEntryInput[] {
  const withRowNumber = options?.withRowNumber ?? false;
  const entries: BulkRegistrationEntryInput[] = [];
  rows.forEach((row, index) => {
    const rowNumber = withRowNumber ? index + 1 : undefined;
    if (row.selection.kind === "dish") {
      entries.push({
        employeeId: row.employee.id,
        mealSessionDishId: row.selection.mealSessionDishId,
        ...(rowNumber !== undefined ? { rowNumber } : {}),
      });
    } else if (row.selection.kind === "not-eating") {
      entries.push({
        employeeId: row.employee.id,
        notEating: true,
        ...(rowNumber !== undefined ? { rowNumber } : {}),
      });
    }
  });
  return entries;
}

/** Tong so suat theo tung mon, tinh truc tiep tu grid state (hien thi live). */
export interface LocalDishTotal {
  mealSessionDishId: string;
  label: string;
  count: number;
}

export interface BulkGridDerived {
  dishTotals: LocalDishTotal[];
  eatingCount: number;
  notEatingCount: number;
  /** Nhan vien chua co lua chon nao (chua chon mon va chua danh dau khong an). */
  unselectedCount: number;
  totalEmployees: number;
}

/**
 * Dan xuat totals theo mon, so an / khong an / chua chon tu grid state. Day la
 * nguon su that live cho UI truoc khi goi validate; validate cua backend la
 * nguon xac nhan cuoi cung.
 */
export function deriveBulkGrid(
  rows: BulkGridRow[],
  dishOptions: BulkDishOption[],
): BulkGridDerived {
  const countByDish = new Map<string, number>();
  let eatingCount = 0;
  let notEatingCount = 0;
  let unselectedCount = 0;

  for (const row of rows) {
    if (row.selection.kind === "dish") {
      eatingCount += 1;
      const current = countByDish.get(row.selection.mealSessionDishId) ?? 0;
      countByDish.set(row.selection.mealSessionDishId, current + 1);
    } else if (row.selection.kind === "not-eating") {
      notEatingCount += 1;
    } else {
      unselectedCount += 1;
    }
  }

  const dishTotals: LocalDishTotal[] = dishOptions.map((option) => ({
    mealSessionDishId: option.mealSessionDishId,
    label: option.label,
    count: countByDish.get(option.mealSessionDishId) ?? 0,
  }));

  return {
    dishTotals,
    eatingCount,
    notEatingCount,
    unselectedCount,
    totalEmployees: rows.length,
  };
}

/** Loi theo tung nhan vien tu ket qua validate, de highlight dong tren grid. */
export function validationErrorsByEmployee(
  result: BulkValidationResultDto | null,
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  if (!result) {
    return map;
  }
  for (const entry of result.entries) {
    if (entry.status === "INVALID" && entry.errors.length > 0) {
      map.set(entry.employeeId, entry.errors);
    }
  }
  return map;
}

/** Nhan tom tat ket qua commit de hien thi sau khi ghi thanh cong. */
export interface BulkCommitSummary {
  batchId: string;
  status: string;
  source: RegistrationBatchSource;
  /** Ma tham chieu phieu giay; null voi batch bulk thuong. */
  paperReference: string | null;
  registeredCount: number;
  eatingCount: number;
  notEatingCount: number;
  unselectedCount: number;
  inScopeEmployeeCount: number;
}

export function toBulkCommitSummary(result: BulkCommitResultDto): BulkCommitSummary {
  return {
    batchId: result.batchId,
    status: result.status,
    source: result.source,
    paperReference: result.paperReference,
    registeredCount: result.registrations.length,
    eatingCount: result.eatingCount,
    notEatingCount: result.notEatingCount,
    unselectedCount: result.unselected.length,
    inScopeEmployeeCount: result.inScopeEmployeeCount,
  };
}
