import { httpClient } from "@/lib/http-client";
import type {
  BulkCommitResultDto,
  BulkValidationResultDto,
  PaperFormCommitRequest,
  PaperFormValidationRequest,
} from "@/types/api";

/**
 * Endpoint rieng cho phieu giay (P2-06), tach khoi luong bulk generic. Cung
 * hinh dang ket qua voi bulk (BulkValidationResultDto / BulkCommitResultDto)
 * nhung yeu cau paperReference va backend tu dat source=PAPER_FORM.
 */

/**
 * POST /registration-batches/paper-form/validate : preview mot batch phieu
 * giay (totals theo mon, so chua chon, loi tung dong). Khong ghi du lieu.
 * paperReference rong -> backend tra VALIDATION_ERROR.
 */
export function validatePaperFormBatch(
  input: PaperFormValidationRequest,
  signal?: AbortSignal,
): Promise<BulkValidationResultDto> {
  return httpClient.post<BulkValidationResultDto>(
    "/registration-batches/paper-form/validate",
    input,
    { signal },
  );
}

/**
 * POST /registration-batches/paper-form : commit atomic. Apply lai cung phieu
 * upsert (khong nhan doi). Cua so da dong -> CONFLICT.
 */
export function commitPaperFormBatch(input: PaperFormCommitRequest): Promise<BulkCommitResultDto> {
  return httpClient.post<BulkCommitResultDto>("/registration-batches/paper-form", input);
}
