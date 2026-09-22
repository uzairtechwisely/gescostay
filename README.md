## GescoStay Campaign Landing Pages

This project is a reusable landing-page system for GescoStay paid social campaigns.

It includes:

- a data-driven campaign model
- reusable host and traveller landing page sections
- tracked CTA handoff into the live GescoStay product
- a human-help lead form flow
- a server endpoint ready for webhook-based lead routing

## Local development

1. Install dependencies.

```bash
npm install
```

2. Create a local environment file from `.env.example`.

3. Start the development server.

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Campaign routes

Each Lagos audience is a dedicated subdomain, resolved by [`proxy.ts`](./proxy.ts) rewriting the request to a fixed internal page:

- `lagos-hosts.gescostay.com` → `/lp/lagos/hosts` — property owner acquisition
- `lagos-travel.gescostay.com` → `/lp/lagos/travellers` — Lagos Sept–Dec traveller story

The original path-based routes still work for internal QA/staging without needing a subdomain:

- `/campaigns/nigeria/lagos/host-september-2026`
- `/campaigns/nigeria/lagos/traveller-q4-2026`
- `/campaigns/ghana/accra/traveller-september-2026` (draft, paused — Ghana campaigns are on hold while the Lagos push runs)

Add future pages by updating [`lib/campaigns.ts`](./lib/campaigns.ts) with new campaign entries and media prompts, then add a matching subdomain mapping in `proxy.ts` and a fixed page under `app/lp/...`.

### Testing subdomains locally

Wildcard DNS for `*.gescostay.com` is not set up yet, so simulate the subdomain with a `Host` header:

```bash
curl -H "Host: lagos-hosts.localhost:3000" http://localhost:3000/
curl -H "Host: lagos-travel.localhost:3000" http://localhost:3000/
```

Or add entries to `/etc/hosts` (`127.0.0.1 lagos-hosts.localhost lagos-travel.localhost`) and open `http://lagos-hosts.localhost:3000` in a browser.

### DNS and Vercel setup (manual, required before going live)

1. In Vercel project settings → Domains, add `lagos-hosts.gescostay.com` and `lagos-travel.gescostay.com` (or a wildcard `*.gescostay.com` if more subdomains are planned).
2. In your DNS provider, add a `CNAME` record for each subdomain pointing to `cname.vercel-dns.com` (or the target Vercel gives you), or one wildcard `CNAME` for `*.gescostay.com`.
3. Wait for DNS propagation and Vercel to issue SSL certificates for each domain.

## Lead handling

There are two capture paths:

- The host page's human-help form posts to `/api/lead`, which forwards the submission to `LEAD_WEBHOOK_URL` (Zapier, Make, a CRM, etc.).
- The Lagos traveller page's "Help Me Book" and "Talk to Us" modals post to `/api/inquiries`, which writes directly to a Postgres table (`@vercel/postgres`).

In local development, submissions are logged on the server instead so the flow can be tested without external services configured. In production, each path requires its own configuration (`LEAD_WEBHOOK_URL`, or a `POSTGRES_URL`) or the endpoint returns a clear configuration error.

### Email confirmation

Both paths also send email via [Resend](https://resend.com) — a confirmation to the person who submitted (when their email is available) and a notification to `LEAD_NOTIFICATION_EMAIL`. This is skipped (not an error) if `RESEND_API_KEY` is unset.

To set it up:

1. Create a free account at [resend.com](https://resend.com) and generate an API key.
2. Set `RESEND_API_KEY` in your environment.
3. Set `LEAD_NOTIFICATION_EMAIL` to the inbox that should receive lead notifications.
4. **Sandbox limitation:** until a domain is verified on Resend, the default sender (`onboarding@resend.dev`) can only deliver to the email address the Resend account was created with — confirmation emails to real leads won't arrive. To send to real travellers/hosts, verify `gescostay.com` (or a subdomain) in Resend's dashboard, then set `EMAIL_FROM` to an address on that domain, e.g. `GescoStay <leads@gescostay.com>`.

## Analytics

The app uses a Google Analytics style `gtag` setup and sends campaign events such as:

- `landing_page_view`
- `human_help_click`
- `lead_form_submit`
- `host_registration_click`
- `traveller_registration_click`
- `phone_click`
- `whatsapp_click`

Campaign and UTM context are attached where available.

## GitHub and Vercel deployment

1. Create a GitHub repository and push this project.
2. Import the repository into Vercel.
3. Add these environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_GA_ID`
   - `LEAD_WEBHOOK_URL`
   - `RESEND_API_KEY`, `LEAD_NOTIFICATION_EMAIL`, `EMAIL_FROM` (see [Email confirmation](#email-confirmation))
4. Trigger a production deploy from the Vercel dashboard or by pushing to the connected branch.

## Validation

Run checks before pushing:

```bash
npm run lint
npm run build
```
