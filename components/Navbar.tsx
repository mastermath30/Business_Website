"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/study", label: "Study Tool" },
  { href: "/about", label: "About" },
];

export function Navbar({ landing = false }: { landing?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToFeatures(e: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      router.push("/");
      setTimeout(() => {
        document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          minHeight: "72px",
          width: "100%",
          maxWidth: "1080px",
          margin: "16px auto 0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          borderRadius: "9999px",
          background: "var(--nav-bg)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid var(--nav-border)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.10)"
            : "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <Logo />

        {/* Center nav links */}
        <div className="hidden md:flex" style={{ flex: 1, justifyContent: "center" }}>
          <ul
            style={{
              display: "flex",
              gap: "clamp(16px, 3vw, 40px)",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={l.href === "/#features" ? scrollToFeatures : undefined}
                  className="group relative transition-colors duration-200 ease-out text-foreground/60 hover:text-foreground"
                  style={{ fontSize: "15px", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.005em", whiteSpace: "nowrap" }}
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 h-[2px] origin-center scale-x-0 rounded-full transition-transform duration-200 ease-out group-hover:scale-x-100"
                    style={{ background: "#16a34a", bottom: "-8px" }}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ThemeToggle variant="icon" buttonSize={36} duration={600} />

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-full md:hidden"
            style={{ height: "44px", width: "44px", color: "hsl(var(--foreground) / 0.65)" }}
          >
            {open ? (
              <X style={{ height: "20px", width: "20px" }} />
            ) : (
              <Menu style={{ height: "20px", width: "20px" }} />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden"
            style={{
              position: "fixed",
              top: "108px",
              left: "16px",
              right: "16px",
              zIndex: 49,
              overflow: "hidden",
              borderRadius: "16px",
              border: "1px solid var(--nav-border)",
              background: "var(--nav-bg)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            }}
          >
            <ul className="flex flex-col gap-1 p-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={l.href === "/#features" ? scrollToFeatures : () => setOpen(false)}
                    className="block rounded-lg transition-colors hover:bg-foreground/[0.05]"
                    style={{
                      padding: "10px 12px",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "hsl(var(--foreground) / 0.65)",
                    }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
