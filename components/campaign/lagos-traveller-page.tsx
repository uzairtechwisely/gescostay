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
        title: "Hosts paid fairly, and fast",
        body: "Local African hosts get paid quickly and fairly, so more of every booking supports the local economy.",
      },
      {
        title: "Real African hospitality, checked",
        body: "Every host is reviewed against real African warmth and hospitality criteria — not just a star rating.",
      },
      {
        title: "Properties verified before listing",
        body: "Each stay is thoroughly checked before it goes live, so what you see is what you get.",
      },
      {
        title: "Built in Africa, for Africa",
        body: "Gesco Stay is made by and for the continent — booking, hosting, and support that understands the market.",
      },
    ],
    [],
  );

  return (
    <>
      <CampaignTracking campaign={campaign} />
      <div className="bg-[var(--color-brand-bg)] text-[var(--color-brand-ink)]">
        <header className="sticky top-0 z-40 border-b border-[var(--color-brand-soft-border)] bg-[rgba(255,250,244,0.86)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <GescoMark size={38} />
              <div>
                <p className="text-lg font-semibold tracking-[-0.01em]">
                  <span className="text-[var(--color-brand-accent)]">g</span>stay
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
                Explore Stays
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
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,19,23,0.22),rgba(14,19,23,0.78)_72%,rgba(14,19,23,0.94))]" />
            </div>

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
                  className="reveal-on-scroll mt-5 max-w-2xl text-[3.2rem] font-extrabold leading-[0.96] tracking-[-0.03em] sm:text-[4.75rem] lg:text-[5.75rem]"
                >
                  Did <span className="text-[var(--color-brand-accent)]">Lagos</span>
                  <br />
                  miss you?
                </h1>
                <p
                  data-reveal
                  className="reveal-on-scroll mt-6 max-w-xl text-lg leading-8 text-white/82 sm:text-xl"
                  style={{ transitionDelay: "100ms" }}
                >
                  Book with Gesco Stay for exclusive stays curated by local
                  hosts &mdash; from hidden gems to the city&apos;s most loved
                  homes.
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
                    Explore Stays
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

          <section className="border-b border-[var(--color-brand-soft-border)] bg-[var(--color-brand-ink)]">
            <div
              className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-5 py-6 sm:px-6 lg:px-8"
              style={{ scrollbarWidth: "none" }}
            >
              {(campaign.seasonMoments ?? []).map((moment) => (
                <div
                  key={moment.label}
                  className="flex min-w-[15.5rem] flex-[0_0_15.5rem] items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <span className="mt-0.5 rounded-full bg-[var(--color-brand-accent)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white">
                    {moment.label}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-snug text-white">
                      {moment.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="border-b border-[var(--color-brand-soft-border)] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
              <div
                data-reveal
                className="reveal-on-scroll mb-9 max-w-xl"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-accent)]">
                  Why Gesco Stay
                </p>
                <h2 className="mt-3 text-[2rem] font-bold leading-[1.04] tracking-[-0.02em] text-[var(--color-brand-ink)] sm:text-[2.5rem]">
                  The spirit of African hospitality.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {usps.map((usp, index) => (
                  <article
                    key={usp.title}
                    data-reveal
                    className="reveal-on-scroll rounded-[1.5rem] border border-[var(--color-brand-soft-border)] bg-[var(--color-brand-bg)] p-5"
                    style={{ transitionDelay: `${60 + index * 70}ms` }}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-brand-accent-soft)] text-sm font-bold text-[var(--color-brand-accent)]">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-base font-semibold leading-snug text-[var(--color-brand-ink)]">
                      {usp.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-brand-muted)]">
                      {usp.body}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            id="properties"
            className="relative overflow-hidden border-b border-[var(--color-brand-soft-border)] bg-[var(--color-brand-bg)]"
          >
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div data-reveal className="reveal-on-scroll">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-accent)]">
                    Featured stays
                  </p>
                  <h2 className="mt-3 max-w-lg text-[2rem] font-bold leading-[1.02] tracking-[-0.02em] text-[var(--color-brand-ink)] sm:text-[2.5rem]">
                    Hidden gems, ready to book.
                  </h2>
                </div>
                <div
                  data-reveal
                  className="reveal-on-scroll flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => scrollRail(propertyRailRef.current, "left", prefersReducedMotion)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-brand-soft-border)] bg-white text-lg transition hover:border-[var(--color-brand-accent)]"
                    aria-label="Scroll properties left"
                  >
                    &larr;
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRail(propertyRailRef.current, "right", prefersReducedMotion)}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-brand-soft-border)] bg-white text-lg transition hover:border-[var(--color-brand-accent)]"
                    aria-label="Scroll properties right"
                  >
                    &rarr;
                  </button>
                </div>
              </div>

              <div
                ref={propertyRailRef}
                className="property-rail mt-8 flex gap-5 overflow-x-auto pb-4"
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
                    className="reveal-on-scroll group relative min-w-[16.5rem] flex-[0_0_16.5rem] overflow-hidden rounded-[1.6rem] border border-[var(--color-brand-soft-border)] bg-white text-left shadow-[var(--shadow-card)] transition hover:-translate-y-1 sm:min-w-[19rem] sm:flex-[0_0_19rem]"
                    style={{ transitionDelay: `${100 + index * 60}ms` }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.title}
                        fill
                        sizes="(max-width: 640px) 72vw, 19rem"
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-ink)]">
                        Featured
                      </span>
                    </div>
                    <div className="p-4">
                      {property.area ? (
                        <p className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-brand-muted)]">
                          {property.area}
                        </p>
                      ) : null}
                      <h3 className="mt-1.5 text-base font-semibold leading-snug text-[var(--color-brand-ink)]">
                        {property.title}
                      </h3>
                      {property.priceFrom ? (
                        <p className="mt-2 text-sm text-[var(--color-brand-ink)]">
                          from{" "}
                          <span className="font-bold">
                            {property.priceFrom}
                          </span>
                          <span className="text-[var(--color-brand-muted)]">
                            {" "}
                            /night
                          </span>
                        </p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="border-b border-[var(--color-brand-soft-border)] bg-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
              <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
                <div data-reveal className="reveal-on-scroll">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-accent)]">
                    Meet our hosts
                  </p>
                  <h2 className="mt-3 max-w-sm text-[2rem] font-bold leading-[1.02] tracking-[-0.02em] text-[var(--color-brand-ink)] sm:text-[2.5rem]">
                    The people behind the welcome.
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {(campaign.hostProfiles ?? []).map((host, index) => (
                    <HostCard key={host.name} host={host} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-[var(--color-brand-soft-border)] bg-[var(--color-brand-bg)]">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-16">
              <div className="grid gap-5 lg:grid-cols-2">
                <ActionPathCard
                  dataReveal
                  title="Want a personal tour?"
                  body="We will guide you over a phone or video call and help you narrow down the right Lagos area or stay type."
                  actionLabel="Talk to Us"
                  tone="dark"
                  onClick={openTourModal}
                />
                <ActionPathCard
                  dataReveal
                  title="Prefer to browse and book yourself?"
                  body="Go straight into the live Gesco Stay experience with your campaign context still attached."
                  actionLabel="Browse and Book"
                  tone="light"
                  onClick={() => {
                    trackEvent("lagos_browse_and_book_click", {
                      campaign_id: campaign.campaignId,
                    });
                    window.location.assign(getBrowseUrl());
                  }}
                />
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-[var(--color-brand-bg)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="flex items-center gap-2.5">
              <GescoMark size={34} />
              <div>
                <p className="font-semibold">
                  <span className="text-[var(--color-brand-accent)]">g</span>
                  {siteConfig.name.replace("Gesco ", "")}
                </p>
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(10,14,18,0.58)] p-4 sm:items-center"
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
              className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-[0_40px_120px_rgba(10,14,18,0.3)] sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex justify-end">
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
    <span
      className="flex shrink-0 items-center justify-center rounded-[0.6rem] bg-[var(--color-brand-accent)] font-serif font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.58 }}
      aria-hidden="true"
    >
      g
    </span>
  );
}

function HostCard({
  host,
  index,
}: {
  host: CampaignHostProfile;
  index: number;
}) {
  return (
    <article
      data-reveal
      className="reveal-on-scroll overflow-hidden rounded-[2rem] border border-[var(--color-brand-soft-border)] bg-white shadow-[var(--shadow-card)]"
      style={{ transitionDelay: `${100 + index * 90}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={host.image}
          alt={`${host.name}, Gesco Stay host`}
          fill
          sizes="(max-width: 768px) 80vw, 24vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-2xl tracking-[-0.03em] text-[var(--color-brand-ink)]">
          {host.name}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--color-brand-muted)]">
          {host.description}
        </p>
      </div>
    </article>
  );
}

function ActionPathCard({
  title,
  body,
  actionLabel,
  tone,
  onClick,
  dataReveal = false,
}: {
  title: string;
  body: string;
  actionLabel: string;
  tone: "dark" | "light";
  onClick: () => void;
  dataReveal?: boolean;
}) {
  const className =
    tone === "dark"
      ? "border-[var(--color-brand-ink)] bg-[var(--color-brand-ink)] text-white"
      : "border-[var(--color-brand-soft-border)] bg-[var(--color-brand-bg)] text-[var(--color-brand-ink)]";

  return (
    <article
      data-reveal={dataReveal || undefined}
      className={`reveal-on-scroll rounded-[2.2rem] border p-7 sm:p-9 ${className}`}
    >
      <p
        className={`text-sm font-medium ${
          tone === "dark" ? "text-white/62" : "text-[var(--color-brand-muted)]"
        }`}
      >
        Choose your route
      </p>
      <h2 className="mt-4 text-[2.15rem] leading-tight tracking-[-0.04em] sm:text-[2.7rem]">
        {title}
      </h2>
      <p
        className={`mt-4 max-w-xl text-base leading-8 ${
          tone === "dark" ? "text-white/72" : "text-[var(--color-brand-muted)]"
        }`}
      >
        {body}
      </p>
      <button
        type="button"
        onClick={onClick}
        className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition ${
          tone === "dark"
            ? "bg-[var(--color-brand-accent)] text-white hover:bg-[var(--color-brand-accent-strong)]"
            : "border border-[var(--color-brand-soft-border)] bg-white text-[var(--color-brand-ink)] hover:border-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-soft)]"
        }`}
      >
        {actionLabel}
      </button>
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
        body={`Your reference is ${modal.referenceId}. A Gesco Stay team member will follow up using the details you shared.`}
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
