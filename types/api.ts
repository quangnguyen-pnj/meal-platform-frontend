/**
 * Hinh dang loi chuan tu backend meal-platform-api.
 * Moi endpoint tra loi theo dang nay: { code, message, details?, requestId }.
 */
export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
}

/**
 * Payload cua endpoint GET /v1/health.
 * Backend chua chot chi tiet, nen chi coi status la bat buoc.
 */
export interface HealthResponse {
  status: string;
  [key: string]: unknown;
}

/* ----------------------------------------------------------------------------
 * Auth
 * ------------------------------------------------------------------------- */

/** Token tra ve tu POST /auth/login va POST /auth/refresh. */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  /** So giay den khi access token het han. */
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

/** Mot grant scope cua principal (tu GET /auth/me). */
export interface ScopeGrantDto {
  roleCode: string;
  roleName: string;
  organizationId: string;
  factoryId: string | null;
  departmentId: string | null;
  teamId: string | null;
}

export interface PrincipalEmployeeDto {
  id: string;
  employeeCode: string;
  fullName: string;
  factoryId: string;
  departmentId: string;
  teamId: string;
}

/** Payload cua GET /auth/me. */
export interface AuthMeResponse {
  userAccountId: string;
  email: string;
  organizationId: string;
  employee: PrincipalEmployeeDto | null;
  roles: string[];
  permissions: string[];
  scopeGrants: ScopeGrantDto[];
}

/* ----------------------------------------------------------------------------
 * Organization: scope tree + factory/department/team
 * ------------------------------------------------------------------------- */

export interface TeamDto {
  id: string;
  organizationId: string;
  factoryId: string;
  departmentId: string;
  code: string;
  name: string;
}

export interface DepartmentDto {
  id: string;
  organizationId: string;
  factoryId: string;
  code: string;
  name: string;
}

export interface FactoryDto {
  id: string;
  organizationId: string;
  code: string;
  name: string;
}

/** Payload cua GET /scope-tree: factory -> department -> team long nhau. */
export interface ScopeTreeResponse {
  organizationId: string;
  factories: ScopeTreeFactoryDto[];
}

export interface ScopeTreeFactoryDto extends FactoryDto {
  departments: ScopeTreeDepartmentDto[];
}

export interface ScopeTreeDepartmentDto extends DepartmentDto {
  teams: TeamDto[];
}

export interface CreateFactoryRequest {
  code: string;
  name: string;
}

export interface UpdateFactoryRequest {
  name: string;
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  factoryId: string;
}

export interface UpdateDepartmentRequest {
  name: string;
}

export interface CreateTeamRequest {
  code: string;
  name: string;
  factoryId: string;
  departmentId: string;
}

export interface UpdateTeamRequest {
  name: string;
}

/* ----------------------------------------------------------------------------
 * Workforce: employees + role grants
 * ------------------------------------------------------------------------- */

export interface EmployeeDto {
  id: string;
  organizationId: string;
  factoryId: string;
  departmentId: string;
  teamId: string;
  employeeCode: string;
  fullName: string;
  email: string | null;
  hasPersonalDevice: boolean;
  userAccountId: string | null;
}

export interface CreateEmployeeAccountRequest {
  email: string;
  password: string;
}

export interface CreateEmployeeRequest {
  employeeCode: string;
  fullName: string;
  email?: string;
  hasPersonalDevice?: boolean;
  factoryId: string;
  departmentId: string;
  teamId: string;
  account?: CreateEmployeeAccountRequest;
}

export interface UpdateEmployeeRequest {
  fullName?: string;
  email?: string | null;
  hasPersonalDevice?: boolean;
  factoryId?: string;
  departmentId?: string;
  teamId?: string;
}

export interface CreateRoleGrantRequest {
  userAccountId: string;
  roleId: string;
  factoryId?: string;
  departmentId?: string;
  teamId?: string;
}

/* ----------------------------------------------------------------------------
 * Employee import
 * ------------------------------------------------------------------------- */

export type ImportJobStatus = "UPLOADED" | "VALIDATED" | "COMMITTED" | "FAILED";

