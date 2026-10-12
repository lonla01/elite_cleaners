"use client";

import { useActionState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { initialFormState } from "@/lib/form-state";
import { submitContact } from "@/server/actions/contact";
import {
  CheckboxField,
  ChoiceGroup,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields";
import { ErrorSummary, SubmitButton, SuccessPanel } from "./form-parts";

type Option = { value: string; label: string };

const propertyTypes = ["apartment", "house", "office", "retail", "medical", "other"] as const;

/**
 * Quote request form. `?service=<id>` and `?area=<commune id>` (from service and area pages)
 * preselect the service and location.
 */
export function ContactForm({
  serviceGroups,
  areas,
  phone,
}: {
  serviceGroups: { label: string; options: Option[] }[];
  areas: Record<string, string>;
  phone: string;
}) {
  const t = useTranslations("Forms");
  const tc = useTranslations("Contact");
  const locale = useLocale();
  const [state, action] = useActionState(submitContact, initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Read the query after hydration so the page itself stays static. Fields are set directly
    // (no re-render), so nothing the visitor has already typed is lost.
    const form = formRef.current;
    if (!form) return;
    const query = new URLSearchParams(window.location.search);
    const service = form.elements.namedItem("service");
    const location = form.elements.namedItem("location");
    const serviceId = query.get("service");
    const area = query.get("area");
    if (service instanceof HTMLSelectElement && !service.value && serviceId) {
      if ([...service.options].some((o) => o.value === serviceId)) service.value = serviceId;
    }
    if (location instanceof HTMLInputElement && !location.value && area && areas[area]) {
      location.value = areas[area];
    }
  }, [areas]);

  if (state.status === "success") {
    return (
      <SuccessPanel title={tc("successTitle")}>
        <p>{tc("successBody")}</p>
        <p>{tc("successUrgent", { phone })}</p>
      </SuccessPanel>
    );
  }

  const failed = state.status === "error" ? state : undefined;
  const errors = failed?.fieldErrors ?? {};
  const value = (name: string) => {
    const v = failed?.values[name];
    return typeof v === "string" ? v : undefined;
  };
  const optional = t("optional");
  const fieldLabels = Object.fromEntries(
    [
      "name",
      "email",
      "phone",
      "company",
      "service",
      "propertyType",
      "location",
      "preferredContact",
      "message",
      "consent",
    ].map((f) => [f, t(`fields.${f}`)]),
  );

  return (
    <form
      key={failed?.attempt}
      ref={formRef}
      action={action}
      noValidate
      className="relative space-y-6"
    >
      {failed && (
        <ErrorSummary
          title={t("errors.summary")}
          message={failed.message}
          errors={errors}
          labels={fieldLabels}
        />
      )}
      <input type="hidden" name="locale" value={locale} />
      <Honeypot />

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label={t("fields.name")}
          autoComplete="name"
          required
          defaultValue={value("name")}
          error={errors.name}
        />
        <TextField
          name="email"
          type="email"
          label={t("fields.email")}
          autoComplete="email"
          required
          defaultValue={value("email")}
          error={errors.email}
        />
        <TextField
          name="phone"
          type="tel"
          label={t("fields.phone")}
          optionalLabel={optional}
          autoComplete="tel"
          hint={t("hints.phone")}
          defaultValue={value("phone")}
          error={errors.phone}
        />
        <TextField
          name="company"
          label={t("fields.company")}
          optionalLabel={optional}
          autoComplete="organization"
          defaultValue={value("company")}
          error={errors.company}
        />
        <SelectField
          name="service"
          label={t("fields.service")}
          optionalLabel={optional}
          defaultValue={value("service") ?? ""}
          error={errors.service}
        >
          <option value="">{t("options.serviceNotSure")}</option>
          {serviceGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </SelectField>
        <SelectField
          name="propertyType"
          label={t("fields.propertyType")}
          optionalLabel={optional}
          defaultValue={value("propertyType") ?? ""}
          error={errors.propertyType}
        >
          <option value="">{t("options.selectPlaceholder")}</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {t(`options.propertyType.${type}`)}
            </option>
          ))}
        </SelectField>
        <TextField
          name="location"
          label={t("fields.location")}
          optionalLabel={optional}
          hint={t("hints.location")}
          autoComplete="address-level2"
          defaultValue={value("location")}
          error={errors.location}
          className="sm:col-span-2"
        />
      </div>

      <ChoiceGroup
        type="radio"
        name="preferredContact"
        label={t("fields.preferredContact")}
        defaultValue={value("preferredContact") ?? "email"}
        error={errors.preferredContact}
        options={(["email", "phone", "whatsapp"] as const).map((v) => ({
          value: v,
          label: t(`options.preferredContact.${v}`),
        }))}
      />

      <TextAreaField
        name="message"
        label={t("fields.message")}
        hint={t("hints.message")}
        required
        defaultValue={value("message")}
        error={errors.message}
      />

      <CheckboxField
        name="consent"
        required
        defaultChecked={value("consent") === "on"}
        error={errors.consent}
      >
        {t.rich("consent", {
          link: (chunks) => (
            <Link href="/privacy" target="_blank" className="underline underline-offset-2">
              {chunks}
            </Link>
          ),
        })}
      </CheckboxField>

      <SubmitButton label={tc("submit")} pendingLabel={t("submitting")} />
    </form>
  );
}
