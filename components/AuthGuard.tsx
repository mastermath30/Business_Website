"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/localStorage";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getUser()) {
      router.replace("/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="surface-base flex min-h-screen items-center justify-center">
        <div
          className="h-8 w-8 rounded-full border-[3px] animate-[bb-spin_0.8s_linear_infinite]"
          style={{
            borderColor: "var(--surface-border)",
            borderTopColor: "#16a34a",
          }}
        />
        <style>{`@keyframes bb-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
