import { Loader2 } from "lucide-react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import type { DishFormContext } from "@/hooks/useDishForm";
import type { ApiError } from "@/lib/api-error";

interface DishFormModalProps {
  context: DishFormContext | null;
  code: string;
  name: string;
  description: string;
  category: string;
  dietaryTags: string;
  error: ApiError | null;
  isSubmitting: boolean;
  onCodeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDietaryTagsChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

/** Modal form tao/sua mon an. Thuan trinh bay. */
export function DishFormModal({
  context,
  code,
  name,
  description,
  category,
  dietaryTags,
  error,
  isSubmitting,
  onCodeChange,
  onNameChange,
  onDescriptionChange,
  onCategoryChange,
  onDietaryTagsChange,
  onClose,
  onSubmit,
}: DishFormModalProps) {
  const open = context !== null;
  const isCreate = context?.mode === "create";
  const title = isCreate ? "Them mon an" : "Sua mon an";

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-code">Ma</Label>
          <Input
            id="dish-code"
            required
            value={code}
            disabled={!isCreate}
            onChange={(event) => onCodeChange(event.target.value)}
          />
          {!isCreate ? (
            <p className="text-muted-foreground text-xs">Ma khong doi sau khi tao.</p>
          ) : null}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-name">Ten mon</Label>
          <Input
            id="dish-name"
            required
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-description">Mo ta</Label>
          <Input
            id="dish-description"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-category">Phan loai</Label>
          <Input
            id="dish-category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dish-tags">Nhan an uong</Label>
          <Input
            id="dish-tags"
            value={dietaryTags}
            placeholder="chay, it duong"
            onChange={(event) => onDietaryTagsChange(event.target.value)}
          />
          <p className="text-muted-foreground text-xs">Phan tach bang dau phay.</p>
        </div>

        {error ? <ApiErrorNotice error={error} context="luu mon an" /> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Huy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Luu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
