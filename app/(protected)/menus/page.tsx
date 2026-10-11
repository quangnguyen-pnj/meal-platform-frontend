"use client";

import { Loader2, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { ApiErrorNotice } from "@/components/ApiErrorNotice";
import { AddMenuItemModal } from "@/components/menus/AddMenuItemModal";
import { FactoryPicker } from "@/components/menus/FactoryPicker";
import { WeeklyMenuEditor } from "@/components/menus/WeeklyMenuEditor";
import { WeeklyMenuFormModal } from "@/components/menus/WeeklyMenuFormModal";
import { WeeklyMenuList } from "@/components/menus/WeeklyMenuList";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDishes } from "@/hooks/useDishes";
import { useMenuItemForm } from "@/hooks/useMenuItemForm";
import { useScopeTree } from "@/hooks/useScopeTree";
import { useWeeklyMenuForm } from "@/hooks/useWeeklyMenuForm";
import { useWeeklyMenuMutations, useWeeklyMenus } from "@/hooks/useWeeklyMenu";
import { PERMISSIONS } from "@/mappers/principal";
import { toWeeklyMenuView } from "@/mappers/weekly-menu";

export default function MenusPage() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.menuManage);

  const scopeTree = useScopeTree();
  const [factoryId, setFactoryId] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const menus = useWeeklyMenus(factoryId ?? undefined);
  // Lay ca mon da tat de co ten hien thi cho muc da them tu truoc.
  const allDishes = useDishes(true);
  const activeDishes = useMemo(
    () => (allDishes.data ?? []).filter((dish) => dish.isActive),
    [allDishes.data],
  );
  const dishNameById = useMemo(
    () => new Map((allDishes.data ?? []).map((dish) => [dish.id, dish.name])),
    [allDishes.data],
  );

  const menuForm = useWeeklyMenuForm(factoryId ?? undefined);
  const itemForm = useMenuItemForm(factoryId ?? undefined);
  const mutations = useWeeklyMenuMutations(factoryId ?? undefined);

  const factories = scopeTree.data?.factories ?? [];

  const selectedMenu = useMemo(() => {
    const dto = menus.data?.find((menu) => menu.id === selectedMenuId);
    return dto ? toWeeklyMenuView(dto, dishNameById) : null;
  }, [menus.data, selectedMenuId, dishNameById]);

  function onSelectFactory(nextFactoryId: string) {
    setFactoryId(nextFactoryId);
    setSelectedMenuId(null);
  }

  function onPublish() {
    if (!selectedMenu) {
      return;
    }
    if (!window.confirm("Phat hanh menu tuan nay?")) {
      return;
    }
    mutations.publish.mutate(selectedMenu.id);
  }

  function onArchive() {
    if (!selectedMenu) {
      return;
    }
    if (!window.confirm("Luu tru menu tuan nay?")) {
      return;
    }
    mutations.archive.mutate(selectedMenu.id);
  }

  function onRemoveItem(itemId: string) {
    if (!selectedMenu) {
      return;
    }
    mutations.removeItem.mutate({ menuId: selectedMenu.id, itemId });
  }

  const isMutating =
    mutations.publish.isPending ||
    mutations.archive.isPending ||
    mutations.removeItem.isPending ||
    mutations.addItem.isPending;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Menu tuan</h1>
        <p className="text-muted-foreground">
          Soan menu tuan theo nha may, them mon theo ngay va bua, roi phat hanh.
        </p>
      </header>

      {scopeTree.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span>Dang tai nha may...</span>
        </div>
      ) : scopeTree.error ? (
        <ApiErrorNotice error={scopeTree.error} context="xem nha may" />
      ) : (
        <FactoryPicker
          factories={factories}
          selectedFactoryId={factoryId}
          onSelect={onSelectFactory}
        />
      )}

      {factoryId ? (
        <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">Danh sach menu</h2>
              {canManage ? (
                <Button size="sm" variant="outline" onClick={menuForm.openForm}>
                  <Plus aria-hidden />
                  Tao menu
                </Button>
              ) : null}
            </div>

            {menus.isLoading ? (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                <span>Dang tai menu...</span>
              </div>
            ) : menus.error ? (
              <ApiErrorNotice error={menus.error} context="xem menu tuan" />
            ) : menus.data ? (
              <WeeklyMenuList
                menus={menus.data.map((dto) => toWeeklyMenuView(dto, dishNameById))}
                selectedMenuId={selectedMenuId}
                onSelect={setSelectedMenuId}
              />
            ) : null}
          </section>

          <section>
            {allDishes.error ? (
              <ApiErrorNotice error={allDishes.error} context="xem danh sach mon" />
            ) : selectedMenu ? (
              <WeeklyMenuEditor
                menu={selectedMenu}
                canManage={canManage}
                onAddItem={(serviceDate, mealType) =>
                  itemForm.open({ menuId: selectedMenu.id, serviceDate, mealType })
                }
                onRemoveItem={onRemoveItem}
                onPublish={onPublish}
                onArchive={onArchive}
                isMutating={isMutating}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                Chon mot menu tuan de xem va chinh sua.
              </p>
            )}
          </section>
        </div>
      ) : null}

      <WeeklyMenuFormModal
        open={menuForm.open}
        weekStartDate={menuForm.weekStartDate}
        error={menuForm.error}
        isSubmitting={menuForm.isSubmitting}
        onWeekStartDateChange={menuForm.setWeekStartDate}
        onClose={menuForm.close}
        onSubmit={menuForm.onSubmit}
      />

      <AddMenuItemModal
        open={itemForm.context !== null}
        serviceDate={itemForm.context?.serviceDate ?? null}
        mealType={itemForm.context?.mealType ?? null}
        activeDishes={activeDishes}
        dishId={itemForm.dishId}
        error={itemForm.error}
        isSubmitting={itemForm.isSubmitting}
        onDishChange={itemForm.setDishId}
        onClose={itemForm.close}
        onSubmit={itemForm.onSubmit}
      />
    </div>
  );
}
