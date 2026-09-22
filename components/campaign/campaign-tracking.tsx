"use client";

import { useEffect } from "react";

import type { CampaignConfig } from "@/lib/campaigns";
import { trackEvent } from "@/lib/tracking";

type CampaignTrackingProps = {
  campaign: CampaignConfig;
};

export function CampaignTracking({ campaign }: CampaignTrackingProps) {
  useEffect(() => {
    const attribution = new URLSearchParams(window.location.search);

    trackEvent("landing_page_view", {
      campaign_id: campaign.campaignId,
      campaign_name: campaign.campaignName,
      country: campaign.country,
      city: campaign.city,
      audience_type: campaign.audienceType,
      content_pillar: campaign.contentPillar,
      platform: campaign.platform,
      utm_source: attribution.get("utm_source") ?? campaign.utmSource,
      utm_medium: attribution.get("utm_medium") ?? campaign.utmMedium,
      utm_campaign: attribution.get("utm_campaign") ?? campaign.utmCampaign,
      utm_content: attribution.get("utm_content") ?? campaign.utmContent,
      utm_term: attribution.get("utm_term") ?? undefined,
    });
  }, [campaign]);

  return null;
}
