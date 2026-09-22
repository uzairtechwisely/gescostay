import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CampaignPage } from "@/components/campaign/campaign-page";
import { findCampaignById } from "@/lib/campaigns";
import { siteConfig } from "@/lib/site";

const CAMPAIGN_ID = "ng-lagos-host-sep-2026";

function getCampaignOrNotFound() {
  const campaign = findCampaignById(CAMPAIGN_ID);

  if (!campaign) {
    notFound();
  }

  return campaign;
}

export async function generateMetadata(): Promise<Metadata> {
  const campaign = getCampaignOrNotFound();

  return {
    title: campaign.metaTitle,
    description: campaign.metaDescription,
    alternates: {
      canonical: campaign.canonicalPath,
    },
    openGraph: {
      title: campaign.metaTitle,
      description: campaign.metaDescription,
      url: campaign.canonicalPath,
      siteName: siteConfig.name,
      images: [
        {
          url: campaign.heroImage,
          alt: campaign.landingPageHeadline,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.metaTitle,
      description: campaign.metaDescription,
      images: [campaign.heroImage],
    },
    robots: {
      index: campaign.indexable ?? false,
      follow: true,
    },
  };
}

export default function LagosHostsPage() {
  const campaign = getCampaignOrNotFound();

  return <CampaignPage campaign={campaign} />;
}
