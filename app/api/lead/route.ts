import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { campaigns } from "@/lib/campaigns";
import type { LeadSubmissionPayload } from "@/lib/lead";
import { validateLeadForm } from "@/lib/lead";

function isLeadSubmissionPayload(
  value: unknown,
): value is LeadSubmissionPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<LeadSubmissionPayload>;

  return (
    typeof payload.campaignId === "string" &&
    typeof payload.campaignName === "string" &&
    typeof payload.audienceType === "string" &&
    typeof payload.country === "string" &&
    typeof payload.city === "string" &&
    typeof payload.formData === "object" &&
    payload.formData !== null &&
    typeof payload.attribution === "object" &&
    payload.attribution !== null &&
    typeof payload.submittedAt === "string"
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isLeadSubmissionPayload(body)) {
    return NextResponse.json(
      {
        error: "Invalid lead payload.",
      },
      { status: 400 },
    );
  }

  const campaign = campaigns.find(
    (item) => item.campaignId === body.campaignId,
  );

  if (!campaign) {
    return NextResponse.json(
      {
        error: "Campaign not found.",
      },
      { status: 404 },
    );
  }

  const validationErrors = validateLeadForm(campaign, body.formData);

  if (Object.keys(validationErrors).length > 0) {
    return NextResponse.json(
      {
        error: "Please correct the form fields and try again.",
        fieldErrors: validationErrors,
      },
      { status: 422 },
    );
  }

  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const referenceId = `GS-${randomUUID().slice(0, 8).toUpperCase()}`;
  const submission = {
    referenceId,
    ...body,
    supportContact: campaign.supportContact,
    createdAt: new Date().toISOString(),
  };

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Lead handling is not configured yet. Add LEAD_WEBHOOK_URL before deploying the human-help form.",
        },
        { status: 503 },
      );
    }

    console.log("Lead captured in development mode", submission);

    return NextResponse.json({
      ok: true,
      mode: "development-log",
      referenceId,
    });
  }

  const webhookResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
    cache: "no-store",
  }).catch(() => null);

  if (!webhookResponse?.ok) {
    return NextResponse.json(
      {
        error:
          "We could not pass your details to the GescoStay team just now. Please try again shortly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    mode: "webhook",
    referenceId,
  });
}
