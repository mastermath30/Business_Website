"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CountUpOptions {
  duration?: number;
  delay?: number;
  format?: (n: number) => string;
}

export function useCountUp<T extends HTMLElement>(
  target: number,
  { duration = 1.6, delay = 0, format }: CountUpOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fmt = format ?? ((n: number) => String(n));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      el.textContent = fmt(target);
      return;
    }

    const obj = { v: 0 };
    el.textContent = fmt(0);

    const tween = gsap.to(obj, {
      v: target,
      duration,
      delay,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => {
        el.textContent = fmt(Math.round(obj.v));
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [target, duration, delay, format]);

  return ref;
}
