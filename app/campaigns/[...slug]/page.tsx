import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CampaignPage } from "@/components/campaign/campaign-page";
import {
  findCampaignBySlug,
  getCampaignStaticParams,
  type CampaignConfig,
} from "@/lib/campaigns";
import { siteConfig } from "@/lib/site";

type CampaignRouteProps = {
  params: Promise<{ slug: string[] }>;
};

function getCampaignOrNotFound(slug: string[]): CampaignConfig {
  const campaign = findCampaignBySlug(slug);

  if (!campaign) {
    notFound();
  }

  return campaign;
}

export async function generateStaticParams() {
  return getCampaignStaticParams();
}

export async function generateMetadata({
  params,
}: CampaignRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaignOrNotFound(slug);

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

export default async function CampaignRoutePage({
  params,
}: CampaignRouteProps) {
  const { slug } = await params;
  const campaign = getCampaignOrNotFound(slug);

  return <CampaignPage campaign={campaign} />;
}
