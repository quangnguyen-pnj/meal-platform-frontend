import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export type ImportStep = "download" | "upload" | "preview" | "done";

interface StepDef {
  key: ImportStep;
  label: string;
}

const STEPS: StepDef[] = [
  { key: "download", label: "Tai mau" },
  { key: "upload", label: "Tai len" },
  { key: "preview", label: "Xem truoc" },
  { key: "done", label: "Hoan tat" },
];

interface ImportStepperProps {
  current: ImportStep;
}

/** Hien tien trinh wizard. Trang thai bang so/dau check + text, khong chi mau. */
export function ImportStepper({ current }: ImportStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {STEPS.map((step, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full border text-xs font-medium",
                isActive && "border-primary bg-primary text-primary-foreground",
                isDone && "border-emerald-600 bg-emerald-600 text-white",
                !isActive && !isDone && "border-input text-muted-foreground",
              )}
              aria-hidden
            >
              {isDone ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span
              className={cn("text-sm", isActive ? "font-medium" : "text-muted-foreground")}
              aria-current={isActive ? "step" : undefined}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 ? (
              <span className="text-muted-foreground mx-1 hidden sm:inline" aria-hidden>
                /
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
