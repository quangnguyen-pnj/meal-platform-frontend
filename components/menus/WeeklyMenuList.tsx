import { MenuStatusBadge } from "@/components/menus/MenuStatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { weekRangeLabel, type WeeklyMenuView } from "@/mappers/weekly-menu";

interface WeeklyMenuListProps {
  menus: WeeklyMenuView[];
  selectedMenuId: string | null;
  onSelect: (menuId: string) => void;
}

/** Danh sach menu tuan cua factory da chon. Thuan trinh bay. */
export function WeeklyMenuList({ menus, selectedMenuId, onSelect }: WeeklyMenuListProps) {
  if (menus.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center">
        <p className="text-muted-foreground text-sm">Factory nay chua co menu tuan nao.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {menus.map((menu) => {
        const isSelected = menu.id === selectedMenuId;
        return (
          <li key={menu.id}>
            <Button
              variant="outline"
              className={cn(
                "h-auto w-full flex-col items-start gap-2 px-3 py-3 text-left",
                isSelected ? "border-primary ring-primary ring-1" : "",
              )}
              onClick={() => onSelect(menu.id)}
            >
              <span className="font-medium">Tuan {weekRangeLabel(menu.weekStartDate)}</span>
              <span className="flex items-center gap-2">
                <MenuStatusBadge label={menu.statusLabel} icon={menu.statusIcon} />
                <span className="text-muted-foreground text-xs">{menu.itemCount} mon</span>
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
