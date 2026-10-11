"use client";

import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Modal toi gian khong phu thuoc Radix/CDN. Overlay co dinh, dong bang nut X
 * hoac phim Escape. Du cho form CRUD Phase 0.
 */
export function Modal({ open, title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="bg-card text-card-foreground w-full max-w-md rounded-xl border p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-semibold leading-none">{title}</h2>
            {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Dong">
            <X aria-hidden />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
