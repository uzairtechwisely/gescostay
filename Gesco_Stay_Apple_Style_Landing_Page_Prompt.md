# GescoStay — "Hidden Gems in Lagos" Landing Page
### Build Brief for TRAE (GPT-5.4)

---

## 0. Context & Non-Negotiables

You have already been given the GescoStay brand kit, logos, and design principles from the earlier campaign landing-page prompt (`Gesco_Stay_TRAE_Paid_Campaign_Landing_Page_Prompt.md`). **This build must stay inside that brand system** — same color palette, typography family, logo usage, and tone of voice as gescostay.com. Do not invent a new visual identity. Do not default to a generic template look (no generic SaaS gradients, no stock "AI startup" card grids, no cliché hero-with-blob-shapes).

Within that brand system, you have full creative freedom on layout, motion, and micro-interactions. Push it — this should feel like a piece of craft, not a form.

**Reference for feel, not for content:** apple.com's product pages. Study how Apple uses:
- A single continuous vertical scroll as the entire navigation model
- Large-format typography that does the emotional heavy lifting
- Parallax and scroll-linked reveals (elements that scale, fade, pin, and translate as you scroll — not just fade-in-on-scroll)
- Generous whitespace and restraint — one idea per screen
- Copy that is short, declarative, and confident

GescoStay should feel like that, but warm, human, and unmistakably African — not cold or clinical like a tech product page.

---

## 1. Core Narrative (weave throughout, never dump as one block)

This is the emotional spine of the whole page. Do not paste it as a paragraph anywhere. Break it into short, punchy fragments and distribute them across sections as headlines, sub-lines, and transition moments — the way Apple spreads one big idea across an entire scroll.

> Welcome to Lagos, Nigeria. GescoStay is built in Africa to give you true African hospitality and warmth — from booking to checkout. We work with local hosts who share our values of real hospitality. Every stay you book supports the local economy and helps hosts get paid instantly and fairly.

Suggested fragment breakdown (adapt freely, keep the spirit):
- Hero: *"Welcome to Lagos."* / *"This is African hospitality."*
- What is GescoStay: *"Built in Africa. For the world."* — one line on local hosts, one line on instant fair payouts.
- Hidden Gems section intro: *"Every stay tells a story."*
- Hosts section intro: *"The people behind the welcome."*
- Closing/action section: *"Book with us. Support Lagos."*

**Copy rules for the whole page:**
- Short sentences. Fragments are fine.
- Bigger, bolder type over more words — if a sentence can lose a word, lose it.
- CTAs are verbs: "Explore Stays", "Meet the Hosts", "Book Now", "Talk to Us" — never "Learn More" or "Click Here".

---

## 2. Motion & Layout System

- **Single scroll page**, no traditional nav bar with dropdown menus — a minimal sticky header with logo + one or two anchor CTAs is fine (Apple-style).
- **Scroll-linked animation**, not just fade-up-on-scroll:
  - Hero text/image scales or parallaxes at different speeds as the user scrolls past it.
  - Section transitions where background color/image shifts as you cross into the next section (scroll-snap or scroll-driven color interpolation).
  - Property cards and host cards animate in with slight stagger and depth (translateY + scale + opacity), not a flat fade.
- Use whatever your best available tooling is for this (e.g. GSAP + ScrollTrigger, Framer Motion, or native CSS scroll-timeline/scroll-driven animations) — pick what renders smoothest, prioritize 60fps and low jank over library preference.
- Respect `prefers-reduced-motion` — provide a non-parallax fallback.
- Mobile: parallax intensity should be reduced/simplified, but scroll-linked reveals should still feel alive. Test on a real narrow viewport, not just resized desktop.

---

## 3. Page Structure

### Section 1 — Hero
- Full-bleed, immersive Lagos/African hospitality visual (photo or video loop from brand kit).
- Massive, bold headline: something like **"Welcome to Lagos."**
- One short sub-line reinforcing warmth/hospitality.
- Single primary CTA that scrolls down to the property listings (not a link out yet — keep them on the page).
- Parallax: background moves slower than foreground text as user scrolls.

### Section 2 — What is GescoStay
- Big statement headline (not a paragraph). e.g. **"Built in Africa. For real hospitality."**
- 2–3 short supporting lines max, each can be its own scroll-revealed beat:
  - Local hosts, shared values.
  - Hosts paid instantly and fairly.
  - Booking with us supports the local economy.
- Consider a subtle scroll-linked visual (e.g. a host handshake / welcome moment, or an animated stat/counter tied to scroll position) rather than a static image block.

### Section 3 — "Hidden Gems in Lagos" (Property Listings)
- Section headline: **"Hidden Gems in Lagos"** (or your best on-brand variant — keep it short and exciting).
- Horizontally scrollable carousel of property cards (drag/swipe + scroll-wheel support on desktop, native touch swipe on mobile). Do not paginate with dots-only — this should feel tactile.
- Each card:
  - One hero image (image should dominate the card).
  - Title, e.g. "Luxury 3-Bed Stay with Pool"
  - One short description line, e.g. "Ideal for small groups"
  - **Hover interaction:** elegant animated border/edge glow or outline-draw effect on hover (not a heavy shadow or scale-jump) — think a thin light tracing the card's edge, or a soft gradient border that animates in.
