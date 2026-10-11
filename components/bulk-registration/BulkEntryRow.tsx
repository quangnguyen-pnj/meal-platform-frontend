import { AlertTriangle } from "lucide-react";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { BulkDishOption, BulkGridRow, BulkRowSelection } from "@/mappers/bulk-registration";

/** Gia tri dac biet trong o select cho hai lua chon khong phai mon. */
const NOT_EATING_VALUE = "__not-eating__";
const NONE_VALUE = "";

interface BulkEntryRowProps {
  row: BulkGridRow;
  dishOptions: BulkDishOption[];
  disabled: boolean;
  /** Loi tu validate cho dong nay; co loi se highlight do. */
  errors: string[];
  onSelectionChange: (employeeId: string, selection: BulkRowSelection) => void;
}

function selectionToValue(selection: BulkRowSelection): string {
  switch (selection.kind) {
    case "dish":
      return selection.mealSessionDishId;
    case "not-eating":
      return NOT_EATING_VALUE;
    case "none":
      return NONE_VALUE;
  }
}

function valueToSelection(value: string): BulkRowSelection {
  if (value === NONE_VALUE) {
    return { kind: "none" };
  }
  if (value === NOT_EATING_VALUE) {
    return { kind: "not-eating" };
  }
  return { kind: "dish", mealSessionDishId: value };
}

/**
 * Mot dong grid cho mot nhan vien: chon mon, danh dau khong an, hoac de trong.
 * Dumb component. Nhan vien chua chon (`none`) duoc highlight vang de de nhan
 * ra ai co the khong co suat an; dong co loi validate highlight do.
 */
export function BulkEntryRow({
  row,
  dishOptions,
  disabled,
  errors,
  onSelectionChange,
}: BulkEntryRowProps) {
  const isUnselected = row.selection.kind === "none";
  const hasErrors = errors.length > 0;

  return (
    <tr
      className={cn(
        "border-b last:border-b-0",
        hasErrors ? "bg-destructive/5" : isUnselected ? "bg-amber-50" : undefined,
      )}
    >
      <td className="px-3 py-2 align-top">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.employee.fullName}</span>
          <span className="text-muted-foreground text-xs">{row.employee.employeeCode}</span>
        </div>
      </td>
      <td className="px-3 py-2 align-top">
        <Select
          aria-label={`Lua chon cho ${row.employee.fullName}`}
          value={selectionToValue(row.selection)}
          disabled={disabled}
          onChange={(event) =>
            onSelectionChange(row.employee.id, valueToSelection(event.target.value))
          }
        >
          <option value={NONE_VALUE}>Chua chon</option>
          {dishOptions.map((dish) => (
            <option key={dish.mealSessionDishId} value={dish.mealSessionDishId}>
              {dish.label}
            </option>
          ))}
          <option value={NOT_EATING_VALUE}>Khong an</option>
        </Select>
      </td>
      <td className="px-3 py-2 align-top">
        {isUnselected ? (
          <span className="flex items-center gap-1 text-xs font-medium text-amber-700">
            <AlertTriangle className="size-3.5" aria-hidden />
            Chua chon
          </span>
        ) : null}
        {hasErrors ? (
          <ul className="text-destructive flex flex-col gap-0.5 text-xs">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ) : null}
      </td>
    </tr>
  );
}
