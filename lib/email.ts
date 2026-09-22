import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const FROM_ADDRESS =
  process.env.EMAIL_FROM ?? "GescoStay <onboarding@resend.dev>";
const NOTIFICATION_EMAIL =
  process.env.LEAD_NOTIFICATION_EMAIL ?? "u_a_s@live.com";

export type LeadEmailInput = {
  referenceId: string;
  campaignName: string;
  audienceType: string;
  country: string;
  city: string;
  contactName?: string;
  contactEmail?: string;
  summaryLines: string[];
};

function renderNotificationHtml(input: LeadEmailInput) {
  const rows = input.summaryLines
    .map((line) => `<p style="margin:0 0 8px;">${line}</p>`)
    .join("");

  return `
    <div style="font-family:sans-serif;color:#21282c;">
      <h2 style="margin:0 0 12px;">New ${input.audienceType} lead — ${input.city}, ${input.country}</h2>
      <p style="margin:0 0 16px;color:#5d6469;">Campaign: ${input.campaignName} &middot; Reference: ${input.referenceId}</p>
      ${rows}
    </div>
  `;
}

function renderConfirmationHtml(input: LeadEmailInput) {
  return `
    <div style="font-family:sans-serif;color:#21282c;">
      <p>Hi${input.contactName ? ` ${input.contactName}` : ""},</p>
      <p>Thanks for reaching out to GescoStay. A member of our local team will follow up using the details you shared.</p>
      <p>Your reference number is <strong>${input.referenceId}</strong>.</p>
      <p>— The GescoStay team</p>
    </div>
  `;
}

/**
 * Sends the internal lead notification and, if a contact email is available,
 * a confirmation email to the person who submitted the form. Never throws —
 * failures are logged so they don't take down the lead-capture request.
 *
 * Without a verified sending domain, Resend's sandbox sender
 * (onboarding@resend.dev) can only deliver to the email address the Resend
 * account was created with. Verify gescostay.com on Resend and set
 * EMAIL_FROM to unblock sending to real leads.
 */
export async function sendLeadEmails(input: LeadEmailInput) {
  if (!resend) {
    console.log(
      "RESEND_API_KEY not set; skipping lead emails for",
      input.referenceId,
    );
    return;
  }

  const notifyPromise = resend.emails.send({
    from: FROM_ADDRESS,
    to: NOTIFICATION_EMAIL,
    subject: `New ${input.audienceType} lead — ${input.city}, ${input.country} (${input.referenceId})`,
    html: renderNotificationHtml(input),
  });

  const confirmPromise = input.contactEmail
    ? resend.emails.send({
        from: FROM_ADDRESS,
        to: input.contactEmail,
        subject: `We've received your GescoStay request — ${input.referenceId}`,
        html: renderConfirmationHtml(input),
      })
    : Promise.resolve(null);

  const [notifyResult, confirmResult] = await Promise.allSettled([
    notifyPromise,
    confirmPromise,
  ]);

  if (notifyResult.status === "rejected") {
    console.error("Failed to send lead notification email", notifyResult.reason);
  }

  if (confirmResult.status === "rejected") {
    console.error("Failed to send lead confirmation email", confirmResult.reason);
  }
}
