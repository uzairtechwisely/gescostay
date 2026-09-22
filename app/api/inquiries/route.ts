import { randomUUID } from "node:crypto";

import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

import { campaigns } from "@/lib/campaigns";
import { sendLeadEmails } from "@/lib/email";
import { isInquiryPayload, validateInquiry } from "@/lib/inquiries";

const hasDatabaseUrl = Boolean(
  process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING,
);

async function ensureInquiryTable() {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS campaign_inquiries (
      id UUID PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      reference_id TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL,
      campaign_id TEXT NOT NULL,
      campaign_name TEXT NOT NULL,
      country TEXT NOT NULL,
      city TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      party_size TEXT,
      property_reference TEXT,
      message TEXT NOT NULL,
      attribution JSONB NOT NULL
    );
  `);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!isInquiryPayload(body)) {
    return NextResponse.json(
      { error: "Invalid inquiry payload." },
      { status: 400 },
    );
  }

  const validationErrors = validateInquiry(body);
  if (Object.keys(validationErrors).length > 0) {
    return NextResponse.json(
      {
        error: "Please correct the highlighted fields and try again.",
        fieldErrors: validationErrors,
      },
      { status: 422 },
    );
  }

  const campaign = campaigns.find((item) => item.campaignId === body.campaignId);
  if (!campaign) {
    return NextResponse.json({ error: "Campaign not found." }, { status: 404 });
  }

  const referenceId = `GS-${randomUUID().slice(0, 8).toUpperCase()}`;
  const recordId = randomUUID();

  const emailInput = {
    referenceId,
    campaignName: campaign.campaignName,
    audienceType: campaign.audienceType,
    country: campaign.country,
    city: campaign.city,
    contactName: body.name.trim(),
    contactEmail: body.email.trim(),
    summaryLines: [
      `<strong>Source:</strong> ${body.source}`,
      `<strong>Phone:</strong> ${body.phone.trim()}`,
      body.propertyReference
        ? `<strong>Property:</strong> ${body.propertyReference}`
        : null,
      body.partySize ? `<strong>Party size:</strong> ${body.partySize}` : null,
      `<strong>Message:</strong> ${body.message.trim()}`,
    ].filter((line): line is string => Boolean(line)),
  };

  if (!hasDatabaseUrl) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        {
          error:
            "Inquiry storage is not configured yet. Add the project database connection before deploying these modals.",
        },
        { status: 503 },
      );
    }

    console.log("Inquiry captured in development mode", {
      id: recordId,
      referenceId,
      ...body,
    });
    await sendLeadEmails(emailInput);

    return NextResponse.json({
      ok: true,
      mode: "development-log",
      referenceId,
    });
  }

  try {
    await ensureInquiryTable();

    await sql`
      INSERT INTO campaign_inquiries (
        id,
        reference_id,
        source,
        campaign_id,
        campaign_name,
        country,
        city,
        name,
        email,
        phone,
        party_size,
        property_reference,
        message,
        attribution
      ) VALUES (
        ${recordId},
        ${referenceId},
        ${body.source},
        ${body.campaignId},
        ${body.campaignName},
        ${body.country},
        ${body.city},
        ${body.name.trim()},
        ${body.email.trim()},
        ${body.phone.trim()},
        ${body.partySize?.trim() || null},
        ${body.propertyReference?.trim() || null},
        ${body.message.trim()},
        ${JSON.stringify(body.attribution)}
      )
    `;
  } catch (error) {
    console.error("Failed to store inquiry", error);

    return NextResponse.json(
      {
        error:
          "We could not save your request just now. Please try again shortly or contact the team directly.",
      },
      { status: 502 },
    );
  }

  await sendLeadEmails(emailInput);

  return NextResponse.json({
    ok: true,
    mode: "database",
    referenceId,
  });
}
