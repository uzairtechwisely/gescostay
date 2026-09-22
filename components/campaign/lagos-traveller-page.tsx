"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import Image from "next/image";
import Link from "next/link";

import { CampaignTracking } from "@/components/campaign/campaign-tracking";
import {
  appendCampaignQueryParams,
  type CampaignConfig,
  type CampaignHostProfile,
  type CampaignPropertyFeature,
} from "@/lib/campaigns";
import { siteConfig } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

type LagosTravellerPageProps = {
  campaign: CampaignConfig;
};

type InquiryField = "name" | "email" | "phone" | "message" | "partySize";

type InquiryValues = Record<InquiryField, string>;
type InquiryErrors = Partial<Record<InquiryField, string>>;

type ModalState =
  | {
      kind: "property";
      stage: "choice" | "form" | "success";
      property: CampaignPropertyFeature;
      referenceId?: string;
    }
  | {
      kind: "tour";
      stage: "form" | "success";
      referenceId?: string;
    }
  | null;

const emptyPropertyInquiry: InquiryValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  partySize: "",
};

const emptyTourInquiry: InquiryValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  partySize: "",
};

const modalFocusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function LagosTravellerPage({ campaign }: LagosTravellerPageProps) {
  const [modal, setModal] = useState<ModalState>(null);
  const [propertyInquiry, setPropertyInquiry] =
    useState<InquiryValues>(emptyPropertyInquiry);
  const [propertyErrors, setPropertyErrors] = useState<InquiryErrors>({});
  const [tourInquiry, setTourInquiry] = useState<InquiryValues>(emptyTourInquiry);
  const [tourErrors, setTourErrors] = useState<InquiryErrors>({});
  const [submitting, setSubmitting] = useState<"property" | "tour" | null>(null);
  const [attribution, setAttribution] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [heroMotion, setHeroMotion] = useState({ imageOffset: 0, textOffset: 0 });

  const propertyRailRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setAttribution(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") {
      setHeroMotion({ imageOffset: 0, textOffset: 0 });
      return;
    }

    let frame = 0;

    const updateMotion = () => {
      const heroHeight = heroRef.current?.offsetHeight ?? window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(window.scrollY / Math.max(heroHeight, 1), 1.4),
      );

      setHeroMotion({
        imageOffset: progress * 82,
        textOffset: progress * 46,
      });

      frame = 0;
    };

    const onScroll = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateMotion);
    };

    updateMotion();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: prefersReducedMotion ? 0 : 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    nodes.forEach((node) => {
      if (prefersReducedMotion) {
        node.classList.add("is-visible");
        return;
      }

      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [prefersReducedMotion, modal]);

  useEffect(() => {
    const rail = propertyRailRef.current;
    if (!rail) {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      rail.scrollBy({
        left: event.deltaY,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    };

    rail.addEventListener("wheel", onWheel, { passive: false });

    return () => rail.removeEventListener("wheel", onWheel);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!modal) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModal(null);
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) {
        return;
      }

      const focusables = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(modalFocusableSelector),
      );

      if (focusables.length === 0) {
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const focusTimer = window.setTimeout(() => {
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
        modalFocusableSelector,
      );
      firstFocusable?.focus();
    }, 20);

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal]);

  const getBrowseUrl = useCallback(
    (propertyReference?: string) => {
      const params = appendCampaignQueryParams(campaign, attribution);

      if (propertyReference) {
        params.set("property_reference", propertyReference);
      }

      return `${campaign.registrationUrl}?${params.toString()}`;
    },
    [attribution, campaign],
  );

  const scrollToSection = useCallback((id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openPropertyModal = useCallback((property: CampaignPropertyFeature) => {
    setPropertyInquiry({
      ...emptyPropertyInquiry,
      message: `I'm interested in ${property.title}. Please help me book it.`,
    });
    setPropertyErrors({});
    setModal({
      kind: "property",
      stage: "choice",
      property,
    });
  }, []);

  const openTourModal = useCallback(() => {
    setTourInquiry(emptyTourInquiry);
    setTourErrors({});
    setModal({
      kind: "tour",
      stage: "form",
    });
  }, []);

  const submitPropertyInquiry = useCallback(async () => {
    if (!modal || modal.kind !== "property") {
      return;
    }

    const nextErrors = validatePropertyInquiry(propertyInquiry);
    setPropertyErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting("property");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "property_help_me_book",
          campaignId: campaign.campaignId,
          campaignName: campaign.campaignName,
          country: campaign.country,
          city: campaign.city,
          propertyReference: modal.property.reference,
          name: propertyInquiry.name,
          email: propertyInquiry.email,
          phone: propertyInquiry.phone,
          message: propertyInquiry.message,
          attribution: Object.fromEntries(attribution.entries()),
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        fieldErrors?: InquiryErrors;
        referenceId?: string;
      };

      if (!response.ok || !data.referenceId) {
        if (data.fieldErrors) {
          setPropertyErrors(data.fieldErrors);
        }

        throw new Error(
          data.error ??
            "We could not save your request just now. Please try again shortly.",
        );
      }

      trackEvent("lagos_property_inquiry_submit", {
        campaign_id: campaign.campaignId,
        property_reference: modal.property.reference,
      });

      setModal({
        kind: "property",
        stage: "success",
        property: modal.property,
        referenceId: data.referenceId,
      });
    } catch (error) {
      setPropertyErrors((current) => ({
        ...current,
        message:
          error instanceof Error
            ? error.message
            : "We could not save your request just now. Please try again shortly.",
      }));
    } finally {
      setSubmitting(null);
    }
  }, [attribution, campaign, modal, propertyInquiry]);

  const submitTourInquiry = useCallback(async () => {
    const nextErrors = validateTourInquiry(tourInquiry);
    setTourErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting("tour");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "personal_tour",
          campaignId: campaign.campaignId,
          campaignName: campaign.campaignName,
          country: campaign.country,
          city: campaign.city,
          name: tourInquiry.name,
          email: tourInquiry.email,
          phone: tourInquiry.phone,
          partySize: tourInquiry.partySize,
          message: tourInquiry.message,
          attribution: Object.fromEntries(attribution.entries()),
          submittedAt: new Date().toISOString(),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        fieldErrors?: InquiryErrors;
        referenceId?: string;
      };

      if (!response.ok || !data.referenceId) {
        if (data.fieldErrors) {
          setTourErrors(data.fieldErrors);
        }

        throw new Error(
          data.error ??
            "We could not save your request just now. Please try again shortly.",
        );
      }

      trackEvent("lagos_personal_tour_submit", {
        campaign_id: campaign.campaignId,
      });

      setModal({
        kind: "tour",
        stage: "success",
        referenceId: data.referenceId,
      });
    } catch (error) {
      setTourErrors((current) => ({
        ...current,
        message:
          error instanceof Error
            ? error.message
            : "We could not save your request just now. Please try again shortly.",
      }));
    } finally {
      setSubmitting(null);
    }
  }, [attribution, campaign, tourInquiry]);

  const usps = useMemo(
    () => [
      {
        title: "Vetted for warmth, not wifi",
        body: "Every host passes a real hospitality check rooted in African warmth — not a generic star rating.",
      },
      {
        title: "Checked before you see it",
        body: "Every home is inspected in person before it goes live, so what's on the page is what's at the door.",
      },
      {
        title: "Hosts paid in days, not months",
        body: "Fast, fair payouts mean your booking reaches the person who welcomed you, quickly.",
      },
      {
        title: "Built in Africa, for this",
        body: "Made by a team that understands the market, the travellers, and the hosts — because we're from here too.",
      },
    ],
    [],
  );

  return (
    <>
      <CampaignTracking campaign={campaign} />
      <div className="bg-[var(--color-brand-bg)] text-[var(--color-brand-ink)]">
        <header className="sticky top-0 z-40 bg-[rgba(255,250,244,0.82)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <GescoMark size={38} />
              <div>
                <p className="text-lg font-semibold tracking-[-0.01em]">
                  GescoStay
                </p>
                <p className="hidden text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)] sm:block">
                  Book &middot; Stay &middot; Belong
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => scrollToSection("properties")}
                className="hidden min-h-10 items-center justify-center rounded-full border border-[var(--color-brand-soft-border)] bg-white px-4 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:border-[var(--color-brand-accent)] sm:inline-flex"
              >
                Find My Stay
              </button>
              <button
                type="button"
                onClick={openTourModal}
                className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--color-brand-ink)] px-4 text-sm font-semibold text-white transition hover:bg-[#101518] sm:px-5"
              >
                Talk to Us
              </button>
            </div>
          </div>
        </header>

        <main>
          <section
            ref={heroRef}
            className="relative isolate min-h-[86svh] overflow-hidden bg-[var(--color-brand-ink)] text-white sm:min-h-[92svh]"
          >
            <div
              className="absolute inset-0"
              style={{
                transform: prefersReducedMotion
                  ? undefined
                  : `translate3d(0, ${heroMotion.imageOffset}px, 0) scale(1.08)`,
                transition: prefersReducedMotion ? "none" : "transform 120ms linear",
              }}
            >
              <Image
                src={campaign.heroImage}
                alt="Lagos waterfront skyline at golden hour"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,19,23,0.2),rgba(14,19,23,0.7)_68%,rgba(14,19,23,0.9)_88%)]" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(255,250,244,0),var(--color-brand-bg)_92%)] sm:h-56" />

            <div className="relative mx-auto flex min-h-[86svh] max-w-7xl flex-col justify-end px-5 pb-14 pt-24 sm:min-h-[92svh] sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
              <div
                className="max-w-3xl"
                style={{
                  transform: prefersReducedMotion
                    ? undefined
                    : `translate3d(0, ${heroMotion.textOffset * -1}px, 0)`,
                  transition: prefersReducedMotion ? "none" : "transform 120ms linear",
                }}
              >
                <p className="reveal-on-scroll text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                  Lagos, Nigeria
                </p>
                <h1
                  data-reveal
                  className="reveal-on-scroll mt-5 max-w-2xl text-[2.9rem] font-extrabold leading-[0.98] tracking-[-0.03em] sm:text-[4.4rem] lg:text-[5.25rem]"
                >
                  Stay like you know
                  <br />
                  somebody in{" "}
                  <span className="text-[var(--color-brand-accent)]">
                    Lagos
                  </span>
                  .
                </h1>
                <p
                  data-reveal
                  className="reveal-on-scroll mt-6 max-w-xl text-lg leading-8 text-white/82 sm:text-xl"
                  style={{ transitionDelay: "100ms" }}
                >
                  Every host is vetted for real hospitality. Every home is
                  checked before it&apos;s listed. Book a stay that already
                  feels like yours.
                </p>
                <div
                  data-reveal
                  className="reveal-on-scroll mt-9 flex flex-col gap-3 sm:flex-row"
                  style={{ transitionDelay: "180ms" }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent("lagos_hero_explore_click", {
                        campaign_id: campaign.campaignId,
                      });
                      scrollToSection("properties");
                    }}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-accent)] px-7 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-accent-strong)]"
                  >
                    Find My Stay
                  </button>
                  <button
                    type="button"
                    onClick={openTourModal}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-white/8 px-7 text-sm font-semibold text-white transition hover:bg-white/14"
                  >
                    Talk to Us
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pt-10 sm:px-8 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--color-brand-ink)] py-4">
              <div className="marquee-track" aria-hidden="true">
                {[0, 1].map((repeat) => (
                  <div key={repeat} className="flex items-center">
                    {(campaign.seasonMoments ?? []).map((moment) => (
                      <span
                        key={`${repeat}-${moment.label}`}
                        className="mx-4 flex items-center gap-3 whitespace-nowrap text-lg text-white/85 sm:text-xl"
                      >
                        <span className="font-display italic text-[var(--color-brand-accent)]">
                          {moment.label}
                        </span>
                        {moment.title}
                        <span className="text-white/25">&#10022;</span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <p className="sr-only">
                {(campaign.seasonMoments ?? [])
                  .map((moment) => `${moment.label}: ${moment.title}`)
                  .join(". ")}
              </p>
            </div>
          </section>

          <section>
            <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 lg:px-8 lg:py-32">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div
                  data-reveal
                  className="reveal-on-scroll lg:sticky lg:top-32 lg:self-start"
                >
                  <p className="font-display text-[2.1rem] italic leading-[1.14] text-[var(--color-brand-ink)] sm:text-[2.6rem]">
                    &ldquo;We didn&apos;t build another listings site. We
                    built a way to land in Lagos and already feel
                    expected.&rdquo;
                  </p>
                </div>
                <div className="divide-y divide-[var(--color-brand-soft-border)]">
                  {usps.map((usp, index) => (
                    <article
                      key={usp.title}
                      data-reveal
                      className="reveal-on-scroll flex gap-5 py-5 first:pt-0 last:pb-0"
                      style={{ transitionDelay: `${60 + index * 70}ms` }}
                    >
                      <span className="font-display text-2xl italic text-[var(--color-brand-accent)]">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold leading-snug text-[var(--color-brand-ink)]">
                          {usp.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-[var(--color-brand-muted)]">
                          {usp.body}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="properties" className="relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div data-reveal className="reveal-on-scroll max-w-lg">
                  <p className="font-display text-[2rem] italic leading-[1.05] text-[var(--color-brand-ink)] sm:text-[2.5rem]">
                    Homes worth flying for.
                  </p>
                </div>
                <div
                  data-reveal
                  className="reveal-on-scroll flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => scrollRail(propertyRailRef.current, "left", prefersReducedMotion)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-brand-ink)] text-lg transition hover:bg-[var(--color-brand-ink)] hover:text-white"
                    aria-label="Scroll properties left"
                  >
                    &larr;
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRail(propertyRailRef.current, "right", prefersReducedMotion)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-brand-ink)] text-lg transition hover:bg-[var(--color-brand-ink)] hover:text-white"
                    aria-label="Scroll properties right"
                  >
                    &rarr;
                  </button>
                </div>
              </div>

              <div
                ref={propertyRailRef}
                className="property-rail mt-10 flex gap-8 overflow-x-auto pb-4"
                tabIndex={0}
                aria-label="Featured Lagos stays"
              >
                {(campaign.showcaseProperties ?? []).map((property, index) => (
                  <button
                    key={property.reference}
                    type="button"
                    onClick={() => {
                      trackEvent("lagos_property_open", {
                        campaign_id: campaign.campaignId,
                        property_reference: property.reference,
                      });
                      openPropertyModal(property);
                    }}
                    data-reveal
                    className="reveal-on-scroll group min-w-[15.5rem] flex-[0_0_15.5rem] text-left sm:min-w-[17.5rem] sm:flex-[0_0_17.5rem]"
                    style={{ transitionDelay: `${100 + index * 60}ms` }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-[0.5rem]">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        sizes="(max-width: 640px) 68vw, 17.5rem"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="border-x border-b border-[var(--color-brand-soft-border)] bg-white px-4 py-3.5">
                      {property.area ? (
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-brand-accent)]">
                          {property.area}
                        </p>
                      ) : null}
                      <h3 className="mt-1 font-display text-lg italic leading-snug text-[var(--color-brand-ink)]">
                        {property.title}
                      </h3>
                      {property.priceFrom ? (
                        <p className="mt-1.5 text-sm text-[var(--color-brand-muted)]">
                          from{" "}
                          <span className="font-semibold text-[var(--color-brand-ink)]">
                            {property.priceFrom}
                          </span>{" "}
                          / night
                        </p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="overflow-hidden">
            <div className="mx-auto max-w-6xl px-5 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
              <p
                data-reveal
                className="reveal-on-scroll mx-auto max-w-md font-display text-[2rem] italic leading-[1.1] text-[var(--color-brand-ink)] sm:text-[2.5rem]"
              >
                They don&apos;t just open the door.
              </p>
              <div className="mt-12 flex flex-wrap items-start justify-center gap-x-6 gap-y-10 sm:gap-x-10">
                {(campaign.hostProfiles ?? []).map((host, index) => (
                  <HostPolaroid key={host.name} host={host} index={index} />
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 pb-20 sm:px-8 lg:px-8 lg:pb-28">
            <div className="dot-field mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-[var(--color-brand-ink)] px-5 py-20 text-center sm:px-10 lg:py-28">
              <p
                data-reveal
                className="reveal-on-scroll font-display text-[2.4rem] italic leading-[1.08] text-white sm:text-[3.4rem]"
              >
                Your Lagos welcome is one tap away.
              </p>
              <div
                data-reveal
                className="reveal-on-scroll mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
                style={{ transitionDelay: "80ms" }}
              >
                <button
                  type="button"
                  onClick={() => {
                    trackEvent("lagos_browse_and_book_click", {
                      campaign_id: campaign.campaignId,
                    });
                    window.location.assign(getBrowseUrl());
                  }}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-accent)] px-8 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-accent-strong)]"
                >
                  Browse and Book
                </button>
                <button
                  type="button"
                  onClick={openTourModal}
                  className="text-sm font-semibold text-white underline decoration-white/40 underline-offset-4 transition hover:decoration-white"
                >
                  or talk to us first &rarr;
                </button>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-2.5">
              <GescoMark size={34} />
              <div>
                <p className="font-semibold">{siteConfig.name}</p>
                <p className="text-sm text-[var(--color-brand-muted)]">
                  The spirit of African hospitality.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-[var(--color-brand-muted)]">
              <a href={siteConfig.privacyUrl}>Privacy Policy</a>
              <a href={siteConfig.termsUrl}>Terms and Conditions</a>
            </div>
          </div>
        </footer>

        {modal ? (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(10,14,18,0.58)] px-4 py-8 sm:items-center"
            onClick={() => setModal(null)}
          >
            <div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={
                modal.kind === "property"
                  ? "Property availability dialog"
                  : "Personal tour request dialog"
              }
              className="my-auto w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-[0_40px_120px_rgba(10,14,18,0.3)] sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="sticky -top-6 z-10 -mx-6 -mt-6 flex justify-end rounded-t-[2rem] bg-white px-6 pt-6 pb-2 sm:-top-8 sm:-mx-8 sm:-mt-8 sm:px-8 sm:pt-8">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-brand-soft-border)] text-xl text-[var(--color-brand-muted)] transition hover:text-[var(--color-brand-ink)]"
                  aria-label="Close dialog"
                >
                  ×
                </button>
              </div>

              <div className="mt-3">
                {modal.kind === "property" ? (
                  <PropertyModalContent
                    modal={modal}
                    propertyInquiry={propertyInquiry}
                    propertyErrors={propertyErrors}
                    submitting={submitting === "property"}
                    onBookNow={() => {
                      trackEvent("lagos_property_browse_click", {
                        campaign_id: campaign.campaignId,
                        property_reference: modal.property.reference,
                      });
                      window.location.assign(getBrowseUrl(modal.property.reference));
                    }}
                    onContinueToForm={() =>
                      setModal({
                        kind: "property",
                        stage: "form",
                        property: modal.property,
                      })
                    }
                    onChange={(field, value) => {
                      setPropertyInquiry((current) => ({
                        ...current,
                        [field]: value,
                      }));
                      setPropertyErrors((current) => ({
                        ...current,
                        [field]:
                          field === "message" &&
                          current.message &&
                          current.message.startsWith("We could not")
                            ? current.message
                            : undefined,
                      }));
                    }}
                    onSubmit={submitPropertyInquiry}
                  />
                ) : (
                  <TourModalContent
                    modal={modal}
                    tourInquiry={tourInquiry}
                    tourErrors={tourErrors}
                    submitting={submitting === "tour"}
                    onChange={(field, value) => {
                      setTourInquiry((current) => ({
                        ...current,
                        [field]: value,
                      }));
                      setTourErrors((current) => ({
                        ...current,
                        [field]:
                          field === "message" &&
                          current.message &&
                          current.message.startsWith("We could not")
                            ? current.message
                            : undefined,
                      }));
                    }}
                    onSubmit={submitTourInquiry}
                  />
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function GescoMark({ size = 36 }: { size?: number }) {
  return (
    <Image
      src="/brand/gescostay-mark.png"
      alt="GescoStay"
      width={size}
      height={size}
      className="shrink-0 rounded-[0.6rem]"
    />
  );
}

const polaroidRotations = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3"];

function HostPolaroid({
  host,
  index,
}: {
  host: CampaignHostProfile;
  index: number;
}) {
  return (
    <article
      data-reveal
      className={`polaroid reveal-on-scroll w-40 shrink-0 transition hover:-translate-y-1 hover:rotate-0 sm:w-48 ${
        polaroidRotations[index % polaroidRotations.length]
      }`}
      style={{ transitionDelay: `${100 + index * 90}ms` }}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={host.image}
          alt={`${host.name}, GescoStay host`}
          fill
          sizes="(max-width: 768px) 40vw, 12vw"
          className="object-cover"
        />
      </div>
      <p className="mt-3 text-center font-display text-lg italic text-[var(--color-brand-ink)]">
        {host.name}
      </p>
      <p className="mt-1 text-center text-xs leading-5 text-[var(--color-brand-muted)]">
        {host.description}
      </p>
    </article>
  );
}

function PropertyModalContent({
  modal,
  propertyInquiry,
  propertyErrors,
  submitting,
  onBookNow,
  onContinueToForm,
  onChange,
  onSubmit,
}: {
  modal: Extract<ModalState, { kind: "property" }>;
  propertyInquiry: InquiryValues;
  propertyErrors: InquiryErrors;
  submitting: boolean;
  onBookNow: () => void;
  onContinueToForm: () => void;
  onChange: (field: InquiryField, value: string) => void;
  onSubmit: () => void;
}) {
  if (modal.stage === "success") {
    return (
      <ConfirmationState
        eyebrow="Request received"
        title="We will help you check availability."
        body={`Your reference is ${modal.referenceId}. A GescoStay team member will follow up using the details you shared.`}
      />
    );
  }

  return (
    <div className="transition duration-300">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] sm:w-56">
          <Image
            src={modal.property.image}
            alt={modal.property.title}
            fill
            sizes="(max-width: 640px) 100vw, 14rem"
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[var(--color-brand-muted)]">Great choice!</p>
          <h2 className="mt-2 text-3xl leading-tight tracking-[-0.04em] text-[var(--color-brand-ink)]">
            Let&apos;s check availability.
          </h2>
          <p className="mt-3 text-base leading-8 text-[var(--color-brand-muted)]">
            {modal.property.title}. {modal.property.description}
          </p>
        </div>
      </div>

      {modal.stage === "choice" ? (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onBookNow}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-ink)] px-6 text-sm font-semibold text-white transition hover:bg-[#101518]"
          >
            Browse and Book
          </button>
          <button
            type="button"
            onClick={onContinueToForm}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-brand-soft-border)] bg-[var(--color-brand-bg)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:border-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-soft)]"
          >
            Help Me Book
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <ModalField
              label="Name"
              value={propertyInquiry.name}
              error={propertyErrors.name}
              onChange={(value) => onChange("name", value)}
            />
            <ModalField
              label="Email"
              type="email"
              value={propertyInquiry.email}
              error={propertyErrors.email}
              onChange={(value) => onChange("email", value)}
            />
            <ModalField
              label="Phone"
              type="tel"
              value={propertyInquiry.phone}
              error={propertyErrors.phone}
              onChange={(value) => onChange("phone", value)}
            />
            <div className="sm:col-span-2">
              <ModalField
                label="Tell us what you need help with"
                multiline
                value={propertyInquiry.message}
                error={propertyErrors.message}
                onChange={(value) => onChange("message", value)}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-accent)] px-6 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send request"}
          </button>
        </div>
      )}
    </div>
  );
}

function TourModalContent({
  modal,
  tourInquiry,
  tourErrors,
  submitting,
  onChange,
  onSubmit,
}: {
  modal: Extract<ModalState, { kind: "tour" }>;
  tourInquiry: InquiryValues;
  tourErrors: InquiryErrors;
  submitting: boolean;
  onChange: (field: InquiryField, value: string) => void;
  onSubmit: () => void;
}) {
  if (modal.stage === "success") {
    return (
      <ConfirmationState
        eyebrow="Thank you"
        title="Our team will speak to you soon."
        body={`Your reference is ${modal.referenceId}. Meanwhile, take a look at what other travellers are saying on our Instagram.`}
        action={
          <a
            href={siteConfig.instagramUrl}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-brand-soft-border)] bg-[var(--color-brand-bg)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:border-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-soft)]"
          >
            Visit Instagram
          </a>
        }
      />
    );
  }

  return (
    <div className="transition duration-300">
      <p className="text-sm text-[var(--color-brand-muted)]">Guided path</p>
      <h2 className="mt-2 text-3xl leading-tight tracking-[-0.04em] text-[var(--color-brand-ink)]">
        Want a personal tour?
      </h2>
      <p className="mt-3 max-w-xl text-base leading-8 text-[var(--color-brand-muted)]">
        Tell us the kind of Lagos trip you are planning. We will guide you over
        a phone or video call.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ModalField
          label="Name"
          value={tourInquiry.name}
          error={tourErrors.name}
          onChange={(value) => onChange("name", value)}
        />
        <ModalField
          label="Email"
          type="email"
          value={tourInquiry.email}
          error={tourErrors.email}
          onChange={(value) => onChange("email", value)}
        />
        <ModalField
          label="Phone"
          type="tel"
          value={tourInquiry.phone}
          error={tourErrors.phone}
          onChange={(value) => onChange("phone", value)}
        />
        <ModalField
          label="Party Size"
          value={tourInquiry.partySize}
          error={tourErrors.partySize}
          onChange={(value) => onChange("partySize", value)}
        />
        <div className="sm:col-span-2">
          <ModalField
            label="Tell us what you need help with"
            multiline
            value={tourInquiry.message}
            error={tourErrors.message}
            onChange={(value) => onChange("message", value)}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-ink)] px-6 text-sm font-semibold text-white transition hover:bg-[#101518] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Request a personal tour"}
      </button>
    </div>
  );
}

function ConfirmationState({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div>
      <p className="text-sm text-[var(--color-brand-muted)]">{eyebrow}</p>
      <h2 className="mt-2 text-3xl leading-tight tracking-[-0.04em] text-[var(--color-brand-ink)]">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-base leading-8 text-[var(--color-brand-muted)]">
        {body}
      </p>
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}

function ModalField({
  label,
  type = "text",
  value,
  error,
  onChange,
  multiline = false,
}: {
  label: string;
  type?: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const baseClassName = `mt-2 w-full rounded-[1.35rem] border bg-[var(--color-brand-bg)] px-4 py-3 text-sm text-[var(--color-brand-ink)] outline-none transition placeholder:text-[var(--color-brand-muted)] focus:border-[var(--color-brand-accent)] focus:ring-4 focus:ring-[var(--color-brand-accent-soft)] ${
    error ? "border-red-500" : "border-[var(--color-brand-soft-border)]"
  }`;

  return (
    <label className="block text-sm text-[var(--color-brand-ink)]">
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${baseClassName} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={baseClassName}
        />
      )}
      {error ? (
        <span className="mt-2 block text-sm text-red-600">{error}</span>
      ) : null}
    </label>
  );
}

function validatePropertyInquiry(values: InquiryValues) {
  const errors: InquiryErrors = {};

  if (!values.name.trim()) {
    errors.name = "Please tell us your name.";
  }
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone or WhatsApp number.";
  } else if (!/^[+]?[\d\s().-]{7,}$/.test(values.phone.trim())) {
    errors.phone = "Please enter a valid phone or WhatsApp number.";
  }
  if (!values.message.trim()) {
    errors.message = "Please tell us what kind of help you need.";
  }

  return errors;
}

function validateTourInquiry(values: InquiryValues) {
  const errors = validatePropertyInquiry(values);

  if (!values.partySize.trim()) {
    errors.partySize = "Please share your party size.";
  }

  return errors;
}

function scrollRail(
  rail: HTMLDivElement | null,
  direction: "left" | "right",
  prefersReducedMotion: boolean,
) {
  if (!rail) {
    return;
  }

  const amount = rail.clientWidth * 0.82;
  rail.scrollBy({
    left: direction === "right" ? amount : amount * -1,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
}
