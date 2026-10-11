import { CircleCheck, CircleSlash, Pencil, Power, PowerOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DishView } from "@/mappers/dish";

interface DishTableProps {
  dishes: DishView[];
  canManage: boolean;
  onEdit: (dish: DishView) => void;
  onToggleActive: (dish: DishView) => void;
}

/**
 * Bang catalog mon an. Trang thai active hien bang text + icon (khong chi mau).
 * Action chi hien khi canManage.
 */
export function DishTable({ dishes, canManage, onEdit, onToggleActive }: DishTableProps) {
  if (dishes.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Chua co mon an nao.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Ma</th>
            <th className="px-4 py-2 font-medium">Ten mon</th>
            <th className="px-4 py-2 font-medium">Phan loai</th>
            <th className="px-4 py-2 font-medium">Nhan an uong</th>
            <th className="px-4 py-2 font-medium">Trang thai</th>
            {canManage ? <th className="px-4 py-2 font-medium">Thao tac</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y">
          {dishes.map((dish) => (
            <tr key={dish.id}>
              <td className="px-4 py-2 font-mono text-xs">{dish.code}</td>
              <td className="px-4 py-2">
                <div className="flex flex-col">
                  <span>{dish.name}</span>
                  {dish.description ? (
                    <span className="text-muted-foreground text-xs">{dish.description}</span>
                  ) : null}
                </div>
              </td>
              <td className="text-muted-foreground px-4 py-2">{dish.category ?? "-"}</td>
              <td className="px-4 py-2">
                {dish.dietaryTags.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {dish.dietaryTags.map((tag) => (
                      <Badge key={tag} variant="muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-2">
                {dish.isActive ? (
                  <Badge variant="success">
                    <CircleCheck className="size-3.5" aria-hidden />
                    {dish.statusLabel}
                  </Badge>
                ) : (
                  <Badge variant="muted">
                    <CircleSlash className="size-3.5" aria-hidden />
                    {dish.statusLabel}
                  </Badge>
                )}
              </td>
              {canManage ? (
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Sua"
                      onClick={() => onEdit(dish)}
                    >
                      <Pencil aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={dish.isActive ? "Tat mon" : "Bat mon"}
                      onClick={() => onToggleActive(dish)}
                    >
                      {dish.isActive ? <PowerOff aria-hidden /> : <Power aria-hidden />}
                    </Button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
