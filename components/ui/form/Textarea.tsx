// src/components/ui/form/Textarea.tsx
"use client";

import * as React from "react";

/**
 * Textarea - Standardized multiline text input
 *
 * Usage:
 * <Textarea
 *   value={description}
 *   onChange={(e) => setDescription(e.target.value)}
 *   placeholder="Enter description..."
 *   rows={4}
 * />
 */

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  /** Current value */
  value?: string;

  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /** Error state */
  error?: boolean;

  /** Auto-resize to fit content */
  autoResize?: boolean;

  /** Max height when auto-resizing */
  maxHeight?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      error,
      autoResize,
      maxHeight = 400,
      className,
      rows = 3,
      ...rest
    } = props;

    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    // Auto-resize logic
    React.useEffect(() => {
      if (!autoResize || !textareaRef.current) return;

      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }, [value, autoResize, maxHeight]);

    // Combine refs
    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const baseClasses =
      "w-full rounded-lg px-3 py-2 text-sm transition-colors resize-y";

    const stateClasses = error
      ? "border-red-300 bg-red-50 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200 dark:placeholder-red-500"
      : "border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white dark:placeholder-gray-500";

    const focusClasses = "focus:outline-none focus:ring-2 focus:ring-opacity-50";

    const disabledClasses = "disabled:cursor-not-allowed disabled:opacity-50";

    return (
      <textarea
        ref={setRefs}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`${baseClasses} ${stateClasses} ${focusClasses} ${disabledClasses} ${className || ""}`}
        {...rest}
      />
    );
  }
);

Textarea.displayName = "Textarea";
