import { cn } from "@/lib/utils";

export function AmbientGlow({
  className,
  variant = "purple",
}: {
  className?: string;
  variant?: "purple" | "blue" | "cyan" | "mix";
}) {
  const palettes = {
    purple: "bg-[radial-gradient(ellipse_at_center,hsl(263_89%_66%/0.35),transparent_60%)]",
    blue: "bg-[radial-gradient(ellipse_at_center,hsl(217_91%_60%/0.35),transparent_60%)]",
    cyan: "bg-[radial-gradient(ellipse_at_center,hsl(189_94%_55%/0.35),transparent_60%)]",
    mix: "bg-[conic-gradient(from_180deg_at_50%_50%,hsl(217_91%_60%/0.35),hsl(263_89%_66%/0.35),hsl(189_94%_55%/0.35),hsl(217_91%_60%/0.35))]",
  } as const;
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute -z-10 blur-3xl opacity-60",
        palettes[variant],
        className
      )}
    />
  );
}