/** Payload cua POST /employee-imports va GET /employee-imports/:id. */
export interface ImportJobDto {
  id: string;
  organizationId: string;
  status: ImportJobStatus;
  originalFilename: string;
  rowCount: number;
  errorCount: number;
  createdAt: string;
  updatedAt: string;
}

export type ImportRowStatus = "PENDING" | "VALID" | "INVALID";

/** Loi cua mot o/row trong preview import. */
export interface ImportRowErrorDto {
  field: string;
  message: string;
}

/** Mot dong preview tu GET /employee-imports/:id/rows. */
export interface ImportRowDto {
  id: string;
  rowNumber: number;
  employeeCode: string | null;
  fullName: string | null;
  email: string | null;
  factoryCode: string | null;
  departmentCode: string | null;
  teamCode: string | null;
  hasPersonalDevice: boolean | null;
  status: ImportRowStatus;
  errors: ImportRowErrorDto[];
}

/** Ket qua cua POST /employee-imports/:id/apply. */
export interface ImportApplyResultDto {
  jobId: string;
  status: ImportJobStatus;
  created: number;
  updated: number;
}

/* ----------------------------------------------------------------------------
 * Dishes (P1-04): catalog mon an theo organization
 * ------------------------------------------------------------------------- */

/** Payload cua GET /dishes, GET /dishes/:id, POST/PATCH /dishes. */
export interface DishDto {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  description: string | null;
  category: string | null;
  dietaryTags: string[];
  isActive: boolean;
}

export interface CreateDishRequest {
  code: string;
  name: string;
  description?: string;
  category?: string;
  dietaryTags?: string[];
}

export interface UpdateDishRequest {
  name?: string;
  description?: string;
  category?: string;
  dietaryTags?: string[];
}

/* ----------------------------------------------------------------------------
 * Weekly menus (P1-04): menu tuan theo factory
 * ------------------------------------------------------------------------- */

export type MealType = "LUNCH" | "DINNER";

export type WeeklyMenuStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/** Mot muc mon an trong menu tuan. */
export interface MenuItemDto {
  id: string;
  weeklyMenuId: string;
  /** Ngay phuc vu YYYY-MM-DD trong tuan cua menu. */
  serviceDate: string;
  mealType: MealType;
  dishId: string;
  sortOrder: number;
}

/** Payload cua GET /weekly-menus, GET /weekly-menus/:id, POST /weekly-menus. */
export interface WeeklyMenuDto {
  id: string;
  organizationId: string;
  factoryId: string;
  /** Thu Hai dau tuan theo gio HCM, YYYY-MM-DD. */
  weekStartDate: string;
  status: WeeklyMenuStatus;
  publishedAt: string | null;
  publishedByUserId: string | null;
  items: MenuItemDto[];
}

export interface CreateWeeklyMenuRequest {
  factoryId: string;
  /** Bat ky ngay nao trong tuan; backend chuan hoa ve Thu Hai HCM. */
  weekStartDate: string;
}

export interface CreateMenuItemRequest {
  serviceDate: string;
  mealType: MealType;
  dishId: string;
  sortOrder?: number;
}

export interface UpdateMenuItemRequest {
  sortOrder?: number;
}

/* ----------------------------------------------------------------------------
 * Meal sessions (P1-05)
 * ------------------------------------------------------------------------- */

export type MealSessionStatus = "DRAFT" | "PUBLISHED" | "OPEN" | "CLOSED" | "CANCELLED";

export type RegistrationWindowState =
  "OPEN" | "BEFORE_OPEN" | "CUTOFF_PASSED" | "CLOSED" | "CANCELLED";

/** Mon trong mot meal session. */
export interface MealSessionDishDto {
  id: string;
  mealSessionId: string;
  dishId: string;
  sortOrder: number;
}

/** Cua so dang ky cua session, do backend tinh theo gio HCM. */
export interface RegistrationWindowDto {
  mealSessionId: string;
  state: RegistrationWindowState;
  isOpen: boolean;
  reason: string;
  opensAt: string;
  cutoffAt: string;
}

