"use client";

import { useState, useEffect } from "react";

interface TypingTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  /** Color of the blinking cursor — needed when text uses bg-clip-text/transparent */
  cursorColor?: string;
}

export function TypingText({
  text,
  className,
  style,
  cursorColor = "currentColor",
}: TypingTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, 50);

    return () => clearInterval(id);
  }, [text]);

  return (
    <h1 className={className} style={style} aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      {!done && (
        <span
          aria-hidden="true"
          className="typing-cursor"
          style={{ color: cursorColor }}
        >
          |
        </span>
      )}
    </h1>
  );
}
