import { Archive, Plus, Send, Trash2 } from "lucide-react";

import { MenuStatusBadge } from "@/components/menus/MenuStatusBadge";
import { Button } from "@/components/ui/button";
import {
  MEAL_TYPE_LABELS,
  weekRangeLabel,
  type MenuCell,
  type WeeklyMenuView,
} from "@/mappers/weekly-menu";
import type { MealType } from "@/types/api";

interface WeeklyMenuEditorProps {
  menu: WeeklyMenuView;
  canManage: boolean;
  onAddItem: (serviceDate: string, mealType: MealType) => void;
  onRemoveItem: (itemId: string) => void;
  onPublish: () => void;
  onArchive: () => void;
  isMutating: boolean;
}

/**
 * Grid soan menu tuan: 7 ngay x 2 bua. Chi cho them/xoa muc mon khi menu con
 * la ban nhap (isEditable). Publish/archive gated theo trang thai.
 */
export function WeeklyMenuEditor({
  menu,
  canManage,
  onAddItem,
  onRemoveItem,
  onPublish,
  onArchive,
  isMutating,
}: WeeklyMenuEditorProps) {
  const editable = canManage && menu.isEditable;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Tuan {weekRangeLabel(menu.weekStartDate)}</h2>
          <MenuStatusBadge label={menu.statusLabel} icon={menu.statusIcon} />
        </div>
        {canManage ? (
          <div className="flex items-center gap-2">
            {menu.status === "DRAFT" ? (
              <Button onClick={onPublish} disabled={isMutating || menu.itemCount === 0}>
                <Send aria-hidden />
                Phat hanh
              </Button>
            ) : null}
            {menu.status !== "ARCHIVED" ? (
              <Button variant="outline" onClick={onArchive} disabled={isMutating}>
                <Archive aria-hidden />
                Luu tru
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {!menu.isEditable ? (
        <p className="text-muted-foreground text-sm">
          Menu da {menu.statusLabel.toLowerCase()}, khong the chinh sua muc mon.
        </p>
      ) : menu.itemCount === 0 ? (
        <p className="text-muted-foreground text-sm">
          Chua co mon nao. Them mon cho tung ngay va bua truoc khi phat hanh.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Ngay</th>
              {menu.days[0]?.cells.map((cell) => (
                <th key={cell.mealType} className="px-4 py-2 font-medium">
                  {MEAL_TYPE_LABELS[cell.mealType]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {menu.days.map((day) => (
              <tr key={day.serviceDate} className="align-top">
                <td className="px-4 py-3 font-medium whitespace-nowrap">{day.dateLabel}</td>
                {day.cells.map((cell) => (
                  <MealCell
                    key={cell.mealType}
                    cell={cell}
                    editable={editable}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface MealCellProps {
  cell: MenuCell;
  editable: boolean;
  onAddItem: (serviceDate: string, mealType: MealType) => void;
  onRemoveItem: (itemId: string) => void;
}

function MealCell({ cell, editable, onAddItem, onRemoveItem }: MealCellProps) {
  return (
    <td className="px-4 py-3">
      <div className="flex flex-col gap-2">
        {cell.items.length === 0 ? (
          <span className="text-muted-foreground text-xs">-</span>
        ) : (
          <ul className="flex flex-col gap-1">
            {cell.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span>{item.dishName}</span>
                {editable ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Xoa ${item.dishName}`}
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {editable ? (
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => onAddItem(cell.serviceDate, cell.mealType)}
          >
            <Plus aria-hidden />
            Them mon
          </Button>
        ) : null}
      </div>
    </td>
  );
}
