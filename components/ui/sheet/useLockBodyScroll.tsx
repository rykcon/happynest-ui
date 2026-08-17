// src/components/ui/sheet/useLockBodyScroll.ts
"use client";

import { useEffect } from "react";

export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    const body = document.body;

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, [locked]);
}