// src/components/ui/modal/Modal.tsx
"use client";

import * as React from "react";
import { useEffect, useId } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "../../../lib/utils";

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "description"> {
  isOpen?: boolean;
  open?: boolean; // alias for compatibility
  onClose: () => void;

  /** Optional: render a title (used for aria-labelledby) */
  title?: React.ReactNode;
  /** Optional: render a description (used for aria-describedby) */
  description?: React.ReactNode;

  /** Close button */
  showCloseButton?: boolean;

  /** Fullscreen mode (mobile sheets, etc.) */
  isFullscreen?: boolean;

  /** Close on overlay click */
  closeOnOverlayClick?: boolean;

  /** Close on Escape key */
  closeOnEsc?: boolean;

  /** Lock body scroll while open */
  lockScroll?: boolean;

  /** Auto-focus modal on open */
  autoFocus?: boolean;

  children: React.ReactNode;
}

/**
 * Modal improvements:
 * - tokenized colors (bg-background / border-border / text-foreground)
 * - accessibility: role="dialog", aria-modal, labelledby/describedby
 * - focus management: basic focus trap + restore focus on close
 * - optional behaviors: overlay click, ESC, scroll lock
 * - supports fullscreen layout without changing overlay behavior
 */
export function Modal({
  isOpen,
  open,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  lockScroll = true,
  autoFocus = true,
  ...rest
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const resolvedOpen = isOpen ?? open ?? false;

  // Optional scroll lock override
  useEffect(() => {
    if (!lockScroll) return;
    if (!resolvedOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [resolvedOpen, lockScroll]);

  // Radix handles focus trapping and escape by default.

  const panelBase = cn(
    // common
    "relative outline-none",
    // tokenized surface
    "bg-background text-foreground border border-border shadow-theme-lg",
    className,
  );

  return (
    <Dialog.Root
      open={resolvedOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50",
            "bg-black/40 backdrop-blur-[12px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          )}
          onPointerDown={(event) => {
            if (!closeOnOverlayClick) event.preventDefault();
          }}
        />
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50",
            "translate-x-[-50%] translate-y-[-50%]",
            panelBase,
            isFullscreen
              ? "h-[100dvh] w-[100dvw] rounded-none"
              : "w-[min(720px,calc(100vw-2rem))] rounded-2xl",
          )}
          onEscapeKeyDown={(event) => {
            if (!closeOnEsc) event.preventDefault();
          }}
          onOpenAutoFocus={(event) => {
            if (!autoFocus) event.preventDefault();
          }}
          {...rest}
        >
          {showCloseButton ? (
            <Dialog.Close
              className={cn(
                "absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full",
                "border border-border bg-muted text-muted-foreground",
                "hover:bg-muted/70 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isFullscreen ? "right-4 top-4" : "sm:right-4 sm:top-4",
              )}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          ) : null}

          <div className={cn(isFullscreen ? "px-6 pt-6" : "px-6 pt-6")}>
            {title ? (
              <Dialog.Title id={titleId} className="text-base font-semibold">
                {title}
              </Dialog.Title>
            ) : (
              <Dialog.Title id={titleId} className="sr-only">
                Modal
              </Dialog.Title>
            )}
            {description ? (
              <Dialog.Description id={descId} className="mt-1 text-sm text-muted-foreground">
                {description}
              </Dialog.Description>
            ) : null}
          </div>

          <div className={cn(isFullscreen ? "h-full" : "")}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
