import { Check, Minus, Pencil, Smartphone, Trash2, UserCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EmployeeView } from "@/mappers/employee";

interface EmployeeTableProps {
  employees: EmployeeView[];
  canManage: boolean;
  onEdit: (employee: EmployeeView) => void;
  onDelete: (employee: EmployeeView) => void;
}

/**
 * Bang nhan vien. Trang thai thiet bi/account hien bang text + icon, khong chi
 * dua vao mau. Action chi hien khi canManage.
 */
export function EmployeeTable({ employees, canManage, onEdit, onDelete }: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Khong co nhan vien nao trong pham vi nay.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-muted-foreground text-left">
          <tr>
            <th className="px-4 py-2 font-medium">Ma</th>
            <th className="px-4 py-2 font-medium">Ho ten</th>
            <th className="px-4 py-2 font-medium">Email</th>
            <th className="px-4 py-2 font-medium">Thiet bi ca nhan</th>
            <th className="px-4 py-2 font-medium">Tai khoan</th>
            {canManage ? <th className="px-4 py-2 font-medium">Thao tac</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y">
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="px-4 py-2 font-mono text-xs">{employee.employeeCode}</td>
              <td className="px-4 py-2">{employee.fullName}</td>
              <td className="text-muted-foreground px-4 py-2">{employee.email ?? "-"}</td>
              <td className="px-4 py-2">
                {employee.hasPersonalDevice ? (
                  <Badge variant="success">
                    <Smartphone className="size-3.5" aria-hidden />
                    Co
                  </Badge>
                ) : (
                  <Badge variant="muted">
                    <Minus className="size-3.5" aria-hidden />
                    Khong
                  </Badge>
                )}
              </td>
              <td className="px-4 py-2">
                {employee.hasAccount ? (
                  <Badge variant="success">
                    <UserCheck className="size-3.5" aria-hidden />
                    Da lien ket
                  </Badge>
                ) : (
                  <Badge variant="muted">
                    <Check className="size-3.5 opacity-0" aria-hidden />
                    Chua co
                  </Badge>
                )}
              </td>
              {canManage ? (
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Sua"
                      onClick={() => onEdit(employee)}
                    >
                      <Pencil aria-hidden />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Xoa"
                      onClick={() => onDelete(employee)}
                    >
                      <Trash2 aria-hidden />
                    </Button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
