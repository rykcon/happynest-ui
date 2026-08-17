// src/components/ui/speed-dial/SpeedDial.tsx
"use client";

import * as React from "react";
import { Button } from "../button";

export type SpeedDialAction = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "destructive";
  isLoading?: boolean;
};

export type SpeedDialProps = {
  actions: SpeedDialAction[];
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  variant?: "floating" | "inline" | "sticky";
  size?: "sm" | "md" | "lg";
};

export function SpeedDial({
  actions,
  triggerLabel = "Actions",
  triggerIcon,
  direction = "down",
  variant = "inline",
  size = "md",
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const getMenuPositionClasses = () => {
    const base = "absolute z-50";

    switch (direction) {
      case "up":
        return `${base} bottom-full mb-2 right-0`;
      case "down":
        return `${base} top-full mt-2 right-0`;
      case "left":
        return `${base} right-full mr-2 top-0`;
      case "right":
        return `${base} left-full ml-2 top-0`;
      default:
        return `${base} top-full mt-2 right-0`;
    }
  };

  const getContainerClasses = () => {
    if (variant === "floating") {
      return "fixed bottom-6 right-6 z-40";
    }
    if (variant === "sticky") {
      return "sticky top-4 right-0 z-40 inline-block";
    }
    return "relative inline-block";
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      case "md":
      default:
        return "h-10 w-10";
    }
  };

  return (
    <div ref={containerRef} className={getContainerClasses()}>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size={size}
        aria-label={triggerLabel}
      >
        {triggerIcon}
      </Button>

      {/* Actions Menu */}
      {isOpen && (
        <div className={getMenuPositionClasses()}>
          <div className="min-w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg dark:border-white/[0.08] dark:bg-gray-900">
            <div className="flex flex-col p-2">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  disabled={action.disabled || action.isLoading}
                  variant={action.variant === "destructive" ? "destructive" : action.variant === "primary" ? "primary" : "secondary"}
                  className={`
                    flex items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium
                    transition-colors
                    ${
                      action.variant === "destructive"
                        ? "text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        : action.variant === "primary"
                        ? "text-primary hover:bg-primary/10"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/[0.05]"
                    }
                    ${action.disabled || action.isLoading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                  <span className="flex-1">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
