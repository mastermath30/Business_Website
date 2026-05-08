"use client";

import { create } from "zustand";
import { userStats } from "./data";
import type { UserStats } from "./types";

interface AppState {
  stats: UserStats;
  awardXP: (amount: number) => void;
  bumpStreak: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  stats: userStats,
  awardXP: (amount) =>
    set((s) => ({
      stats: {
        ...s.stats,
        xp: s.stats.xp + amount,
        level: Math.floor((s.stats.xp + amount) / 350) + 1,
      },
    })),
  bumpStreak: () =>
    set((s) => ({
      stats: {
        ...s.stats,
        streak: s.stats.streak + 1,
        longestStreak: Math.max(s.stats.longestStreak, s.stats.streak + 1),
      },
    })),
  reset: () => set({ stats: userStats }),
}));