- **On click → expand into a modal:**
  - Modal title: **"Great choice! Let's check availability."**
  - Show the property image/title again briefly for context.
  - Two buttons:
    1. **"Browse and Book"** → opens `gescostay.com` in the *same window/tab*.
    2. **"Help Me Book"** → transitions the modal (don't close/reopen jarringly — morph it) into a lead capture form with fields: Name, Email, Phone, and a free-text field ("Tell us what you need help with").
  - On submit of the "Help Me Book" form, show an on-screen confirmation state inside the same modal (see data handling in Section 6 for storage).

### Section 4 — "Meet Our Hosts"
- Section headline reinforcing the human story, e.g. **"The people behind the welcome."**
- Host cards (can be a scroll-reveal grid or another horizontal scroller — your call, but keep visual rhythm distinct from the property carousel so the two sections don't feel identical):
  - Host photo
  - Name (optional but nice)
  - One short, human description line, e.g. "Enjoys countryside mornings" / "Third-generation Lagos host"
- Keep these warm and personal — this is the emotional proof of "real African hospitality," so let personality show in the copy, not corporate bios.

### Section 5 — Two Action Cards (closing conversion moment)
Two large, side-by-side (stacked on mobile) cards, visually distinct as two different paths:

**Card A — Guided path**
- Headline: **"Want a personal tour?"**
- Sub-line: "We'll guide you over a phone or video call."
- CTA opens a modal form: Name, Email, Phone, Party Size, and a free-text field for their specific request.
- On submit: form data is written to the database (see Section 6), and the modal transitions in place to a confirmation state:
  > "Thank you. Our team will speak to you soon. Meanwhile, take a look at what other travellers are saying on our Instagram." — include a working link/button to the GescoStay Instagram.

**Card B — Self-serve path**
- Headline: **"Prefer to browse and book yourself?"**
- CTA button **"Browse and Book"** → opens `gescostay.com` in the same window.

Design these two cards to feel like a genuine fork in the road — equal visual weight, distinct icon/motion treatment per card, not "primary vs. secondary" styling. Both are valid choices for the user.

### Footer
- Minimal, on-brand. Logo mark, one line of copyright/tagline.
- Links: **Privacy Policy** and **Terms and Conditions** (placeholder pages/routes are fine if final legal copy isn't ready yet — stub them cleanly rather than dead-linking).

---

## 4. Modals — Interaction Quality Bar

Both modal flows (property "Help Me Book" and the "Personal tour" card) should:
- Open with a smooth scale/fade transition, not an abrupt pop.
- Morph between states in place (card → form → confirmation) rather than closing and reopening a new modal — this is a key part of making the interaction feel premium.
- Trap focus and be dismissible via overlay click, close icon, and `Esc` (accessibility baseline).
- Validate fields inline before submit (required: name, email, phone at minimum) with friendly, non-technical error copy.
- Show a clear loading/submitting state on the button while the request is in flight.

---

## 5. Data Handling

- Both lead-capture forms ("Help Me Book" and "Personal tour") should submit to a serverless API route that writes to our standard Vercel SQL database (Vercel Postgres or equivalent already provisioned for this project).
- Suggested minimal schema (adapt to whatever table structure the project already uses, if one exists — check before creating a new one):
  - `id`, `created_at`, `source` (e.g. "property_help_me_book" vs "personal_tour"), `name`, `email`, `phone`, `party_size` (nullable, tour form only), `property_reference` (nullable, property form only), `message`
- Handle submission errors gracefully in the UI (don't let a failed DB write look like a successful confirmation) — show a retry state or fallback contact method if the write fails.
- No need to build an admin dashboard for this — just reliable, correctly-typed writes.

---

## 6. Technical & Quality Bar

- Fully responsive: this must look intentional (not just "not broken") on mobile — re-check hero scale, carousel touch behavior, and modal sizing specifically on small viewports.
- Performance: lazy-load below-the-fold images, optimize the hero media, keep scroll-linked JS calculations cheap (avoid layout thrashing).
- Accessibility: semantic HTML, alt text on all property/host images, keyboard-navigable carousel and modals, sufficient color contrast within brand palette.
- Keep component structure clean and reusable (e.g. `PropertyCard`, `HostCard`, `LeadFormModal`) so future campaign pages can reuse these pieces, consistent with the scalable system we're building.

---

## 7. What "Done" Looks Like

Someone should be able to land on this page, scroll through it in under a minute, feel the warmth of the "real African hospitality" story without reading a wall of text, be genuinely delighted by at least two or three motion moments, and reach a booking action without ever feeling lost or slowed down by friction. If it feels like a template with the copy swapped out, it's not done yet.
