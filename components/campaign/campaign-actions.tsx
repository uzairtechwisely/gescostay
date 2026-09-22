"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import type { CampaignConfig } from "@/lib/campaigns";
import { appendCampaignQueryParams } from "@/lib/campaigns";
import { trackEvent } from "@/lib/tracking";

type CampaignActionsProps = {
  campaign: CampaignConfig;
  primaryClassName?: string;
  secondaryClassName?: string;
};

export function CampaignActions({
  campaign,
  primaryClassName,
  secondaryClassName,
}: CampaignActionsProps) {
  const searchParams = useSearchParams();
  const search = useMemo(
    () => new URLSearchParams(searchParams.toString()),
    [searchParams],
  );

  const registrationUrl = `${campaign.registrationUrl}?${appendCampaignQueryParams(
    campaign,
    search,
  ).toString()}`;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={registrationUrl}
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
              country: campaign.country,
              city: campaign.city,
              audience_type: campaign.audienceType,
              platform: campaign.platform,
            },
          )
        }
        className={
          primaryClassName ??
          "inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:bg-[var(--color-brand-primary-strong)]"
        }
      >
        {campaign.primaryCTA}
      </a>
      <a
        href="#human-help"
        onClick={() =>
          trackEvent("human_help_click", {
            campaign_id: campaign.campaignId,
            campaign_name: campaign.campaignName,
            country: campaign.country,
            city: campaign.city,
            audience_type: campaign.audienceType,
            platform: campaign.platform,
          })
        }
        className={
          secondaryClassName ??
          "inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-brand-border)] bg-white px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-cream)]"
        }
      >
        {campaign.secondaryCTA}
      </a>
    </div>
  );
}
