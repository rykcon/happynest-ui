// src/components/ui/button/Button.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";

import { cn } from "../../../lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "rounded-outline"
  | "ghost"
  | "destructive"
  | "link"
  | "default";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon" | "icon-sm";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
};

// Button mode (no href)
export type ButtonAsButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: never;
  };

// Link mode (href present)
export type ButtonAsLinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href"> & {
    href: string;
    disabled?: boolean; // we support disabled semantics for links
  };

export type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors ring-offset-background " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-theme-xs hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        default: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "rounded-outline":
          "border border-input bg-transparent text-foreground rounded-full hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-8 px-2 text-xs",
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin", className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 0 1 8-8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      className,
      variant = "primary",
      size = "md",
      startIcon,
      endIcon,
      icon,
      isLoading = false,
      children,
      ...rest
    } = props as ButtonProps;

    // shared content rules
    const iconSizes = size === "icon" || size === "icon-sm";
    const resolvedStartIcon = iconSizes ? null : startIcon ?? icon ?? null;
    const resolvedEndIcon = iconSizes ? null : endIcon ?? null;
    const iconOnlyContent = iconSizes ? (icon ?? startIcon ?? children ?? null) : null;

    // LINK MODE
    if ("href" in props && typeof props.href === "string") {
      const { href, disabled, onClick, ...aProps } = rest as Omit<
        ButtonAsLinkProps,
        keyof CommonProps
      >;

      const isDisabled = Boolean(disabled || isLoading);

      return (
        <Link
          href={isDisabled ? "#" : href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={cn(buttonVariants({ variant, size, className }), isDisabled && "opacity-50")}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : (aProps as any).tabIndex}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            (onClick as any)?.(e);
          }}
          {...(aProps as any)}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Spinner />
              <span className="sr-only">Loading</span>
              <span aria-hidden="true" className={cn(iconSizes ? "hidden" : "")}>
                {children}
              </span>
            </span>
          ) : iconSizes ? (
            <span className="flex items-center justify-center">{iconOnlyContent}</span>
          ) : (
            <>
              {resolvedStartIcon ? <span className="flex items-center">{resolvedStartIcon}</span> : null}
              {children}
              {resolvedEndIcon ? <span className="flex items-center">{resolvedEndIcon}</span> : null}
            </>
          )}
        </Link>
      );
    }

    // BUTTON MODE
    const { disabled, type, ...btnProps } = rest as Omit<ButtonAsButtonProps, keyof CommonProps>;
    const isDisabled = Boolean(disabled || isLoading);

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? "button"}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={isDisabled}
        {...btnProps}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <Spinner />
            <span className="sr-only">Loading</span>
            <span aria-hidden="true" className={cn(iconSizes ? "hidden" : "")}>
              {children}
            </span>
          </span>
        ) : iconSizes ? (
          <span className="flex items-center justify-center">{iconOnlyContent}</span>
        ) : (
          <>
            {resolvedStartIcon ? <span className="flex items-center">{resolvedStartIcon}</span> : null}
            {children}
            {resolvedEndIcon ? <span className="flex items-center">{resolvedEndIcon}</span> : null}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
