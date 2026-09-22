import { Suspense } from "react";

import Image from "next/image";
import Link from "next/link";

import { CampaignActions } from "@/components/campaign/campaign-actions";
import { LagosTravellerPage } from "@/components/campaign/lagos-traveller-page";
import { CampaignTracking } from "@/components/campaign/campaign-tracking";
import { HumanHelpForm } from "@/components/campaign/human-help-form";
import type { CampaignConfig } from "@/lib/campaigns";

type CampaignPageProps = {
  campaign: CampaignConfig;
};

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-brand-ink)] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[var(--color-brand-muted)]">
        {body}
      </p>
    </div>
  );
}

export function CampaignPage({ campaign }: CampaignPageProps) {
  if (
    campaign.designVariant === "editorial-lagos-traveller" ||
    campaign.designVariant === "apple-lagos-hidden-gems"
  ) {
    return <LagosTravellerPage campaign={campaign} />;
  }

  return (
    <>
      <CampaignTracking campaign={campaign} />
      <div className="bg-[var(--color-brand-bg)] text-[var(--color-brand-ink)]">
        <header className="border-b border-[var(--color-brand-border)] bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-ink)]">
                GS
              </div>
              <div>
                <p className="font-semibold">GescoStay</p>
                <p className="text-sm text-[var(--color-brand-muted)]">
                  Paid campaign landing pages
                </p>
              </div>
            </Link>
            <a
              href={campaign.registrationUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-[var(--color-brand-border)] px-5 py-3 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:border-[var(--color-brand-primary)] hover:bg-[var(--color-brand-cream)] sm:inline-flex"
            >
              Go to GescoStay
            </a>
          </div>
        </header>

        <main>
          <section className="border-b border-[var(--color-brand-border)]">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
              <div className="flex flex-col justify-center">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
                  {campaign.country} • {campaign.city} • {campaign.platform}
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--color-brand-ink)] sm:text-5xl">
                  {campaign.landingPageHeadline}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-brand-muted)]">
                  {campaign.landingPageSubheadline}
                </p>
                <div className="mt-8">
                  <Suspense
                    fallback={<CampaignActionsFallback campaign={campaign} />}
                  >
                    <CampaignActions campaign={campaign} />
                  </Suspense>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {campaign.trustMessages.map((message) => (
                    <div
                      key={message}
                      className="rounded-[1.5rem] border border-[var(--color-brand-border)] bg-white p-4 text-sm leading-7 text-[var(--color-brand-muted)] shadow-[var(--shadow-card)]"
                    >
                      {message}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-surface)] shadow-[var(--shadow-card)]">
                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-5">
                  <span className="rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-muted)] backdrop-blur">
                    {campaign.audienceType === "host"
                      ? "Host campaign"
                      : "Traveller campaign"}
                  </span>
                  <span className="rounded-full bg-[var(--color-brand-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-ink)]">
                    {campaign.seasonOrEvent}
                  </span>
                </div>
                <Image
                  src={campaign.heroImage}
                  alt={`${campaign.city} campaign hero image for ${campaign.audienceType}`}
                  width={1200}
                  height={1350}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Why this matters"
              title={campaign.audienceType === "host" ? "Why hosts use this route" : "Why travellers use this route"}
              body={campaign.adPrimaryText}
            />
            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {campaign.benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-[2rem] border border-[var(--color-brand-border)] bg-white p-6 shadow-[var(--shadow-card)]"
                >
                  <h3 className="text-xl font-semibold text-[var(--color-brand-ink)]">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-brand-muted)]">
                    {benefit.description}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-y border-[var(--color-brand-border)] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="How it works"
                title="One campaign, two conversion routes"
                body="Continue yourself into the live GescoStay product, or ask the local team to help you get started."
              />
              <div className="mt-10 grid gap-5 lg:grid-cols-4">
                {campaign.howItWorks.map((step, index) => (
                  <article
                    key={step.title}
                    className="rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-cream)] p-6"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-muted)]">
                      Step {index + 1}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-[var(--color-brand-ink)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-brand-muted)]">
                      {step.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <SectionHeading
                  eyebrow="Trust"
                  title="A clear handoff into the real GescoStay journey"
                  body={campaign.socialProofLabel}
                />
                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {campaign.supportingImages.map((image, index) => (
                    <div
                      key={image}
                      className="overflow-hidden rounded-[2rem] border border-[var(--color-brand-border)] bg-white shadow-[var(--shadow-card)]"
                    >
                      <Image
                        src={image}
                        alt={`${campaign.city} supporting image ${index + 1}`}
                        width={720}
                        height={720}
                        className="aspect-square h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                id="human-help"
                className="scroll-mt-28"
              >
                <div className="mb-6 rounded-[2rem] bg-[var(--color-brand-surface)] p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
                    Human-help route
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-brand-ink)]">
                    {campaign.humanHelpHeading}
                  </h2>
                  <p className="mt-4 text-base leading-8 text-[var(--color-brand-muted)]">
                    {campaign.humanHelpBody}
                  </p>
                </div>
                <Suspense fallback={<HumanHelpFallback />}>
                  <HumanHelpForm campaign={campaign} />
                </Suspense>
              </div>
            </div>
          </section>

          <section className="border-y border-[var(--color-brand-border)] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Frequently asked"
                title="Questions people ask before they continue"
                body="Keep the advert promise consistent and remove the friction that slows down the next step."
              />
              <div className="mt-10 grid gap-5 lg:grid-cols-3">
                {campaign.faq.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-bg)] p-6"
                  >
                    <h3 className="text-lg font-semibold text-[var(--color-brand-ink)]">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-brand-muted)]">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-[var(--color-brand-border)] bg-[var(--color-brand-ink)] p-8 text-white shadow-[var(--shadow-card)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
                Final CTA
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                {campaign.finalCtaTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                {campaign.finalCtaBody}
              </p>
              <div className="mt-8">
                <Suspense
                  fallback={
                    <CampaignActionsFallback
                      campaign={campaign}
                      primaryClassName="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:bg-[var(--color-brand-primary-strong)]"
                      secondaryClassName="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/15"
                    />
                  }
                >
                  <CampaignActions
                    campaign={campaign}
                    primaryClassName="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:bg-[var(--color-brand-primary-strong)]"
                    secondaryClassName="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white transition hover:bg-white/15"
                  />
                </Suspense>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

function CampaignActionsFallback({
  campaign,
  primaryClassName,
  secondaryClassName,
}: {
  campaign: CampaignConfig;
  primaryClassName?: string;
  secondaryClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href={campaign.registrationUrl}
        target="_blank"
        rel="noreferrer"
        className={
          primaryClassName ??
          "inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:bg-[var(--color-brand-primary-strong)]"
        }
      >
        {campaign.primaryCTA}
      </a>
      <a
        href="#human-help"
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

function HumanHelpFallback() {
  return (
    <div className="rounded-[2rem] border border-[var(--color-brand-border)] bg-white p-6 shadow-[var(--shadow-card)]">
      <p className="text-sm leading-7 text-[var(--color-brand-muted)]">
        Loading the help form...
      </p>
    </div>
  );
}
