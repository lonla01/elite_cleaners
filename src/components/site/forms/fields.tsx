import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Accessible form fields: every input has a visible label, hint and error are linked with
 * aria-describedby, and invalid fields set aria-invalid. Optional fields are marked as such.
 */

const control =
  "block w-full rounded-sm border border-ink/25 bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus:border-ink focus:outline-2 focus:outline-offset-2 focus:outline-navy-700 aria-invalid:border-red-700";

type BaseProps = {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  optionalLabel?: string;
  className?: string;
};

function describedBy(name: string, hint?: string, error?: string) {
  return [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
}

function Label({
  name,
  label,
  optionalLabel,
}: Pick<BaseProps, "name" | "label" | "optionalLabel">) {
  return (
    <label htmlFor={name} className="block text-sm font-medium text-ink">
      {label}
      {optionalLabel && <span className="ml-1 font-normal text-muted">({optionalLabel})</span>}
    </label>
  );
}

function Messages({ name, hint, error }: Pick<BaseProps, "name" | "hint" | "error">) {
  return (
    <>
      {hint && (
        <p id={`${name}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </>
  );
}

export function TextField({
  name,
  label,
  hint,
  error,
  optionalLabel,
  className,
  ...props
}: BaseProps & Omit<ComponentProps<"input">, "name">) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label name={name} label={label} optionalLabel={optionalLabel} />
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={control}
        {...props}
      />
      <Messages name={name} hint={hint} error={error} />
    </div>
  );
}

export function TextAreaField({
  name,
  label,
  hint,
  error,
  optionalLabel,
  className,
  ...props
}: BaseProps & Omit<ComponentProps<"textarea">, "name">) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label name={name} label={label} optionalLabel={optionalLabel} />
      <textarea
        id={name}
        name={name}
        rows={6}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={control}
        {...props}
      />
      <Messages name={name} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({
  name,
  label,
  hint,
  error,
  optionalLabel,
  className,
  children,
  ...props
}: BaseProps & Omit<ComponentProps<"select">, "name">) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label name={name} label={label} optionalLabel={optionalLabel} />
      <select
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, hint, error)}
        className={cn(control, "appearance-auto")}
        {...props}
      >
        {children}
      </select>
      <Messages name={name} hint={hint} error={error} />
    </div>
  );
}

/** Radio buttons or checkboxes in a fieldset with a legend. */
export function ChoiceGroup({
  name,
  label,
  hint,
  error,
  optionalLabel,
  className,
  type,
  options,
  defaultValue,
  required,
}: BaseProps & {
  type: "radio" | "checkbox";
  options: { value: string; label: string }[];
  defaultValue?: string | string[];
  required?: boolean;
}) {
  const selected = new Set([defaultValue ?? []].flat());
  return (
    <fieldset
      className={cn("space-y-3", className)}
      aria-describedby={describedBy(name, hint, error)}
      aria-invalid={error ? true : undefined}
    >
      <legend className="text-sm font-medium text-ink">
        {label}
        {optionalLabel && <span className="ml-1 font-normal text-muted">({optionalLabel})</span>}
      </legend>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex min-h-11 items-center gap-3 text-body">
            <input
              type={type}
              name={name}
              value={option.value}
              defaultChecked={selected.has(option.value)}
              required={type === "radio" ? required : undefined}
              className="size-5 accent-navy-900"
            />
            {option.label}
          </label>
        ))}
      </div>
      <Messages name={name} hint={hint} error={error} />
    </fieldset>
  );
}

export function CheckboxField({
  name,
  error,
  children,
  defaultChecked,
  required,
}: {
  name: string;
  error?: string;
  children: ReactNode;
  defaultChecked?: boolean;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <input
          id={name}
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 accent-navy-900"
        />
        <label htmlFor={name} className="text-sm text-body">
          {children}
        </label>
      </div>
      <Messages name={name} error={error} />
    </div>
  );
}

/**
 * Honeypot: hidden from people (visually and from assistive technology) but visible to naive
 * bots. A filled honeypot makes the server silently discard the submission.
 */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Website</label>
      <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}
