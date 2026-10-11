import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

import { commitRegistrationBatch, validateRegistrationBatch } from "@/api/bulk-registrations";
import { commitPaperFormBatch, validatePaperFormBatch } from "@/api/paper-form-registrations";
import { listEmployees } from "@/api/employees";
import { getMealSession } from "@/api/meal-sessions";
import type { ApiError } from "@/lib/api-error";
import {
  deriveBulkGrid,
  initBulkGridRows,
  rowsToEntries,
  toBulkCommitSummary,
  toBulkDishOptions,
  validationErrorsByEmployee,
  type BulkCommitSummary,
  type BulkDishOption,
  type BulkGridDerived,
  type BulkGridRow,
  type BulkRowSelection,
} from "@/mappers/bulk-registration";
import { toEmployeeViews } from "@/mappers/employee";
import type {
  BulkCommitResultDto,
  BulkValidationResultDto,
  RegistrationBatchSource,
} from "@/types/api";

/**
 * Du lieu nen cua grid: nhan vien trong scope cua team va cac mon cua session.
 * Session fetch co the bi 403 voi representative (can meal-session:manage); khi
 * do van cho hien grid nhung bao gioi han va khong co lua chon mon.
 */
interface BulkGridData {
  rows: BulkGridRow[];
  dishOptions: BulkDishOption[];
  /** True khi khong lay duoc mon cua session (vd thieu quyen). */
  dishesUnavailable: boolean;
  dishesError: ApiError | null;
}

async function loadBulkGridData(
  teamId: string,
  mealSessionId: string,
  signal: AbortSignal | undefined,
): Promise<BulkGridData> {
  const employees = toEmployeeViews(await listEmployees(teamId, signal));
  const rows = initBulkGridRows(employees);

  try {
    const session = await getMealSession(mealSessionId, signal);
    return {
      rows,
      dishOptions: toBulkDishOptions(session.dishes),
      dishesUnavailable: false,
      dishesError: null,
    };
  } catch (cause) {
    // Representative co the khong co quyen xem chi tiet session. Giu grid dung
    // duoc: bao gioi han, chi khoa viec chon mon cho den khi co quyen.
    return {
      rows,
      dishOptions: [],
      dishesUnavailable: true,
      dishesError: cause as ApiError,
    };
  }
}

export interface BulkRegistrationOptions {
  teamId: string | null;
  mealSessionId: string | null;
  /** Nguon batch; mac dinh BULK. P2-07 truyen PAPER_FORM de tai su dung hook. */
  source?: RegistrationBatchSource;
  /** Ma tham chieu phieu giay (P2-07); bulk thuong de null. */
  paperReference?: string | null;
}

export interface UseBulkRegistration {
  isReady: boolean;
  gridQuery: {
    isLoading: boolean;
    error: ApiError | null;
  };
  rows: BulkGridRow[];
  dishOptions: BulkDishOption[];
  dishesUnavailable: boolean;
  dishesError: ApiError | null;
  derived: BulkGridDerived;
  errorsByEmployee: Map<string, string[]>;
  /** Dat lua chon cho mot nhan vien. */
  setRowSelection: (employeeId: string, selection: BulkRowSelection) => void;
  /** Ap mot mon cho tat ca nhan vien trong grid. */
  applyDishToAll: (mealSessionDishId: string) => void;
  /** Danh dau tat ca nhan vien la khong an. */
  markAllNotEating: () => void;
  /** Xoa moi lua chon, dua grid ve chua chon. */
  clearAll: () => void;
  validate: {
    run: () => void;
    isPending: boolean;
    result: BulkValidationResultDto | null;
    error: ApiError | null;
  };
  commit: {
    run: () => void;
    isPending: boolean;
    summary: BulkCommitSummary | null;
    error: ApiError | null;
  };
  /** True khi con nhan vien chua chon va can confirm truoc khi commit. */
  requiresUnselectedConfirmation: boolean;
  /**
   * True khi la luong phieu giay nhung ma tham chieu con rong; page phai chan
   * submit (khop rang buoc backend: paperReference bat buoc).
   */
  paperReferenceMissing: boolean;
}

/**
 * Hook dieu phoi luong nhap dang ky hang loat cho mot team + session: tai nhan
 * vien va mon, giu grid state, cung cap bulk-apply, dan xuat totals/unselected,
 * va goi validate/commit. Logic nghiep vu nam o day, component chi render.
 *
 * Tham so hoa theo `source`/`paperReference` de P2-07 (paper-form) tai su dung
 * cung grid + validate/commit thay vi fork.
 */
