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
            style={{
              height: "28px",
              width: "1px",
              background: "rgba(0, 0, 0, 0.12)",
              flexShrink: 0,
            }}
          />
          <span
            style={{ fontSize: "20px", fontWeight: 700, color: "#0a0a0a", lineHeight: 1, whiteSpace: "nowrap" }}
          >
            Business
            <span style={{ color: "#6b7280", fontWeight: 700 }}>Boost</span>
          </span>
        </>
      )}
    </Link>
  );
}
