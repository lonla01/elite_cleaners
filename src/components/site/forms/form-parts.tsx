"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../button";

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="accent" size="lg" disabled={pending} aria-disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

/** Error summary shown after a failed submission. Receives focus so it is announced. */
export function ErrorSummary({
  title,
  message,
  errors,
  labels,
}: {
  title: string;
  message?: string;
  errors: Record<string, string>;
  labels: Record<string, string>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), [errors, message]);
  const entries = Object.entries(errors);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="space-y-3 border-l-4 border-red-700 bg-white p-5 outline-none"
    >
      <p className="font-medium text-ink">{message ?? title}</p>
      {entries.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {entries.map(([field, error]) => (
            <li key={field}>
              <a href={`#${field}`} className="text-red-700 underline underline-offset-2">
                {labels[field] ? `${labels[field]}: ${error}` : error}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Success panel that replaces the form. Receives focus so it is announced. */
export function SuccessPanel({ title, children }: { title: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="space-y-4 border-t-2 border-brass-500 bg-white p-8 shadow-(--shadow-soft) outline-none"
    >
      <p className="font-serif text-3xl text-ink">{title}</p>
      <div className="space-y-3 text-body">{children}</div>
    </div>
  );
}
