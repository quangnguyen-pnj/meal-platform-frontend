import {
  formatHcmInstant,
  formatServiceDate,
  mealTypeLabel,
  windowLabelFor,
  type StatusLabel,
} from "@/mappers/meal-session";
import type { MyMealDishViewDto, MyMealSessionViewDto } from "@/types/api";

/** Mot lua chon mon ma nhan vien co the dang ky trong session. */
export interface MyMealDishView {
  /** Id cua MealSessionDish, dung lam gia tri gui len khi dang ky. */
  mealSessionDishId: string;
  dishId: string;
  /** Ten mon da resolve tu catalog, hien thi cho nhan vien. */
  name: string;
  /** Ma mon, hien thi phu ben canh ten de phan biet mon trung ten. */
  code: string;
  sortOrder: number;
}

/**
 * View model cho mot session trong man hinh "Bua an cua toi". Gom thong tin
 * session, cua so dang ky, lua chon hien tai va he qua neu khong dang ky.
 */
export interface MyMealsSessionView {
  mealSessionId: string;
  serviceDate: string;
  mealTypeLabel: string;
  windowLabel: StatusLabel;
  windowReason: string;
  cutoffAtDisplay: string;
  /** Co the chon/doi/huy hay khong (cua so dang mo). */
  canRegister: boolean;
  dishes: MyMealDishView[];
  /** MealSessionDish id dang duoc chon (REGISTERED), hoac null khi chua chon. */
  selectedMealSessionDishId: string | null;
  /** Da co dang ky dang hieu luc (status REGISTERED). */
  hasActiveRegistration: boolean;
  /**
   * Canh bao he qua khi cua so da dong. null khi cua so con mo. Khi dong va
   * nhan vien chua dang ky, noi ro se khong co suat an.
   */
  closedConsequence: string | null;
}

function closedConsequenceFor(canRegister: boolean, hasActiveRegistration: boolean): string | null {
  if (canRegister) {
    return null;
  }
  if (hasActiveRegistration) {
    return "Cua so dang ky da dong. Lua chon cua ban da duoc ghi nhan va khong the thay doi.";
  }
  return "Cua so dang ky da dong va ban chua chon mon. Ban se khong duoc cung cap suat an cho bua nay.";
}

function toDishView(dish: MyMealDishViewDto): MyMealDishView {
  return {
    mealSessionDishId: dish.mealSessionDishId,
    dishId: dish.dishId,
    name: dish.name,
    code: dish.code,
    sortOrder: dish.sortOrder,
  };
}

export function toMyMealsSessionView(session: MyMealSessionViewDto): MyMealsSessionView {
  const dishes = [...session.dishes].sort((a, b) => a.sortOrder - b.sortOrder).map(toDishView);

  // Nguon su that cho lua chon la dish.isSelected; myRegistration la fallback
  // de xac dinh con dang ky dang hieu luc hay khong.
  const selectedFromDishes = session.dishes.find((dish) => dish.isSelected) ?? null;
  const hasActiveRegistration =
    selectedFromDishes !== null || session.myRegistration?.status === "REGISTERED";
  const selectedMealSessionDishId = hasActiveRegistration
    ? (selectedFromDishes?.mealSessionDishId ?? session.myRegistration?.mealSessionDishId ?? null)
    : null;
  const canRegister = session.registrationWindow.isOpen;

  return {
    mealSessionId: session.id,
    serviceDate: formatServiceDate(session.serviceDate),
    mealTypeLabel: mealTypeLabel(session.mealType),
    windowLabel: windowLabelFor(session.registrationWindow.state),
    windowReason: session.registrationWindow.reason,
    cutoffAtDisplay: formatHcmInstant(session.registrationWindow.cutoffAt),
    canRegister,
    dishes,
    selectedMealSessionDishId,
    hasActiveRegistration,
    closedConsequence: closedConsequenceFor(canRegister, hasActiveRegistration),
  };
}

export function toMyMealsSessionViews(sessions: MyMealSessionViewDto[]): MyMealsSessionView[] {
  return sessions.map(toMyMealsSessionView);
}
