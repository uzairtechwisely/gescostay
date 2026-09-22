"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

import type { CampaignConfig, LeadFormField } from "@/lib/campaigns";
import { appendCampaignQueryParams } from "@/lib/campaigns";
import {
  getInitialLeadValues,
  validateLeadForm,
  type LeadFormValues,
  type LeadValidationErrors,
} from "@/lib/lead";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

type HumanHelpFormProps = {
  campaign: CampaignConfig;
};

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; referenceId: string }
  | { status: "error"; message: string };

function renderField(
  field: LeadFormField,
  value: string,
  error: string | undefined,
  onChange: (fieldKey: string, nextValue: string) => void,
) {
  const baseClassName =
    "mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-[var(--color-brand-ink)] outline-none transition placeholder:text-[var(--color-brand-muted)] focus:border-[var(--color-brand-primary)] focus:ring-4 focus:ring-[var(--color-brand-primary-soft)]";

  if (field.type === "select") {
    return (
      <select
        id={field.key}
        name={field.key}
        value={value}
        onChange={(event) => onChange(field.key, event.target.value)}
        className={`${baseClassName} ${error ? "border-red-500" : "border-[var(--color-brand-border)]"}`}
      >
        <option value="">{field.placeholder}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      id={field.key}
      name={field.key}
      type={field.type}
      inputMode={field.type === "tel" ? "tel" : undefined}
      autoComplete={
        field.key === "email"
          ? "email"
          : field.key === "phone"
            ? "tel"
            : undefined
      }
      placeholder={field.placeholder}
      value={value}
      onChange={(event) => onChange(field.key, event.target.value)}
      className={`${baseClassName} ${error ? "border-red-500" : "border-[var(--color-brand-border)]"}`}
    />
  );
}

export function HumanHelpForm({ campaign }: HumanHelpFormProps) {
  const searchParams = useSearchParams();
  const [values, setValues] = useState<LeadFormValues>(() =>
    getInitialLeadValues(campaign),
  );
  const [errors, setErrors] = useState<LeadValidationErrors>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: "idle",
  });
  const attribution = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const selfServeUrl = `${campaign.registrationUrl}?${appendCampaignQueryParams(
    campaign,
    attribution,
  ).toString()}`;

  function handleChange(fieldKey: string, nextValue: string) {
    setValues((current) => ({
      ...current,
      [fieldKey]: nextValue,
    }));

    setErrors((current) => ({
      ...current,
      [fieldKey]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateLeadForm(campaign, values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmissionState({
        status: "error",
        message: "Please check the highlighted fields and try again.",
      });
      return;
    }

    setSubmissionState({ status: "submitting" });
    trackEvent("lead_form_started", {
      campaign_id: campaign.campaignId,
      campaign_name: campaign.campaignName,
      audience_type: campaign.audienceType,
      country: campaign.country,
      city: campaign.city,
      platform: campaign.platform,
    });

    const payload = {
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
      audienceType: campaign.audienceType,
      country: campaign.country,
      city: campaign.city,
      formData: values,
      attribution: Object.fromEntries(attribution.entries()),
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        referenceId?: string;
        error?: string;
      };

      if (!response.ok || !data.referenceId) {
        throw new Error(
          data.error ??
            "We could not send your details just now. Please try again shortly.",
        );
      }

      setSubmissionState({
        status: "success",
        referenceId: data.referenceId,
      });

      trackEvent("lead_form_submit", {
        campaign_id: campaign.campaignId,
        campaign_name: campaign.campaignName,
        audience_type: campaign.audienceType,
        country: campaign.country,
        city: campaign.city,
        platform: campaign.platform,
      });
    } catch (error) {
      setSubmissionState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your details just now. Please try again shortly.",
      });
    }
  }

  if (submissionState.status === "success") {
    return (
      <div className="rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] p-6 shadow-[var(--shadow-card)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
          Thanks{values.firstName ? `, ${values.firstName}` : ""}
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-[var(--color-brand-ink)]">
          We&apos;ve received your details.
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-brand-muted)]">
          A member of the GescoStay team will contact you using the details you
          provided. Your reference is{" "}
          <span className="font-semibold text-[var(--color-brand-ink)]">
            {submissionState.referenceId}
          </span>
          .
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={selfServeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackEvent(
                campaign.audienceType === "host"
                  ? "host_registration_click"
                  : "traveller_registration_click",
                {
                  campaign_id: campaign.campaignId,
                  campaign_name: campaign.campaignName,
                  audience_type: campaign.audienceType,
                  country: campaign.country,
                  city: campaign.city,
                },
              )
            }
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:bg-[var(--color-brand-primary-strong)]"
          >
            {campaign.audienceType === "host"
              ? "Want to get started now? Create your host account."
              : "Want to start exploring now? Browse GescoStay."}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-[var(--color-brand-border)] bg-white p-6 shadow-[var(--shadow-card)]"
      noValidate
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
            Human help
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--color-brand-ink)]">
            {campaign.leadFormTitle}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-brand-muted)]">
            {campaign.leadFormIntro}
          </p>
        </div>
        <div className="hidden rounded-full bg-[var(--color-brand-cream)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-muted)] sm:block">
          Reply route: {campaign.supportContact.label}
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {campaign.leadFormFields.map((field) => {
          const error = errors[field.key];
          const value = values[field.key] ?? "";

          return (
            <div
              key={field.key}
              className={field.type === "select" ? "md:col-span-1" : ""}
            >
              <label
                htmlFor={field.key}
                className="text-sm font-semibold text-[var(--color-brand-ink)]"
              >
                {field.label}
              </label>
              <p className="mt-1 text-xs leading-6 text-[var(--color-brand-muted)]">
                {field.helpText}
              </p>
              {renderField(field, value, error, handleChange)}
              {error ? (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl bg-[var(--color-brand-surface)] px-4 py-4 text-sm leading-7 text-[var(--color-brand-muted)]">
        By submitting this form, you agree that GescoStay can contact you
        about this request. Read the{" "}
        <a
          href={siteConfig.privacyUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[var(--color-brand-ink)] underline decoration-[var(--color-brand-primary)] underline-offset-4"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href={siteConfig.termsUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[var(--color-brand-ink)] underline decoration-[var(--color-brand-primary)] underline-offset-4"
        >
          Terms of Service
        </a>
        .
      </div>

      {submissionState.status === "error" ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {submissionState.message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submissionState.status === "submitting"}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:bg-[var(--color-brand-primary-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submissionState.status === "submitting"
            ? "Sending your details..."
            : "Get human help"}
        </button>
        <a
          href={`tel:${campaign.supportContact.phone.replace(/\s+/g, "")}`}
          onClick={() =>
            trackEvent("phone_click", {
              campaign_id: campaign.campaignId,
              campaign_name: campaign.campaignName,
              audience_type: campaign.audienceType,
              country: campaign.country,
              city: campaign.city,
            })
          }
          className="text-sm font-semibold text-[var(--color-brand-ink)] underline decoration-[var(--color-brand-primary)] underline-offset-4"
        >
          Call {campaign.supportContact.phone}
        </a>
        {campaign.supportContact.whatsapp ? (
          <a
            href={campaign.supportContact.whatsapp}
            target="_blank"
            rel="noreferrer"
            onClick={() =>
              trackEvent("whatsapp_click", {
                campaign_id: campaign.campaignId,
                campaign_name: campaign.campaignName,
                audience_type: campaign.audienceType,
                country: campaign.country,
                city: campaign.city,
              })
            }
            className="text-sm font-semibold text-[var(--color-brand-ink)] underline decoration-[var(--color-brand-primary)] underline-offset-4"
          >
            Message us on WhatsApp
          </a>
        ) : null}
      </div>
    </form>
  );
}