/** Payload cua GET /meal-sessions va cac lenh lifecycle. */
export interface MealSessionDto {
  id: string;
  organizationId: string;
  factoryId: string;
  weeklyMenuId: string | null;
  /** Ngay vận hành theo lich HCM, dang YYYY-MM-DD. */
  serviceDate: string;
  mealType: MealType;
  status: MealSessionStatus;
  /** Instant ISO-8601, hien thi theo gio HCM. */
  opensAt: string;
  cutoffAt: string;
  publishedAt: string | null;
  publishedByUserId: string | null;
  dishes: MealSessionDishDto[];
  registrationWindow: RegistrationWindowDto;
}

/** Body cua POST /meal-sessions: tao session DRAFT tu mot weekly menu da PUBLISHED. */
export interface CreateMealSessionsRequest {
  weeklyMenuId: string;
  opensAt: string;
  cutoffAt: string;
}

/** Body cua PATCH /meal-sessions/:id (chi DRAFT). */
export interface UpdateMealSessionRequest {
  opensAt?: string;
  cutoffAt?: string;
}

/* ----------------------------------------------------------------------------
 * Reports (P1-06): tong hop session chi doc
 * ------------------------------------------------------------------------- */

/**
 * Mot mon trong tong hop session, da resolve ra code/name tu catalog.
 * `registeredCount`/`absentCount`/`reserveCount` la cho Phase 2; o Phase 1
 * backend luon tra 0 vi chua co dang ky.
 */
export interface SessionSummaryDishDto {
  dishId: string;
  code: string;
  name: string;
  sortOrder: number;
  registeredCount: number;
  absentCount: number;
  reserveCount: number;
}

/** Payload cua GET /reports/meal-sessions/:id/summary (chi doc). */
export interface SessionSummaryDto {
  mealSessionId: string;
  factoryId: string;
  serviceDate: string;
  mealType: MealType;
  status: MealSessionStatus;
  offeredDishCount: number;
  totalRegistered: number;
  dishes: SessionSummaryDishDto[];
}

/* ----------------------------------------------------------------------------
 * Registrations (P2-02): tu dang ky cua nhan vien van phong
 * ------------------------------------------------------------------------- */

export type RegistrationStatus = "REGISTERED" | "CANCELLED" | "ABSENT";

export type RegistrationSource = "SELF" | "BULK" | "PAPER_FORM" | "ADMIN_ADJUSTMENT";

/**
 * Payload cua GET/POST /meal-sessions/:id/registrations/self.
 * Mot nhan vien chi co mot ban ghi moi session; GET tra null khi chua dang ky.
 */
export interface MealRegistrationDto {
  id: string;
  mealSessionId: string;
  employeeId: string;
  mealSessionDishId: string;
  status: RegistrationStatus;
  source: RegistrationSource;
  registeredAt: string;
  cancelledAt: string | null;
}

/** Body cua POST /meal-sessions/:id/registrations/self: chon hoac doi mon. */
export interface SelfRegistrationRequest {
  mealSessionDishId: string;
}

/* ----------------------------------------------------------------------------
 * Reserve pool (P2-11): hạn mức dự phòng theo món và allocation sau cutoff.
 * Reserve allocation là một thứ ĐỘC LẬP, không phải registration thường.
 * ------------------------------------------------------------------------- */

export type ReserveAllocationStatus = "ALLOCATED" | "CANCELLED";

/**
 * Payload cua GET /meal-sessions/:id/reserve-pool (một phần tử mỗi món của
 * session) va POST .../reserve-pool/dishes/:mealSessionDishId.
 */
export interface ReservePoolViewDto {
  mealSessionId: string;
  mealSessionDishId: string;
  isEnabled: boolean;
  /** So suat du phong da cau hinh (truoc cutoff). */
  quantity: number;
  /** So suat da cap. */
  allocated: number;
  /** So suat con lai co the cap. */
  remaining: number;
}

