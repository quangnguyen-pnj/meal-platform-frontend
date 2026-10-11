import type { DishDto } from "@/types/api";

/** View model cho dong mon an trong catalog. */
export interface DishView {
  id: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  dietaryTags: string[];
  isActive: boolean;
  /** Nhan trang thai tieng Viet, dung kem icon. */
  statusLabel: string;
}

export function toDishView(dto: DishDto): DishView {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    description: dto.description,
    category: dto.category,
    dietaryTags: dto.dietaryTags,
    isActive: dto.isActive,
    statusLabel: dto.isActive ? "Dang dung" : "Da tat",
  };
}

export function toDishViews(dtos: DishDto[]): DishView[] {
  return dtos.map(toDishView);
}
