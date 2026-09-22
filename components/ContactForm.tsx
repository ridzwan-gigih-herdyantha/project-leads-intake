"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { leadSchema, SERVICE_OPTIONS, type ServiceOption } from "@/lib/lead-schema";
import { dur, ease } from "@/lib/motion";

type FieldKey = "name" | "email" | "company" | "website" | "service" | "message";
type FieldErrors = Partial<Record<FieldKey, string>>;

type FormValues = {
  name: string;
  email: string;
  company: string;
  website: string;
  service: ServiceOption | "";
  message: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  website: "",
  service: "",
  message: "",
};

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FieldKey;
        if (key && !nextErrors[key]) nextErrors[key] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (res.ok) {
        setSubmitted(true);
        return;
      }

      if (res.status === 400) {
        const data = (await res.json().catch(() => null)) as
          | { errors?: FieldErrors }
          | null;
        if (data?.errors) setErrors(data.errors);
        setFormError("Something above needs a fix.");
      } else {
        setFormError("That didn't go through. Try again in a moment.");
      }
    } catch {
      setFormError("Network issue. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <SuccessCard name={values.name} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-card bg-card p-6 shadow-paper ring-1 ring-line/70 sm:p-8"
    >
      <div className="mb-6">
        <h2 className="font-display text-[22px] font-medium leading-tight text-ink sm:text-[26px]">
          Fill this out. I&apos;ll reply within one business day.
        </h2>
        <p className="mt-2 font-body text-[14px] italic text-slate">
          Your info is only used to reply. Never shared.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Name"
            name="name"
            required
            value={values.name}
            onChange={(v) => updateField("name", v)}
            error={errors.name}
            autoComplete="name"
            placeholder="Your first name"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={(v) => updateField("email", v)}
            error={errors.email}
            autoComplete="email"
            placeholder="you@email.com"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Company"
            hint="optional"
            name="company"
            value={values.company}
            onChange={(v) => updateField("company", v)}
            error={errors.company}
            autoComplete="organization"
            placeholder="If you have one"
          />
          <Field
            label="Website"
            hint="optional"
            name="website"
            value={values.website}
            onChange={(v) => updateField("website", v)}
            error={errors.website}
            autoComplete="url"
            placeholder="yoursite.com"
          />
        </div>

        <div>
          <label
            htmlFor="service"
            className="block font-display text-[14px] font-medium text-ink"
          >
            What do you need? <span className="text-cobalt">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              id="service"
              name="service"
              value={values.service}
              onChange={(e) =>
                updateField("service", e.target.value as ServiceOption | "")
              }
              aria-invalid={Boolean(errors.service)}
              aria-describedby={errors.service ? "service-error" : undefined}
              className={selectClass(Boolean(errors.service))}
            >
              <option value="" disabled>
                Pick one...
              </option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate"
            >
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
          {errors.service && (
            <p id="service-error" className="mt-1.5 text-[13px] text-danger">
              {errors.service}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block font-display text-[14px] font-medium text-ink"
          >
            Tell me about it <span className="text-cobalt">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => updateField("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={inputClass(Boolean(errors.message))}
            placeholder="What do you want to build? Who is it for? Any deadline or references?"
          />
          {errors.message && (
            <p id="message-error" className="mt-1.5 text-[13px] text-danger">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      {formError && (
        <div
          role="alert"
          className="mt-5 rounded-input border border-danger/30 bg-danger/5 px-3 py-2.5 font-body text-[14px] text-danger"
        >
          {formError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-button bg-highlighter px-6 py-3.5 font-display text-[15px] font-semibold text-ink shadow-[0_1px_0_rgba(18,19,26,0.08),0_10px_24px_-14px_rgba(255,222,89,0.9)] outline-none transition-[transform,box-shadow] duration-[140ms] hover:shadow-[0_1px_0_rgba(18,19,26,0.08),0_14px_28px_-14px_rgba(255,222,89,1)] focus-visible:shadow-focus active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {submitting ? "Sending..." : "Send"}
      </button>
      <p className="mt-3 font-body text-[13px] italic text-slate">
        By sending, you agree I can keep your email so I can reply.
      </p>
    </form>
  );
}

function SuccessCard({ name }: { name: string }) {
  const reduce = useReducedMotion();
  const firstName = name.trim().split(/\s+/)[0] || "there";

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-card bg-card p-8 shadow-paper ring-1 ring-line/70 sm:p-10"
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: dur.state, ease: ease.snap }}
        className="flex flex-col items-start gap-5"
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full bg-meadow/15"
          >
            <motion.svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              initial={false}
            >
              <motion.path
                d="M4.5 12.5L10 18L20 6.5"
                stroke="#25B47D"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: reduce ? 0 : 0.34,
                  delay: reduce ? 0 : 0.18,
                  ease: ease.out,
                }}
              />
            </motion.svg>
          </span>

          <div className="relative">
            <motion.span
              aria-hidden
              initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 1 }}
              animate={reduce ? { opacity: 1 } : { scaleX: 1 }}
              transition={{
                duration: reduce ? 0.16 : 0.38,
                delay: reduce ? 0 : 0.05,
                ease: ease.out,
              }}
              style={{ transformOrigin: "left center" }}
              className="absolute inset-x-[-6px] inset-y-[6px] -z-0 rounded-[3px] bg-highlighter"
            />
            <h3 className="relative z-10 font-display text-[26px] font-medium leading-tight text-ink sm:text-[30px]">
              Thanks, {firstName}.
            </h3>
          </div>
        </div>

        <p className="max-w-[52ch] font-body text-[16px] leading-relaxed text-ink">
          Your message is in. I&apos;ll reply to your email within one business
          day, usually faster. If it&apos;s urgent, just put <em>URGENT</em> in
          the subject when you reply.
        </p>

        <a
          href="/"
          className="font-display text-[14px] font-medium text-cobalt underline decoration-cobalt/40 underline-offset-4 hover:decoration-cobalt"
        >
          Send another message
        </a>
      </motion.div>
    </div>
  );
}

function baseFieldClass(hasError: boolean) {
  return [
    "mt-1.5 block w-full rounded-input border bg-white px-3.5 py-2.5 font-body text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-[140ms]",
    "placeholder:text-slate/70",
    hasError
      ? "border-danger/60 focus:border-danger focus:shadow-[0_0_0_3px_rgba(180,50,26,0.16)]"
      : "border-line hover:border-slate/70 focus:border-cobalt focus:shadow-focus",
  ].join(" ");
}

function inputClass(hasError: boolean) {
  return baseFieldClass(hasError);
}

function selectClass(hasError: boolean) {
  return [
    baseFieldClass(hasError),
    "appearance-none pr-9",
  ].join(" ");
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  hint?: string;
};

function Field({
  label,
  name,
  value,
  onChange,
  error,
  required,
  type = "text",
  placeholder,
  autoComplete,
  hint,
}: FieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label
        htmlFor={name}
        className="flex items-baseline justify-between font-display text-[14px] font-medium text-ink"
      >
        <span>
          {label} {required && <span className="text-cobalt">*</span>}
        </span>
        {hint && (
          <span className="font-body text-[12px] italic font-normal text-slate">
            {hint}
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={inputClass(Boolean(error))}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
