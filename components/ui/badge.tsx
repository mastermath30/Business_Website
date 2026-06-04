import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        primary:
          "border-primary/20 bg-primary/10 text-primary",
        success:
          "border-success/20 bg-success/10 text-success",
        amber:
          "border-amber-500/20 bg-amber-500/10 text-amber-400",
        cyan: "border-[#22d3ee]/20 bg-[#22d3ee]/10 text-[#22d3ee]",
        purple:
          "border-[#16a34a]/20 bg-[#16a34a]/10 text-[#16a34a]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
