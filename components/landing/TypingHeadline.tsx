"use client";

import { useState, useEffect } from "react";

const FULL_TEXT = "Welcome Tesla STEM Pythons";
const INTERVAL_MS = 50;

export function TypingHeadline() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(FULL_TEXT);
      setDone(true);
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(FULL_TEXT.slice(0, i));
      if (i === FULL_TEXT.length) {
        clearInterval(id);
        setDone(true);
      }
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full flex justify-center overflow-hidden">
      <h1
        className="font-display font-extrabold leading-[1.15] tracking-[-0.02em] text-4xl md:text-5xl lg:text-6xl"
        style={{
          background: "linear-gradient(to right, #16a34a, #22d3ee)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          display: "inline",
          whiteSpace: "nowrap",
        }}
        aria-label={FULL_TEXT}
      >
        {displayed}
        {!done && (
          <span
            aria-hidden
            style={{
              WebkitTextFillColor: "#22d3ee",
              color: "#22d3ee",
              animation: "blink 1.1s step-start infinite",
              marginLeft: "0.05em",
            }}
          >
            |
          </span>
        )}
      </h1>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
