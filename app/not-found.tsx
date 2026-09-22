import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-20 sm:px-6 lg:px-8">
      <div className="max-w-xl rounded-[2rem] border border-[var(--color-brand-border)] bg-white p-10 text-center shadow-[var(--shadow-card)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-brand-muted)]">
          Campaign not found
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-brand-ink)]">
          We couldn&apos;t find that landing page.
        </h1>
        <p className="mt-4 text-base leading-8 text-[var(--color-brand-muted)]">
          The campaign URL may be invalid, unpublished, or waiting for the
          marketing calendar to supply the final configuration.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-brand-primary)] px-6 text-sm font-semibold text-[var(--color-brand-ink)] transition hover:bg-[var(--color-brand-primary-strong)]"
        >
          Back to campaign hub
        </Link>
      </div>
    </main>
  );
}
