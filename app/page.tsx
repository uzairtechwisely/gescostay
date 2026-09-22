import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CampaignPage } from "@/components/campaign/campaign-page";
import { campaigns } from "@/lib/campaigns";

export const metadata: Metadata = {
  title: "Hidden Gems in Lagos | GescoStay",
  description:
    "Explore Lagos through a single-scroll GescoStay experience and choose between guided help or browsing local stays yourself.",
};

export default function Home() {
  const lagosTravellerCampaign = campaigns.find(
    (campaign) => campaign.campaignId === "ng-lagos-traveller-q4-2026",
  );

  if (!lagosTravellerCampaign) {
    notFound();
  }

  return <CampaignPage campaign={lagosTravellerCampaign} />;
}
