"use client";

import { useActionState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { initialFormState } from "@/lib/form-state";
import { submitApplication } from "@/server/actions/careers";
import {
  CheckboxField,
  ChoiceGroup,
  Honeypot,
  SelectField,
  TextAreaField,
  TextField,
} from "./fields";
import { ErrorSummary, SubmitButton, SuccessPanel } from "./form-parts";

const languages = ["lb", "fr", "de", "en", "pt", "other"] as const;
const availabilities = [
  "full-time",
  "part-time",
  "mornings",
  "evenings",
  "weekends",
  "flexible",
] as const;

export function CareersForm() {
  const t = useTranslations("Forms");
  const tc = useTranslations("Careers");
  const locale = useLocale();
  const [state, action] = useActionState(submitApplication, initialFormState);

  if (state.status === "success") {
    return (
      <SuccessPanel title={tc("successTitle")}>
        <p>{tc("successBody")}</p>
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
    ["name", "email", "phone", "languages", "availability", "cv", "message", "consent"].map((f) => [
      f,
      t(`fields.${f}`),
    ]),
  );

  return (
    <form key={failed?.attempt} action={action} noValidate className="relative space-y-6">
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
          className="sm:col-span-2"
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
          autoComplete="tel"
          required
          defaultValue={value("phone")}
          error={errors.phone}
        />
      </div>

      <ChoiceGroup
        type="checkbox"
        name="languages"
        label={t("fields.languages")}
        hint={t("hints.languages")}
        defaultValue={failed?.values.languages}
        error={errors.languages}
        options={languages.map((l) => ({ value: l, label: t(`options.languages.${l}`) }))}
      />

      <SelectField
        name="availability"
        label={t("fields.availability")}
        required
        defaultValue={value("availability") ?? ""}
        error={errors.availability}
      >
        <option value="" disabled>
          {t("options.selectPlaceholder")}
        </option>
        {availabilities.map((a) => (
          <option key={a} value={a}>
            {t(`options.availability.${a}`)}
          </option>
        ))}
      </SelectField>

      <TextField
        name="cv"
        type="file"
        label={t("fields.cv")}
        optionalLabel={optional}
        hint={t("hints.cv")}
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        error={errors.cv}
      />

      <TextAreaField
        name="message"
        label={t("fields.message")}
        optionalLabel={optional}
        rows={4}
        defaultValue={value("message")}
        error={errors.message}
      />

      <CheckboxField
        name="consent"
        required
        defaultChecked={value("consent") === "on"}
        error={errors.consent}
      >
        {t.rich("consentCareers", {
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
