import { sql } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();

/** Uploaded files (CVs, later document PDFs). The bytes live in object storage. */
export const files = pgTable("files", {
  id: uuid().primaryKey().defaultRandom(),
  storageKey: text().notNull().unique(),
  filename: text().notNull(),
  contentType: text().notNull(),
  size: bigint({ mode: "number" }).notNull(),
  purpose: text({ enum: ["cv", "document"] }).notNull(),
  createdAt: createdAt(),
});

export const leadStatus = pgEnum("lead_status", [
  "new",
  "contacted",
  "quoted",
  "won",
  "lost",
  "spam",
]);

/** Quote requests from the public contact form. */
export const leads = pgTable(
  "leads",
  {
    id: uuid().primaryKey().defaultRandom(),
    createdAt: createdAt(),
    status: leadStatus().notNull().default("new"),
    locale: text().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text(),
    company: text(),
    /** Service id from content/services.json, or null for "not sure". */
    serviceId: text(),
    propertyType: text(),
    location: text(),
    preferredContact: text({ enum: ["email", "phone", "whatsapp"] })
      .notNull()
      .default("email"),
    message: text().notNull(),
    /** When the visitor accepted the privacy notice, and which version they saw. */
    consentAt: timestamp({ withTimezone: true }).notNull(),
    consentVersion: text().notNull(),
    source: text().notNull().default("contact-form"),
  },
  (t) => [index().on(t.createdAt), index().on(t.status)],
);

export const applicationStatus = pgEnum("application_status", [
  "new",
  "reviewing",
  "interview",
  "hired",
  "rejected",
]);

/** Job applications from the careers form. */
export const jobApplications = pgTable(
  "job_applications",
  {
    id: uuid().primaryKey().defaultRandom(),
    createdAt: createdAt(),
    status: applicationStatus().notNull().default("new"),
    locale: text().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text().notNull(),
    languages: text().array().notNull(),
    availability: text().notNull(),
    message: text(),
    cvFileId: uuid().references(() => files.id, { onDelete: "set null" }),
    consentAt: timestamp({ withTimezone: true }).notNull(),
    consentVersion: text().notNull(),
  },
  (t) => [index().on(t.createdAt)],
);

/** Fixed-window counters for rate limiting. Keys contain a hash, never a raw IP address. */
export const rateLimits = pgTable("rate_limits", {
  key: text().primaryKey(),
  count: integer().notNull(),
  windowStart: timestamp({ withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

/** Every email the application tries to send, for troubleshooting and the admin. */
export const emailLog = pgTable(
  "email_log",
  {
    id: uuid().primaryKey().defaultRandom(),
    createdAt: createdAt(),
    template: text().notNull(),
    to: text().notNull(),
    subject: text().notNull(),
    provider: text(),
    status: text({ enum: ["sent", "failed"] }).notNull(),
    error: text(),
    providerMessageId: text(),
    /** e.g. { "leadId": "..." } */
    related: jsonb().$type<Record<string, string>>(),
  },
  (t) => [index().on(t.createdAt)],
);
