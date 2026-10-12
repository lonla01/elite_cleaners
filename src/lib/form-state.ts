/** Result of a public form server action, shared by the server and the form components. */
export type FormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      /** Shown above the form (rate limit, server error). */
      message?: string;
      fieldErrors: Record<string, string>;
      /** Submitted values, to refill the form (React resets forms after an action). */
      values: Record<string, string | string[]>;
      /** Changes on every failed submission, so the form remounts with `values`. */
      attempt: number;
    };

export const initialFormState: FormState = { status: "idle" };
