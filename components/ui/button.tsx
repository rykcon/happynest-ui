import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "../../lib/utils"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        primary: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        "rounded-outline":
          "border border-border bg-background text-foreground rounded-full hover:bg-muted hover:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        md: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = VariantProps<typeof buttonVariants> & {
  asChild?: boolean
  icon?: React.ReactNode
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  isLoading?: boolean
}

type ButtonAsButtonProps = ButtonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type ButtonAsLinkProps = ButtonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
    disabled?: boolean
  }

type ButtonAllProps = ButtonAsButtonProps | ButtonAsLinkProps

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonAllProps
>(
  (props, ref) => {
    const {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      icon,
      startIcon,
      endIcon,
      isLoading = false,
      children,
      ...rest
    } = props

    const isLink = typeof (props as ButtonAsLinkProps).href === "string" && !asChild
    const Comp = asChild ? Slot : isLink ? "a" : "button"
    const isIconOnly = Boolean(icon) && !children && !startIcon && !endIcon
    const resolvedDisabled =
      Boolean((props as ButtonAsButtonProps).disabled) ||
      Boolean((props as ButtonAsLinkProps).disabled) ||
      isLoading
    const iconNode = isLoading ? <Spinner className="size-4" /> : icon
    const startIconNode = isLoading ? <Spinner className="size-4" /> : startIcon
    const showSpinner = isLoading && !isIconOnly && !startIcon

    const elementProps: Record<string, unknown> = { ...rest }

    if (isLink) {
      elementProps.href = (props as ButtonAsLinkProps).href
      if (resolvedDisabled) {
        elementProps["aria-disabled"] = true
        elementProps.tabIndex = -1
      }
    } else if (!asChild) {
      elementProps.disabled = resolvedDisabled
    } else {
      elementProps["aria-disabled"] = resolvedDisabled || undefined
    }

    return (
      <Comp
        ref={ref as never}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        aria-busy={isLoading || undefined}
        className={cn(buttonVariants({ variant, size, className }))}
        {...elementProps}
      >
        {isIconOnly ? (
          <span data-icon="inline-start" className="inline-flex items-center">
            {iconNode}
          </span>
        ) : (
          <span data-slot="button-content" className="inline-flex items-center gap-1.5">
            {showSpinner ? (
              <span data-icon="inline-start" className="inline-flex items-center">
                <Spinner className="size-4" />
              </span>
            ) : startIconNode ? (
              <span data-icon="inline-start" className="inline-flex items-center">
                {startIconNode}
              </span>
            ) : null}
            {children}
            {endIcon ? (
              <span data-icon="inline-end" className="inline-flex items-center">
                {endIcon}
              </span>
            ) : null}
          </span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonAllProps as ButtonProps }
