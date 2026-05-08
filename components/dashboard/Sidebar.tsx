"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  GraduationCap,
  BarChart3,
  Settings,
  Search,
  Crown,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  getUser,
  getSessions,
  computeStats,
  type StoredUser,
  type DashboardStats,
} from "@/lib/localStorage";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/topics", label: "Topics", icon: FolderOpen },
  { href: "/dashboard/quizzes", label: "Quiz library", icon: Sparkles },
  { href: "/study", label: "Study Tool", icon: GraduationCap },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    xp: 0,
    level: 1,
    streak: 0,
    accuracy: 0,
    totalSessions: 0,
    totalCorrect: 0,
    totalAnswered: 0,
  });

  useEffect(() => {
    setUser(getUser());
    setStats(computeStats(getSessions()));
  }, []);

  const xpInLevel = stats.xp % 350;
  const xpPct = (xpInLevel / 350) * 100;
  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border/60 bg-background/40 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center px-6">
        <Logo />
      </div>

      <div className="px-4">
        <button className="group flex w-full items-center gap-2.5 rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-white/[0.12] hover:text-foreground">
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="rounded-md border border-border/60 bg-background/60 px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="mt-5 flex-1 px-3">
        <ul className="space-y-1">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-gradient-to-b from-brand-blue via-brand-purple to-brand-cyan"
                    />
                  )}
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* XP / level bar */}
      <div className="m-3 rounded-2xl border border-border/60 bg-card/40 p-4">
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-amber-400" />
          <div className="text-xs font-medium">Level {stats.level}</div>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {stats.xp.toLocaleString()} XP
          </span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full [background:linear-gradient(90deg,hsl(80_56%_51%),hsl(217_91%_60%))]"
            style={{ width: `${xpPct}%` }}
          />
        </div>
        <div className="mt-1.5 text-[11px] text-muted-foreground">
          {350 - xpInLevel} XP to level {stats.level + 1}
        </div>
      </div>

      {/* User card */}
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white [background:linear-gradient(135deg,hsl(80_56%_51%),hsl(217_91%_60%))]">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">
            {user?.name ?? "Loading…"}
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            Tesla STEM Pythons
          </div>
        </div>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </div>
    </aside>
  );
}
