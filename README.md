## Gesco Stay Campaign Landing Pages

This project is a reusable landing-page system for Gesco Stay paid social campaigns.

It includes:

- a data-driven campaign model
- reusable host and traveller landing page sections
- tracked CTA handoff into the live Gesco Stay product
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

The human-help form posts to `/api/lead`.

- In local development, submissions are logged on the server so the flow can be tested without losing data silently.
- In production, `LEAD_WEBHOOK_URL` must be set or the endpoint returns a clear configuration error.

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
4. Trigger a production deploy from the Vercel dashboard or by pushing to the connected branch.

## Validation

Run checks before pushing:

```bash
npm run lint
npm run build
```
