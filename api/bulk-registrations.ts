import { httpClient } from "@/lib/http-client";
import type {
  BulkCommitRequest,
  BulkCommitResultDto,
  BulkValidationRequest,
  BulkValidationResultDto,
} from "@/types/api";

/**
 * POST /registration-batches/validate : preview mot batch (totals theo mon, so
 * nhan vien chua chon, loi tung dong). Khong ghi du lieu, dung cho buoc xem
 * truoc truoc khi commit.
 */
export function validateRegistrationBatch(
  input: BulkValidationRequest,
  signal?: AbortSignal,
): Promise<BulkValidationResultDto> {
  return httpClient.post<BulkValidationResultDto>("/registration-batches/validate", input, {
    signal,
  });
}

/**
 * POST /registration-batches : commit atomic. Mot dong khong hop le khien ca
 * batch khong ghi gi va backend tra VALIDATION_ERROR voi details.invalidEntries.
 * Khi cua so da dong, backend tra CONFLICT kem ly do.
 */
export function commitRegistrationBatch(input: BulkCommitRequest): Promise<BulkCommitResultDto> {
  return httpClient.post<BulkCommitResultDto>("/registration-batches", input);
}
