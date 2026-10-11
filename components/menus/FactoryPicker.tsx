import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { FactoryNode } from "@/mappers/scope-tree";

interface FactoryPickerProps {
  factories: FactoryNode[];
  selectedFactoryId: string | null;
  onSelect: (factoryId: string) => void;
}

/** Chon factory de xem/soan menu tuan. Thuan trinh bay. */
export function FactoryPicker({ factories, selectedFactoryId, onSelect }: FactoryPickerProps) {
  if (factories.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">Khong co nha may nao trong pham vi cua ban.</p>
    );
  }

  return (
    <div className="flex max-w-sm flex-col gap-1.5">
      <Label htmlFor="menu-factory">Nha may</Label>
      <Select
        id="menu-factory"
        value={selectedFactoryId ?? ""}
        onChange={(event) => onSelect(event.target.value)}
      >
        <option value="" disabled>
          Chon nha may
        </option>
        {factories.map((factory) => (
          <option key={factory.id} value={factory.id}>
            {factory.name} ({factory.code})
          </option>
        ))}
      </Select>
    </div>
  );
}
