"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";
import { getUser } from "@/lib/localStorage";
import type { StoredUser } from "@/lib/localStorage";

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
  const [user, setUser] = useState<StoredUser | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function scrollToFeatures(e: React.MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      document
        .querySelector("#features")
        ?.scrollIntoView({ behavior: "smooth" });
    } else {
      e.preventDefault();
      router.push("/");
      setTimeout(() => {
        document
          .querySelector("#features")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }

  function logout() {
    localStorage.removeItem("bb:user");
    setUser(null);
    setDropdownOpen(false);
    setOpen(false);
    router.push("/");
  }

  const initial = user?.name.charAt(0).toUpperCase() ?? "";
  const firstName = user?.name.split(" ")[0] ?? "";

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

        {/* Center column — grows to fill space and centers links within it */}
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {user ? (
            /* Logged-in avatar pill + dropdown */
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px 6px 6px",
                  borderRadius: "9999px",
                  border: "1px solid var(--surface-border)",
                  background: "var(--surface-1)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "hsl(var(--foreground) / 0.65)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#16a34a",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {initial}
                </span>
                <span className="hidden sm:block">{firstName}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: "160px",
                      background: "var(--nav-bg)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid var(--surface-border)",
                      borderRadius: "14px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      padding: "6px",
                      zIndex: 60,
                    }}
                  >
                    <Link
                      href="/study"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "block",
                        padding: "8px 12px",
                        borderRadius: "9px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "hsl(var(--foreground) / 0.65)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Study Tool
                    </Link>
                    <button
                      onClick={logout}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "9px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#dc2626",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fef2f2")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : landing ? (
            /* Landing page only: Log in + Sign up */
            <>
              <Link
                href="/sign-in"
                className="hidden md:block"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "hsl(var(--muted-foreground))",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--foreground))")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--muted-foreground))")}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="hidden md:block"
                style={{
                  padding: "9px 20px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ffffff",
                  textDecoration: "none",
                  background: "#16a34a",
                  border: "1px solid #16a34a",
                  boxShadow: "0 1px 3px rgba(22, 163, 74, 0.20)",
                  transition: "background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#15803d";
                  e.currentTarget.style.borderColor = "#15803d";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(22, 163, 74, 0.28)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#16a34a";
                  e.currentTarget.style.borderColor = "#16a34a";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(22, 163, 74, 0.20)";
                }}
              >
                Sign up
              </Link>
            </>
          ) : null}

          {/* Dark mode toggle — curtain animation */}
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
                    onClick={
                      l.href === "/#features"
                        ? scrollToFeatures
                        : () => setOpen(false)
                    }
                    className="block rounded-lg transition-colors hover:bg-foreground/\[0.05\]"
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

              {user ? (
                /* Logged-in mobile actions */
                <li
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    marginTop: "4px",
                    paddingTop: "4px",
                  }}
                >
                  <button
                    onClick={logout}
                    className="w-full rounded-lg text-left transition-colors hover:bg-red-50"
                    style={{
                      padding: "10px 12px",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#dc2626",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Log out
                  </button>
                </li>
              ) : landing ? (
                /* Landing mobile: Log in + Sign up */
                <li
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    marginTop: "4px",
                    paddingTop: "4px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg transition-colors hover:bg-foreground/\[0.05\]"
                    style={{
                      padding: "10px 12px",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "hsl(var(--foreground) / 0.65)",
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg transition-colors hover:bg-foreground/\[0.05\]"
                    style={{
                      padding: "10px 12px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#15803d",
                    }}
                  >
                    Sign up
                  </Link>
                </li>
              ) : null}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