/**
 * Body cua POST /meal-sessions/:id/reserve-pool/dishes/:mealSessionDishId:
 * cau hinh bat/tat va hạn mức, chi hop le TRUOC cutoff (sau cutoff -> CONFLICT).
 */
export interface ConfigureReservePoolRequest {
  isEnabled: boolean;
  quantity: number;
}

/**
 * Body cua POST /meal-sessions/:id/reserve-pool/allocations: cap mot suat du
 * phong SAU cutoff. reason bat buoc; quantity mac dinh 1; employeeId tuy chon.
 */
export interface CreateReserveAllocationRequest {
  mealSessionDishId: string;
  employeeId?: string;
  quantity?: number;
  reason: string;
}

/** Payload cua POST .../reserve-pool/allocations va danh sach allocation. */
export interface ReserveAllocationViewDto {
  id: string;
  mealSessionId: string;
  mealSessionDishId: string;
  employeeId: string | null;
  quantity: number;
  status: ReserveAllocationStatus;
  reason: string | null;
  allocatedByUserId: string;
  allocatedAt: string;
}

/* ----------------------------------------------------------------------------
 * Registration adjustments (P2-09) — ADJUSTMENT SECTION, append-only.
 * Backend contract P2-08, moi route duoi /meal-registrations/:id, guard
 * registration:adjust. Khong co endpoint list/history doc duoc, nen man hinh
 * dieu chinh chay theo id va lay before/after tu response cua moi lenh.
 * ------------------------------------------------------------------------- */

/** Body cua cancel / mark-absent: reason tuy chon o DTO, bat buoc sau cutoff. */
export interface RegistrationActionRequest {
  reason?: string;
}

/**
 * Body cua POST /meal-registrations/:id/adjust: doi mon va/hoac dat status.
 * Ca hai tuy chon de goi co the chi doi mot thu; reason bat buoc sau cutoff.
 */
export interface AdjustRegistrationRequest {
  mealSessionDishId?: string;
  status?: RegistrationStatus;
  reason?: string;
}

/* ----------------------------------------------------------------------------
 * Bulk registration (P2-04 / P2-05): representative nhap dang ky hang loat.
 *
 * Section nay danh rieng cho luong bulk; P2-07 (paper-form) se tai su dung
 * cung cac contract (source PAPER_FORM, paperReference, rowNumber theo dong
 * phieu giay). Khong sua cac entry cua adjustment/reserve/self o day.
 * ------------------------------------------------------------------------- */

/** Nguon cua mot batch dang ky hang loat. */
export type RegistrationBatchSource = "BULK" | "PAPER_FORM";

/**
 * Mot dong trong batch gui len validate/commit. `mealSessionDishId` null hoac
 * `notEating` true the hien nhan vien khong an; `rowNumber` chi dung cho phieu
 * giay (P2-07), bulk thong thuong de null.
 */
export interface BulkRegistrationEntryInput {
  employeeId: string;
  mealSessionDishId?: string | null;
  notEating?: boolean;
  rowNumber?: number | null;
}

/** Body cua POST /registration-batches/validate (preview, khong ghi gi). */
export interface BulkValidationRequest {
  mealSessionId: string;
  entries: BulkRegistrationEntryInput[];
}

/**
 * Body cua POST /registration-batches (commit atomic). `source`/`paperReference`
 * danh cho P2-07; bulk thuong de source BULK va paperReference null.
 */
export interface BulkCommitRequest {
  mealSessionId: string;
  entries: BulkRegistrationEntryInput[];
  source?: RegistrationBatchSource;
  paperReference?: string | null;
  reason?: string;
}

export type BulkEntryStatus = "VALID" | "INVALID";

/** Trang thai mot dong sau khi backend validate. */
export interface BulkValidatedEntryDto {
  employeeId: string;
  mealSessionDishId: string | null;
  notEating: boolean;
  rowNumber: number | null;
  status: BulkEntryStatus;
  errors: string[];
}

/** Tong so suat theo tung mon trong session. */
export interface BulkDishTotalDto {
  mealSessionDishId: string;
  count: number;
}

