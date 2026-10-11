"use client";

import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { DishFormModal } from "@/components/menus/DishFormModal";
import { DishTable } from "@/components/menus/DishTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDishForm } from "@/hooks/useDishForm";
import { useDishes, useDishMutations } from "@/hooks/useDishes";
import { PERMISSIONS } from "@/mappers/principal";
import type { DishView } from "@/mappers/dish";

export default function DishesPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.menuManage);

  const [includeInactive, setIncludeInactive] = useState(false);
  const dishes = useDishes(includeInactive);
  const form = useDishForm();
  const mutations = useDishMutations();

  function onToggleActive(dish: DishView) {
    const action = dish.isActive ? "tat" : "bat";
    if (!window.confirm(`Ban muon ${action} mon "${dish.name}"?`)) {
      return;
    }
    if (dish.isActive) {
      mutations.disable.mutate(dish.id);
    } else {
      mutations.enable.mutate(dish.id);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">Mon an</h1>
          <p className="text-muted-foreground">Catalog mon an dung cho menu tuan.</p>
        </div>
        {canManage ? (
          <Button onClick={form.openCreate}>
            <Plus aria-hidden />
            Them mon
          </Button>
        ) : null}
      </header>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeInactive}
          onChange={(event) => setIncludeInactive(event.target.checked)}
        />
        Hien ca mon da tat
      </label>

      {dishes.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai danh sach mon...</span>
        </div>
      ) : dishes.error ? (
        <ApiErrorNotice error={dishes.error} context="xem danh sach mon" />
      ) : dishes.data ? (
        <DishTable
          dishes={dishes.data}
          canManage={canManage}
          onEdit={form.openEdit}
          onToggleActive={onToggleActive}
        />
      ) : null}

      <DishFormModal
        context={form.context}
        code={form.code}
        name={form.name}
        description={form.description}
        category={form.category}
        dietaryTags={form.dietaryTags}
        error={form.error}
        isSubmitting={form.isSubmitting}
        onCodeChange={form.setCode}
        onNameChange={form.setName}
        onDescriptionChange={form.setDescription}
        onCategoryChange={form.setCategory}
        onDietaryTagsChange={form.setDietaryTags}
        onClose={form.close}
        onSubmit={form.onSubmit}
      />
    </div>
  );
}
