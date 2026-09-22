import type { CampaignConfig } from "@/lib/campaigns";

export type LeadFormValues = Partial<Record<string, string>>;

export type LeadSubmissionPayload = {
  campaignId: string;
  campaignName: string;
  audienceType: CampaignConfig["audienceType"];
  country: string;
  city: string;
  formData: LeadFormValues;
  attribution: Record<string, string>;
  submittedAt: string;
};

export type LeadValidationErrors = Partial<Record<string, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[\d\s().-]{7,}$/;

export function getInitialLeadValues(campaign: CampaignConfig): LeadFormValues {
  return {
    propertyCountry:
      campaign.audienceType === "host" ? campaign.country : undefined,
    propertyCity: campaign.audienceType === "host" ? campaign.city : undefined,
    destination:
      campaign.audienceType === "traveller" ? campaign.city : undefined,
  };
}

export function validateLeadForm(
  campaign: CampaignConfig,
  values: LeadFormValues,
): LeadValidationErrors {
  const errors: LeadValidationErrors = {};

  for (const field of campaign.leadFormFields) {
    const value = values[field.key]?.trim() ?? "";

    if (field.required && !value) {
      errors[field.key] = "This field is required.";
      continue;
    }

    if (!value) {
      continue;
    }

    if (field.type === "email" && !emailPattern.test(value)) {
      errors[field.key] = "Enter a valid email address.";
    }

    if (field.type === "tel" && !phonePattern.test(value)) {
      errors[field.key] = "Enter a valid phone or WhatsApp number.";
    }
  }

  if (
    campaign.audienceType === "traveller" &&
    !values.phone?.trim() &&
    !values.email?.trim()
  ) {
    errors.phone = "Enter a phone number or email address.";
    errors.email = "Enter an email address or phone number.";
  }

  return errors;
}
