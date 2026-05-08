"use client";

import { Bell, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export function Topbar({ title }: { title: string }) {
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3 lg:hidden">
        <Logo />
      </div>
      <h1 className="hidden truncate font-display text-xl font-semibold tracking-tight lg:block">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <Button asChild variant="primary" size="sm">
          <Link href="/study">
            <Sparkles className="h-4 w-4" />
            Start studying
          </Link>
        </Button>
      </div>
    </div>
  );
}
