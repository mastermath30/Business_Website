import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withWord = true,
}: {
  className?: string;
  withWord?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center font-display tracking-tight",
        className
      )}
      style={{ gap: "12px" }}
    >
      <img
        src="/TeslaSTEMlogo.png"
        alt="Tesla STEM High School"
        style={{ height: "52px", width: "52px", objectFit: "contain", flexShrink: 0 }}
      />
      {withWord && (
        <>
          <span
            aria-hidden
            className="bg-foreground/10 dark:bg-foreground/20"
            style={{ height: "28px", width: "1px", flexShrink: 0 }}
          />
          <span
            className="text-foreground"
            style={{ fontSize: "20px", fontWeight: 700, lineHeight: 1, whiteSpace: "nowrap" }}
          >
            Business
            <span className="text-muted-foreground" style={{ fontWeight: 700 }}>
              Boost
            </span>
          </span>
        </>
      )}
    </Link>
  );
}
