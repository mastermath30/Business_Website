"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

export interface AppBarProps {
  logo?: ReactNode;
  appName?: string;
  onSearch?: (query: string) => void;
  userAvatar?: ReactNode;
  userName?: string;
}

export interface ThemeToggleProps {
  variant?: "default" | "appbar" | "icon";
  appBarProps?: AppBarProps;
  defaultTheme?: Theme;
  barHeight?: number;
  buttonSize?: number;
  duration?: number;
  onThemeChange?: (theme: Theme) => void;
  children?: ReactNode;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
// Button colors are tuned so the icon variant contrasts with this site's
// existing navbar background (light mode: dark button; dark mode: light button).

interface TokenSet {
  pageBg: string;
  pageText: string;
  barBg: string;
  barText: string;
  barBorder: string;
  btnBg: string;
  btnText: string;
  btnRing: string;
  inputBg: string;
  inputText: string;
}

const TOKENS: Record<Theme, TokenSet> = {
  light: {
    pageBg: "#ffffff",
    pageText: "#1a1a1a",
    barBg: "#1a1a1a",
    barText: "#ffffff",
    barBorder: "rgba(255,255,255,0.07)",
    btnBg: "#1a1a1a",
    btnText: "#f3ede1",
    btnRing: "rgba(0,0,0,0.10)",
    inputBg: "rgba(255,255,255,0.1)",
    inputText: "#ffffff",
  },
  dark: {
    pageBg: "#0a0a0a",
    pageText: "#dfd8c6",
    barBg: "#dfd8c6",
    barText: "#1a1a1a",
    barBorder: "rgba(0,0,0,0.10)",
    btnBg: "#f3ede1",
    btnText: "#1a1a1a",
    btnRing: "rgba(255,255,255,0.15)",
    inputBg: "rgba(0,0,0,0.08)",
    inputText: "#1a1a1a",
  },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function MoonIcon() {
  return (
    <svg
      width="15" height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="15" height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type CurtainPhase = "idle" | "falling" | "rising";

const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

export function ThemeToggle({
  variant = "default",
  appBarProps,
  defaultTheme = "light",
  barHeight: explicitBarHeight,
  buttonSize = 36,
  duration = 550,
  onThemeChange,
  children,
}: ThemeToggleProps) {
  const isAppBar = variant === "appbar";
  const isIcon = variant === "icon";
  const barHeight = explicitBarHeight ?? (isAppBar ? 60 : 44);

  // Integrate with next-themes (already configured site-wide in AppProviders).
  // This keeps the curtain toggle in sync with any other theme controls and
  // gets localStorage persistence for free.
  const { resolvedTheme, setTheme: setNextTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const theme: Theme = mounted
    ? resolvedTheme === "dark"
      ? "dark"
      : "light"
    : defaultTheme;

  const [phase, setPhase] = useState<CurtainPhase>("idle");
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const curtainColorRef = useRef<string>("");
  const t = TOKENS[theme];

  const toggle = useCallback(() => {
    if (phase !== "idle") return;
    const next: Theme = theme === "light" ? "dark" : "light";

    const applyTheme = () => {
      setNextTheme(next);
      onThemeChange?.(next);
    };

    // View Transitions API: browser takes a bitmap snapshot of the old page,
    // applies the new theme, then animates via ::view-transition-* pseudo-elements.
    // The CSS in globals.css clips the new layer in from top→bottom, so
    // content above the edge is new-theme and content below is still old-theme.
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      setPhase("falling"); // block re-clicks during transition
      const vt = (document as Document & {
        startViewTransition: (cb: () => void) => { finished: Promise<void> };
      }).startViewTransition(applyTheme);
      vt.finished.then(() => setPhase("idle")).catch(() => setPhase("idle"));
      return;
    }

    // Fallback for browsers without View Transitions (Firefox etc.)
    curtainColorRef.current = TOKENS[next].pageBg;
    applyTheme();
    setPhase("falling");
    setTimeout(() => {
      setPhase("rising");
      setTimeout(() => setPhase("idle"), duration + 60);
    }, duration);
  }, [phase, theme, duration, onThemeChange, setNextTheme]);

  // ── Derived styles ──────────────────────────────────────────────────────────

  const pageStyle: CSSProperties = {
    minHeight: "100vh",
    paddingTop: barHeight,
    background: t.pageBg,
    color: t.pageText,
    transition: "background 0.3s ease, color 0.3s ease",
  };

  const barStyle: CSSProperties = {
    position: "fixed",
    top: 0, left: 0, right: 0,
    height: barHeight,
    background: t.barBg,
    color: t.barText,
    borderBottom: `1px solid ${t.barBorder}`,
    overflow: "visible",
    zIndex: 9998,
    transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
    display: isAppBar ? "flex" : "block",
    alignItems: "center",
    justifyContent: "space-between",
    padding: isAppBar ? "0 24px" : "0",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const btnScale = pressed ? 0.96 : hovered ? 1.1 : 1;
  const btnStyle: CSSProperties = {
    position: isAppBar || isIcon ? "relative" : "absolute",
    bottom: isAppBar || isIcon ? "auto" : -(buttonSize / 2),
    left: isAppBar || isIcon ? "auto" : "50%",
    transform: isAppBar || isIcon ? `scale(${btnScale})` : `translateX(-50%) scale(${btnScale})`,
    width: buttonSize,
    height: buttonSize,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: t.btnBg,
    color: t.btnText,
    boxShadow: `0 0 0 1.5px ${t.btnRing}`,
    zIndex: 9999,
    outline: "none",
    transition:
      "background 0.3s ease, color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease",
    marginLeft: isAppBar ? "16px" : "0",
    flexShrink: 0,
  };

  const curtainStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: curtainColorRef.current,
    // Low opacity so the page content (text, buttons, headings) stays
    // visible underneath and the user sees the theme transition happening
    // in real time. The curtain is just a directional wipe cue, not a blanket.
    opacity: 0.2,
    transformOrigin: "top",
    transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
    transition:
      phase !== "idle" ? `transform ${duration}ms ${EASING}` : "none",
    zIndex: 9997,
    pointerEvents: "none",
  };

  const appBarSectionStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  // Reserve space during SSR so there is no layout shift after hydration.
  if (!mounted && isIcon) {
    return (
      <div
        aria-hidden
        style={{ width: buttonSize, height: buttonSize, flexShrink: 0 }}
      />
    );
  }

  if (isIcon) {
    return (
      <>
        {/* Portal the curtain to document.body so it escapes any transformed
            or backdrop-filtered ancestor (e.g., the navbar) and covers the
            full viewport. */}
        {mounted &&
          createPortal(
            <div aria-hidden="true" style={curtainStyle} />,
            document.body
          )}
        <button
          style={btnStyle}
          onClick={toggle}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setPressed(false); }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-pressed={theme === "dark"}
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>
      </>
    );
  }

  return (
    <div style={pageStyle}>
      <div aria-hidden="true" style={curtainStyle} />

      <div style={barStyle}>
        {isAppBar && (
          <div style={{ ...appBarSectionStyle, flex: 1 }}>
            {appBarProps?.logo && (
              <div style={{ display: "flex", alignItems: "center" }}>
                {appBarProps.logo}
              </div>
            )}
            {appBarProps?.appName && (
              <span style={{ fontWeight: 600, fontSize: "1.1rem", letterSpacing: "-0.01em" }}>
                {appBarProps.appName}
              </span>
            )}
          </div>
        )}

        {isAppBar && appBarProps?.onSearch && (
          <div style={{ ...appBarSectionStyle, flex: 1, justifyContent: "center" }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: "320px",
              display: "flex",
              alignItems: "center",
            }}>
              <div style={{ position: "absolute", left: "12px", display: "flex", opacity: 0.6 }}>
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => appBarProps.onSearch?.(e.target.value)}
                style={{
                  width: "100%",
                  height: "36px",
                  padding: "0 16px 0 36px",
                  borderRadius: "18px",
                  border: "none",
                  outline: "none",
                  background: t.inputBg,
                  color: t.inputText,
                  fontSize: "0.9rem",
                  transition: "background 0.3s ease, color 0.3s ease",
                }}
              />
            </div>
          </div>
        )}

        {isAppBar && (
          <div style={{ ...appBarSectionStyle, flex: 1, justifyContent: "flex-end" }}>
            {appBarProps?.userName && (
              <span style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                {appBarProps.userName}
              </span>
            )}
            {appBarProps?.userAvatar !== undefined ? (
              appBarProps.userAvatar
            ) : (
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: t.inputBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: t.inputText,
              }}>
                <UserIcon />
              </div>
            )}

            <button
              style={btnStyle}
              onClick={toggle}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => { setHovered(false); setPressed(false); }}
              onMouseDown={() => setPressed(true)}
              onMouseUp={() => setPressed(false)}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              aria-pressed={theme === "dark"}
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
        )}

        {!isAppBar && (
          <button
            style={btnStyle}
            onClick={toggle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false); }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            aria-pressed={theme === "dark"}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
