"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getUser } from "@/lib/localStorage";
import type { StoredUser } from "@/lib/localStorage";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/study", label: "Study Tool" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar({ landing = false }: { landing?: boolean }) {
  const router = useRouter();
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
          maxWidth: "860px",
          margin: "16px auto 0",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          gap: "40px",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,0,0,0.08)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          boxShadow: scrolled
            ? "0 4px 20px rgba(0,0,0,0.08)"
            : "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <Logo />

        <ul
          style={{
            fontSize: "16px",
            display: "flex",
            gap: "36px",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="hidden md:flex"
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group relative transition-colors duration-150 ease-out"
                style={{ color: "#374151", fontSize: "16px", fontWeight: 500, lineHeight: 1 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
              >
                {l.label}
                <span
                  aria-hidden
                  className="absolute left-1/2 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  style={{ background: "#8dc63f", bottom: "-8px" }}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div
          style={{
            marginLeft: "auto",
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
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#374151",
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
                    background: "linear-gradient(135deg, #8dc63f, #2563a8)",
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
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
                      padding: "6px",
                      zIndex: 60,
                    }}
                  >
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "block",
                        padding: "8px 12px",
                        borderRadius: "9px",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#374151",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      Dashboard
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
                href="/login"
                className="hidden md:block"
                style={{
                  padding: "8px 16px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#6b7280",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="hidden md:block"
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#8dc63f",
                  textDecoration: "none",
                  background: "transparent",
                  border: "1.5px solid #8dc63f",
                  transition: "background-color 150ms ease, color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#8dc63f";
                  e.currentTarget.style.color = "#0f2338";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#8dc63f";
                }}
              >
                Sign up
              </Link>
            </>
          ) : null}

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-full md:hidden"
            style={{ height: "44px", width: "44px", color: "#374151" }}
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
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <ul className="flex flex-col gap-1 p-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg transition-colors hover:bg-black/[0.04]"
                    style={{
                      padding: "10px 12px",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#374151",
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
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg transition-colors hover:bg-black/[0.04]"
                    style={{
                      padding: "10px 12px",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "#374151",
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="block rounded-lg transition-colors hover:bg-black/[0.04]"
                    style={{
                      padding: "10px 12px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#6fa832",
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
