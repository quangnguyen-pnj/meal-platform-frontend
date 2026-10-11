import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  applyImport,
  downloadTemplate,
  getImportJob,
  listImportRows,
  uploadWorkbook,
} from "@/api/employee-imports";
import type { ApiError } from "@/lib/api-error";
import {
  toImportApplyResultView,
  toImportJobView,
  toImportRowViews,
  type ImportApplyResultView,
  type ImportJobView,
  type ImportRowView,
} from "@/mappers/employee-import";
import type { DownloadedBlob } from "@/lib/http-client";

const DEFAULT_TEMPLATE_FILENAME = "mau-nhap-nhan-vien.xlsx";

/** Luu blob tai ve thanh file tai trinh duyet. */
function saveBlob(download: DownloadedBlob): void {
  const url = URL.createObjectURL(download.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = download.filename ?? DEFAULT_TEMPLATE_FILENAME;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * State va side effect cua wizard import nhan vien: tai mau, upload, xem job +
 * preview rows, va apply. Giu toan bo logic o day; component chi render.
 */
export function useEmployeeImport() {
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string | null>(null);
  const [applyResult, setApplyResult] = useState<ImportApplyResultView | null>(null);

  const template = useMutation<void, ApiError>({
    mutationFn: async () => {
      saveBlob(await downloadTemplate());
    },
  });

  const upload = useMutation<ImportJobView, ApiError, File>({
    mutationFn: async (file) => toImportJobView(await uploadWorkbook(file)),
    onSuccess: (job) => {
      setApplyResult(null);
      setJobId(job.id);
    },
  });

  const job = useQuery<ImportJobView, ApiError>({
    queryKey: ["employee-import", jobId],
    queryFn: async ({ signal }) => toImportJobView(await getImportJob(jobId as string, signal)),
    enabled: jobId !== null,
  });

  const rows = useQuery<ImportRowView[], ApiError>({
    queryKey: ["employee-import", jobId, "rows"],
    queryFn: async ({ signal }) => toImportRowViews(await listImportRows(jobId as string, signal)),
    enabled: jobId !== null,
  });

  const apply = useMutation<ImportApplyResultView, ApiError>({
    mutationFn: async () => toImportApplyResultView(await applyImport(jobId as string)),
    onSuccess: (result) => {
      setApplyResult(result);
      queryClient.invalidateQueries({ queryKey: ["employee-import", jobId] });
      // Nhan vien moi/duoc cap nhat phan anh ngay o man hinh danh sach (P0-03).
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  function reset() {
    setJobId(null);
    setApplyResult(null);
    upload.reset();
    apply.reset();
  }

  return {
    jobId,
    job,
    rows,
    applyResult,
    template,
    upload,
    apply,
    reset,
  };
}