/** Ket qua cua POST /registration-batches/validate (chi preview). */
export interface BulkValidationResultDto {
  mealSessionId: string;
  factoryId: string;
  isValid: boolean;
  entries: BulkValidatedEntryDto[];
  totalsByDish: BulkDishTotalDto[];
  eatingCount: number;
  notEatingCount: number;
  /** Id nhan vien trong scope nhung chua co entry nao (chua chon). */
  unselected: string[];
  inScopeEmployeeCount: number;
}

/** Ket qua cua POST /registration-batches (commit da ghi). */
export interface BulkCommitResultDto {
  batchId: string;
  status: string;
  source: RegistrationBatchSource;
  paperReference: string | null;
  registrations: MealRegistrationDto[];
  totalsByDish: BulkDishTotalDto[];
  eatingCount: number;
  notEatingCount: number;
  unselected: string[];
  inScopeEmployeeCount: number;
}

/* ----------------------------------------------------------------------------
 * Paper-form registration (P2-06 / P2-07) — PAPER FORM SECTION, append-only.
 *
 * Phieu giay co endpoint RIENG, khac luong bulk generic:
 *   POST /registration-batches/paper-form/validate
 *   POST /registration-batches/paper-form
 *   GET  /registration-batches/paper-form/:batchId
 * paperReference BAT BUOC (khong rong), backend tu dat source=PAPER_FORM.
 * Dung lai BulkValidationResultDto / BulkCommitResultDto vi cung hinh dang.
 * Khong sua cac entry bulk/adjustment/reserve/self o tren.
 * ------------------------------------------------------------------------- */

/**
 * Body cua POST /registration-batches/paper-form/validate (preview, khong ghi).
 * paperReference bat buoc; backend tra VALIDATION_ERROR khi de rong.
 */
export interface PaperFormValidationRequest {
  mealSessionId: string;
  paperReference: string;
  entries: BulkRegistrationEntryInput[];
}

/**
 * Body cua POST /registration-batches/paper-form (commit atomic). paperReference
 * bat buoc; apply lai cung phieu upsert (khong nhan doi registration).
 */
export interface PaperFormCommitRequest {
  mealSessionId: string;
  paperReference: string;
  entries: BulkRegistrationEntryInput[];
  reason?: string;
}

/* ----------------------------------------------------------------------------
 * My meals (P2-03 follow-up) — MY MEALS SECTION, append-only.
 *
 * Endpoint doc self-service cho nhan vien van phong, guard registration:self.
 * Acting employee luon la nhan vien gan voi principal; KHONG truyen employee
 * id hay factory id. Khac voi GET /meal-sessions (menu:manage), view nay da
 * resolve TEN mon va gom san registration cua chinh nhan vien.
 *   GET /my-meals/sessions              -> MyMealSessionViewDto[]
 *   GET /my-meals/sessions/:mealSessionId -> MyMealSessionViewDto
 * ------------------------------------------------------------------------- */

/**
 * Mot mon trong session kem ten da resolve tu catalog. `isSelected` cho biet
 * day co phai mon nhan vien dang chon hay khong.
 */
export interface MyMealDishViewDto {
  mealSessionDishId: string;
  dishId: string;
  code: string;
  name: string;
  sortOrder: number;
  isSelected: boolean;
}

/**
 * Payload cua GET /my-meals/sessions (danh sach) va /my-meals/sessions/:id.
 * Chi gom session nhan vien du dieu kien dang ky: dung factory, status
 * PUBLISHED hoac OPEN, serviceDate hom nay tro di theo gio HCM.
 */
export interface MyMealSessionViewDto {
  id: string;
  factoryId: string;
  /** Ngay vận hành theo lich HCM, dang YYYY-MM-DD. */
  serviceDate: string;
  mealType: MealType;
  status: MealSessionStatus;
  registrationWindow: RegistrationWindowDto;
  dishes: MyMealDishViewDto[];
  /** Dang ky hien tai cua nhan vien, hoac null khi chua chon mon. */
  myRegistration: MealRegistrationDto | null;
}
