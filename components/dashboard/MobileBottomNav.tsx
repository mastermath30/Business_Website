"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/topics", label: "Topics", icon: FolderOpen },
  { href: "/study", label: "Study", icon: GraduationCap },
  { href: "/dashboard/quizzes", label: "Quizzes", icon: Sparkles },
  { href: "/dashboard/analytics", label: "Stats", icon: BarChart3 },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 mx-3 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-full border border-white/[0.08] bg-background/85 px-2 py-1.5 shadow-elevated backdrop-blur-2xl">
        {nav.map((n) => {
          const active =
            pathname === n.href ||
            (n.href !== "/dashboard" && pathname?.startsWith(n.href));
          const isUpload = n.href === "/study";
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "relative flex flex-col items-center justify-center rounded-full px-3 py-1.5 text-[10px] transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isUpload ? (
                <span className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-glow [background:linear-gradient(135deg,hsl(217_91%_60%),hsl(265_89%_66%))]">
                  <n.icon className="h-5 w-5" />
                </span>
              ) : (
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                    active && "bg-primary/15 text-primary"
                  )}
                >
                  <n.icon className="h-4 w-4" />
                </span>
              )}
              <span className={cn("mt-0.5", isUpload && "mt-1.5")}>
                {n.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
