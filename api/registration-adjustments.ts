import { httpClient } from "@/lib/http-client";
import type {
  AdjustRegistrationRequest,
  MealRegistrationDto,
  RegistrationActionRequest,
} from "@/types/api";

/**
 * REST wrappers mong cho dieu chinh dang ky (P2-09). Moi route nam duoi
 * /meal-registrations/:id va duoc backend guard bang registration:adjust. Cac
 * lenh thao tac tren mot registration da ton tai, dinh danh bang id; employee
 * khong bao gio lay tu body.
 *
 * Backend chua co endpoint doc danh sach hoac lich su registration doc duoc tu
 * day, nen man hinh dieu chinh chay theo id va lay trang thai moi tu chinh
 * response cua lenh (xem hooks/useRegistrationAdjustment.ts).
 */

/** POST /meal-registrations/:id/cancel : huy dang ky (status CANCELLED). */
export function cancelRegistration(
  registrationId: string,
  input: RegistrationActionRequest,
): Promise<MealRegistrationDto> {
  return httpClient.post<MealRegistrationDto>(
    `/meal-registrations/${registrationId}/cancel`,
    input,
  );
}

/** POST /meal-registrations/:id/mark-absent : danh dau vang (status ABSENT). */
export function markRegistrationAbsent(
  registrationId: string,
  input: RegistrationActionRequest,
): Promise<MealRegistrationDto> {
  return httpClient.post<MealRegistrationDto>(
    `/meal-registrations/${registrationId}/mark-absent`,
    input,
  );
}

/**
 * POST /meal-registrations/:id/adjust : doi mon va/hoac dat status cho mot
 * registration da ton tai. Co the gui mot trong hai hoac ca hai.
 */
export function adjustRegistration(
  registrationId: string,
  input: AdjustRegistrationRequest,
): Promise<MealRegistrationDto> {
  return httpClient.post<MealRegistrationDto>(
    `/meal-registrations/${registrationId}/adjust`,
    input,
  );
}
