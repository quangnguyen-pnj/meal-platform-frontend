import { CheckCircle2, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ImportRowView } from "@/mappers/employee-import";

interface ImportRowTableProps {
  rows: ImportRowView[];
}

/**
 * Bang preview cac dong import. Trang thai row hien bang text + icon (khong chi
 * mau); loi tung field liet ke ngay trong dong INVALID.
 */
export function ImportRowTable({ rows }: ImportRowTableProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">File khong co dong du lieu nao.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground text-left">
          <tr>
            <th className="px-3 py-2 font-medium">Dong</th>
            <th className="px-3 py-2 font-medium">Trang thai</th>
            <th className="px-3 py-2 font-medium">Ma NV</th>
            <th className="px-3 py-2 font-medium">Ho ten</th>
            <th className="px-3 py-2 font-medium">Email</th>
            <th className="px-3 py-2 font-medium">Factory</th>
            <th className="px-3 py-2 font-medium">Department</th>
            <th className="px-3 py-2 font-medium">Team</th>
            <th className="px-3 py-2 font-medium">Thiet bi</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.id} className={row.isValid ? undefined : "bg-destructive/5"}>
              <td className="px-3 py-2 font-mono text-xs">{row.rowNumber}</td>
              <td className="px-3 py-2">
                {row.isValid ? (
                  <Badge variant="success">
                    <CheckCircle2 className="size-3.5" aria-hidden />
                    Hop le
                  </Badge>
                ) : (
                  <div className="flex flex-col gap-1">
                    <Badge variant="destructive">
                      <XCircle className="size-3.5" aria-hidden />
                      Loi
                    </Badge>
                    <ul className="text-destructive flex flex-col gap-0.5 text-xs">
                      {row.errors.map((error, index) => (
                        <li key={`${error.field}-${index}`}>
                          <span className="font-medium">{error.field}:</span> {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </td>
              <td className="px-3 py-2 font-mono text-xs">{row.employeeCode}</td>
              <td className="px-3 py-2">{row.fullName}</td>
              <td className="text-muted-foreground px-3 py-2">{row.email}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.factoryCode}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.departmentCode}</td>
              <td className="px-3 py-2 font-mono text-xs">{row.teamCode}</td>
              <td className="px-3 py-2">{row.hasPersonalDeviceLabel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
