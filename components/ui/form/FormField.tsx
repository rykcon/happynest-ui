// src/components/ui/form/FormField.tsx
"use client";

import * as React from "react";
import { hnVars } from "../../../lib/ui/dynamic-style";

/**
 * FormField - Standardized form field wrapper
 *
 * Handles label, input, error, and help text in a consistent layout.
 * Supports required indicator, disabled state, and error styling.
 *
 * Usage:
 * <FormField label="Name" required error={errors.name}>
 *   <Input value={name} onChange={setName} />
 * </FormField>
 */

export interface FormFieldProps {
  /** Field label text */
  label?: string;

  /** Show required indicator (*) */
  required?: boolean;

  /** Error message to display */
  error?: string | null;

  /** Help text displayed below input */
  helpText?: string;

  /** Disabled state (dims label) */
  disabled?: boolean;

  /** Input element (Input, Select, Textarea, etc.) */
  children: React.ReactNode;

  /** Optional className for container */
  className?: string;

  /** Layout direction */
  layout?: "vertical" | "horizontal";

  /** Label width for horizontal layout */
  labelWidth?: string;
}

export function FormField(props: FormFieldProps) {
  const {
    label,
    required,
    error,
    helpText,
    disabled,
    children,
    className,
    layout = "vertical",
    labelWidth = "200px",
  } = props;

  const hasError = Boolean(error);

  if (layout === "horizontal") {
    return (
      <div className={`flex items-start gap-4 ${className || ""}`}>
        {label && (
          <label
            className="flex-shrink-0 w-[var(--hn-label-width)] pt-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            style={hnVars({ "--hn-label-width": labelWidth })}
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="flex-1 min-w-0">
          {children}
          {helpText && !hasError && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
          )}
          {hasError && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className || ""}>
      {label && (
        <label
          className={`mb-1.5 block text-sm font-medium ${
            disabled
              ? "text-gray-400 dark:text-gray-500"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      {children}

      {helpText && !hasError && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}

      {hasError && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/**
 * FormSection - Group related fields with a heading
 *
 * Usage:
 * <FormSection title="Contact Information" description="Primary contact details">
 *   <FormField label="Email">...</FormField>
 *   <FormField label="Phone">...</FormField>
 * </FormSection>
 */
export interface FormSectionProps {
  /** Section title */
  title?: string;

  /** Section description */
  description?: string;

  /** Form fields */
  children: React.ReactNode;

  /** Optional className */
  className?: string;
}

export function FormSection(props: FormSectionProps) {
  const { title, description, children, className } = props;

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {(title || description) && (
        <div className="border-b border-gray-200 pb-3 dark:border-white/[0.08]">
          {title && (
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">{children}</div>
    </div>
  );
}

/**
 * FormActions - Standard form action buttons
 *
 * Usage:
 * <FormActions
 *   onCancel={handleCancel}
 *   onSubmit={handleSubmit}
 *   submitLabel="Save"
 *   loading={isSaving}
 * />
 */
export interface FormActionsProps {
  /** Cancel handler */
  onCancel?: () => void;

  /** Submit handler */
  onSubmit?: () => void;

  /** Submit button label */
  submitLabel?: string;

  /** Cancel button label */
  cancelLabel?: string;

  /** Loading state (disables buttons, shows spinner) */
  loading?: boolean;

  /** Disable submit button */
  submitDisabled?: boolean;

  /** Alignment */
  align?: "left" | "right" | "center" | "between";

  /** Optional className */
  className?: string;
}

export function FormActions(props: FormActionsProps) {
  const {
    onCancel,
    onSubmit,
    submitLabel = "Save",
    cancelLabel = "Cancel",
    loading,
    submitDisabled,
    align = "right",
    className,
  } = props;

  const alignClass = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
    between: "justify-between",
  }[align];

  return (
    <div className={`flex items-center gap-3 ${alignClass} ${className || ""}`}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.08]"
        >
          {cancelLabel}
        </button>
      )}

      {onSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || submitDisabled}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      )}
    </div>
  );
}
