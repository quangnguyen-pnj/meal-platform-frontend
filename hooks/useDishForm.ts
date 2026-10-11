import { useState, type FormEvent } from "react";

import { useDishMutations } from "@/hooks/useDishes";
import { ApiError } from "@/lib/api-error";
import type { DishView } from "@/mappers/dish";

interface CreateContext {
  mode: "create";
}

interface EditContext {
  mode: "edit";
  id: string;
  code: string;
}

export type DishFormContext = CreateContext | EditContext;

/** Chuyen chuoi tags phan tach bang dau phay thanh mang da trim, bo rong. */
function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * Form state cho tao/sua mon an. Modal mo khi `context` khac null. Khi tao can
 * code + name; khi sua, code bat bien. Mutation nam o useDishMutations.
 */
export function useDishForm() {
  const mutations = useDishMutations();

  const [context, setContext] = useState<DishFormContext | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dietaryTags, setDietaryTags] = useState("");
  const [error, setError] = useState<ApiError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function openCreate() {
    setContext({ mode: "create" });
    setCode("");
    setName("");
    setDescription("");
    setCategory("");
    setDietaryTags("");
    setError(null);
  }

  function openEdit(dish: DishView) {
    setContext({ mode: "edit", id: dish.id, code: dish.code });
    setCode(dish.code);
    setName(dish.name);
    setDescription(dish.description ?? "");
    setCategory(dish.category ?? "");
    setDietaryTags(dish.dietaryTags.join(", "));
    setError(null);
  }

  function close() {
    setContext(null);
    setError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!context) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const payload = {
      name,
      description: description.trim() || undefined,
      category: category.trim() || undefined,
      dietaryTags: parseTags(dietaryTags),
    };
    try {
      if (context.mode === "create") {
        await mutations.create.mutateAsync({ code, ...payload });
      } else {
        await mutations.update.mutateAsync({ id: context.id, input: payload });
      }
      close();
    } catch (cause) {
      setError(
        cause instanceof ApiError
          ? cause
          : new ApiError({ code: "unexpected_error", message: "Luu that bai", status: 0 }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    context,
    code,
    name,
    description,
    category,
    dietaryTags,
    error,
    isSubmitting,
    setCode,
    setName,
    setDescription,
    setCategory,
    setDietaryTags,
    openCreate,
    openEdit,
    close,
    onSubmit,
  };
}
