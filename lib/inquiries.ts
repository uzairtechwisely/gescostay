export type InquirySource = "property_help_me_book" | "personal_tour";

export type InquiryPayload = {
  source: InquirySource;
  campaignId: string;
  campaignName: string;
  country: string;
  city: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyReference?: string;
  partySize?: string;
  attribution: Record<string, string>;
  submittedAt: string;
};

export type InquiryErrors = Partial<
  Record<"name" | "email" | "phone" | "message" | "partySize", string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[\d\s().-]{7,}$/;

export function validateInquiry(payload: InquiryPayload): InquiryErrors {
  const errors: InquiryErrors = {};

  if (!payload.name.trim()) {
    errors.name = "Please tell us your name.";
  }

  if (!payload.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!emailPattern.test(payload.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!payload.phone.trim()) {
    errors.phone = "Please enter your phone or WhatsApp number.";
  } else if (!phonePattern.test(payload.phone.trim())) {
    errors.phone = "Please enter a valid phone or WhatsApp number.";
  }

  if (!payload.message.trim()) {
    errors.message = "Please tell us what you need help with.";
  }

  if (payload.source === "personal_tour" && !payload.partySize?.trim()) {
    errors.partySize = "Please share your party size.";
  }

  return errors;
}

export function isInquiryPayload(value: unknown): value is InquiryPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<InquiryPayload>;

  return (
    (payload.source === "property_help_me_book" ||
      payload.source === "personal_tour") &&
    typeof payload.campaignId === "string" &&
    typeof payload.campaignName === "string" &&
    typeof payload.country === "string" &&
    typeof payload.city === "string" &&
    typeof payload.name === "string" &&
    typeof payload.email === "string" &&
    typeof payload.phone === "string" &&
    typeof payload.message === "string" &&
    typeof payload.attribution === "object" &&
    payload.attribution !== null &&
    typeof payload.submittedAt === "string"
  );
}