export function useBulkRegistration(options: BulkRegistrationOptions): UseBulkRegistration {
  const { teamId, mealSessionId, source = "BULK", paperReference = null } = options;
  const isReady = teamId !== null && mealSessionId !== null;
  const isPaperForm = source === "PAPER_FORM";
  const trimmedPaperReference = (paperReference ?? "").trim();
  // Phieu giay bat buoc co ma tham chieu khong rong (khop rang buoc backend).
  const paperReferenceMissing = isPaperForm && trimmedPaperReference.length === 0;

  const [rows, setRows] = useState<BulkGridRow[]>([]);
  const [validationResult, setValidationResult] = useState<BulkValidationResultDto | null>(null);
  const [commitSummary, setCommitSummary] = useState<BulkCommitSummary | null>(null);
  const [dishOptions, setDishOptions] = useState<BulkDishOption[]>([]);
  const [dishesUnavailable, setDishesUnavailable] = useState(false);
  const [dishesError, setDishesError] = useState<ApiError | null>(null);

  const gridQuery = useQuery<BulkGridData, ApiError>({
    queryKey: ["bulk-registration", teamId, mealSessionId],
    queryFn: async ({ signal }) => {
      const data = await loadBulkGridData(teamId!, mealSessionId!, signal);
      // Khoi tao state local tu du lieu vua tai; moi lan tai lai reset grid.
      setRows(data.rows);
      setDishOptions(data.dishOptions);
      setDishesUnavailable(data.dishesUnavailable);
      setDishesError(data.dishesError);
      setValidationResult(null);
      setCommitSummary(null);
      return data;
    },
    enabled: isReady,
  });

  const setRowSelection = useCallback((employeeId: string, selection: BulkRowSelection) => {
    setValidationResult(null);
    setRows((prev) =>
      prev.map((row) => (row.employee.id === employeeId ? { ...row, selection } : row)),
    );
  }, []);

  const applyDishToAll = useCallback((mealSessionDishId: string) => {
    setValidationResult(null);
    setRows((prev) =>
      prev.map((row) => ({ ...row, selection: { kind: "dish", mealSessionDishId } })),
    );
  }, []);

  const markAllNotEating = useCallback(() => {
    setValidationResult(null);
    setRows((prev) => prev.map((row) => ({ ...row, selection: { kind: "not-eating" } })));
  }, []);

  const clearAll = useCallback(() => {
    setValidationResult(null);
    setRows((prev) => prev.map((row) => ({ ...row, selection: { kind: "none" } })));
  }, []);

  const derived = useMemo(() => deriveBulkGrid(rows, dishOptions), [rows, dishOptions]);
  const errorsByEmployee = useMemo(
    () => validationErrorsByEmployee(validationResult),
    [validationResult],
  );

  const validateMutation = useMutation<BulkValidationResultDto, ApiError, void>({
    mutationFn: () => {
      const entries = rowsToEntries(rows, { withRowNumber: isPaperForm });
      if (isPaperForm) {
        return validatePaperFormBatch({
          mealSessionId: mealSessionId!,
          paperReference: trimmedPaperReference,
          entries,
        });
      }
      return validateRegistrationBatch({ mealSessionId: mealSessionId!, entries });
    },
    onSuccess: (result) => setValidationResult(result),
  });

  const commitMutation = useMutation<BulkCommitResultDto, ApiError, void>({
    mutationFn: () => {
      const entries = rowsToEntries(rows, { withRowNumber: isPaperForm });
      if (isPaperForm) {
        return commitPaperFormBatch({
          mealSessionId: mealSessionId!,
          paperReference: trimmedPaperReference,
          entries,
        });
      }
      return commitRegistrationBatch({ mealSessionId: mealSessionId!, entries, source });
    },
    onSuccess: (result) => setCommitSummary(toBulkCommitSummary(result)),
  });

  return {
    isReady,
    gridQuery: {
      isLoading: gridQuery.isLoading,
      error: (gridQuery.error as ApiError | null) ?? null,
    },
    rows,
    dishOptions,
    dishesUnavailable,
    dishesError,
    derived,
    errorsByEmployee,
    setRowSelection,
    applyDishToAll,
    markAllNotEating,
    clearAll,
    validate: {
      run: () => validateMutation.mutate(),
      isPending: validateMutation.isPending,
      result: validationResult,
      error: (validateMutation.error as ApiError | null) ?? null,
    },
    commit: {
      run: () => commitMutation.mutate(),
      isPending: commitMutation.isPending,
      summary: commitSummary,
      error: (commitMutation.error as ApiError | null) ?? null,
    },
    requiresUnselectedConfirmation: derived.unselectedCount > 0,
    paperReferenceMissing,
  };
}
