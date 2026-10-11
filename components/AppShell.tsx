"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/services/navigation";

interface AppShellProps {
  navItems: NavItem[];
  userLabel: string;
  roleNames: string[];
  onLogout: () => void;
  children: ReactNode;
}

/** Khung bao ve: sidebar nav theo quyen, header, va vung noi dung. */
export function AppShell({ navItems, userLabel, roleNames, onLogout, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="bg-muted/30 flex w-60 shrink-0 flex-col border-r">
        <div className="border-b px-4 py-4">
          <p className="font-semibold">Meal Platform</p>
          <p className="text-muted-foreground text-xs">Quan ly suat an nha may</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col gap-2 border-t p-3">
          <div className="flex flex-col">
            <span className="truncate text-sm font-medium">{userLabel}</span>
            {roleNames.length > 0 ? (
              <span className="text-muted-foreground truncate text-xs">{roleNames.join(", ")}</span>
            ) : null}
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut aria-hidden />
            Dang xuat
          </Button>
        </div>
      </aside>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
