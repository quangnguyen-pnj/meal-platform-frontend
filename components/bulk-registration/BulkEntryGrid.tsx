import { BulkActionsBar } from "@/components/bulk-registration/BulkActionsBar";
import { BulkEntryRow } from "@/components/bulk-registration/BulkEntryRow";
import type { BulkDishOption, BulkGridRow, BulkRowSelection } from "@/mappers/bulk-registration";

interface BulkEntryGridProps {
  rows: BulkGridRow[];
  dishOptions: BulkDishOption[];
  /** Khoa toan bo grid khi dang validate/commit. */
  disabled: boolean;
  errorsByEmployee: Map<string, string[]>;
  onSelectionChange: (employeeId: string, selection: BulkRowSelection) => void;
  onApplyDishToAll: (mealSessionDishId: string) => void;
  onMarkAllNotEating: () => void;
  onClearAll: () => void;
}

/**
 * Luoi nhap dang ky cho mot team: thanh thao tac hang loat + bang nhan vien.
 * Dumb component gom cac dong va bulk actions; P2-07 (paper-form) tai su dung
 * grid nay cung cac handler tu hook.
 */
export function BulkEntryGrid({
  rows,
  dishOptions,
  disabled,
  errorsByEmployee,
  onSelectionChange,
  onApplyDishToAll,
  onMarkAllNotEating,
  onClearAll,
}: BulkEntryGridProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">
          Khong co nhan vien nao trong team nay de nhap dang ky.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BulkActionsBar
        dishOptions={dishOptions}
        disabled={disabled}
        onApplyDishToAll={onApplyDishToAll}
        onMarkAllNotEating={onMarkAllNotEating}
        onClearAll={onClearAll}
      />

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse text-left">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
            <tr>
              <th className="px-3 py-2 font-medium">Nhan vien</th>
              <th className="px-3 py-2 font-medium">Lua chon</th>
              <th className="px-3 py-2 font-medium">Trang thai</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <BulkEntryRow
                key={row.employee.id}
                row={row}
                dishOptions={dishOptions}
                disabled={disabled}
                errors={errorsByEmployee.get(row.employee.id) ?? []}
                onSelectionChange={onSelectionChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
