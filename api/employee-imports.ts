import { httpClient, type DownloadedBlob } from "@/lib/http-client";
import type { ImportApplyResultDto, ImportJobDto, ImportRowDto } from "@/types/api";

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** GET /employee-imports/template : tai file .xlsx mau (binary). */
export function downloadTemplate(signal?: AbortSignal): Promise<DownloadedBlob> {
  return httpClient.getBlob("/employee-imports/template", { accept: XLSX_MIME, signal });
}

/**
 * POST /employee-imports (multipart) : tao job tu workbook. Backend parse +
 * validate moi row ngay khi upload.
 */
export function uploadWorkbook(file: File, signal?: AbortSignal): Promise<ImportJobDto> {
  const formData = new FormData();
  formData.append("file", file);
  return httpClient.postForm<ImportJobDto>("/employee-imports", formData, { signal });
}

/** GET /employee-imports/:id : trang thai job hien tai. */
export function getImportJob(id: string, signal?: AbortSignal): Promise<ImportJobDto> {
  return httpClient.get<ImportJobDto>(`/employee-imports/${id}`, { signal });
}

/** GET /employee-imports/:id/rows : preview tung dong kem loi. */
export function listImportRows(id: string, signal?: AbortSignal): Promise<ImportRowDto[]> {
  return httpClient.get<ImportRowDto[]>(`/employee-imports/${id}/rows`, { signal });
}

/**
 * POST /employee-imports/:id/apply : ghi du lieu. Bi tu choi (VALIDATION_ERROR)
 * neu job chua VALIDATED hoac con row loi; luc do khong ghi gi.
 */
export function applyImport(id: string): Promise<ImportApplyResultDto> {
  return httpClient.post<ImportApplyResultDto>(`/employee-imports/${id}/apply`);
}
