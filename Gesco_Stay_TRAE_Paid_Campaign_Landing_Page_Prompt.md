# Gesco Stay — TRAE GPT 5.4 Solo Agent Prompt
## Paid Social Campaign Landing Page System

You are working as the **Lead Front-End Developer and Conversion UX Developer** for **Gesco Stay (gescostay.com)**.

Your job is to build a scalable landing-page system for our social media paid advertising campaigns.

---

## 1. Business context

Gesco Stay is a short-stay accommodation marketplace focused on African destinations.

Our priority markets are:

- The Gambia
- Nigeria
- Ghana
- Senegal
- Tanzania

Important Nigerian cities include Lagos, Abuja and **Port Harcourt**, alongside other cities defined in the marketing calendar.

We serve two main audiences:

### Hosts

People who own, manage or operate short-stay properties.

This includes:

- local property owners
- property managers
- serviced apartment operators
- landlords
- overseas / diaspora property owners in markets such as the UK, USA and Canada who own property in our African target countries

### Travellers

People searching for short stays in our target African destinations.

This can include:

- domestic travellers
- business travellers
- families
- diaspora returning home
- international visitors
- event-driven or seasonal travellers

Gesco Stay needs to grow both sides of the marketplace together.

Do not create landing pages that focus only on collecting hosts while ignoring the need to generate traveller interest, enquiries and bookings.

---

## 2. Your primary task

We will provide or maintain a **Gesco Stay Social Media Marketing Calendar**.

The calendar will contain paid and organic campaign concepts grouped by:

- country
- city
- audience
- content pillar
- campaign message
- advert/post copy
- platform
- date
- season/event
- CTA
- destination
- host/traveller intent

For every campaign marked as requiring a dedicated landing page, create a landing page which **continues exactly the same story, offer and message that the user saw in the advert**.

There must be strong message continuity:

**Social advert → Landing page → Lead capture → Registration or Human Help**

A user clicking an advert must immediately feel that they have landed on the page they expected.

Do not create generic campaign landing pages that simply send everyone to the Gesco Stay homepage.

---

## 3. September 2026 campaign workflow

The marketing team will prioritise different content pillars depending on:

- current month
- season
- country
- local events
- cultural moments
- travel booking behaviour
- host acquisition needs
- traveller demand
- upcoming tourism periods
- upcoming holidays
- city-level opportunities

We are currently working from **September 2026**.

Do not independently invent dates, festivals, local events or seasonal claims.

Use the Social Media Marketing Calendar as the source of truth.

Landing pages should be generated according to the campaigns prioritised in that calendar.

The system should nevertheless be designed so October, November, December and future campaigns can be added without rebuilding the landing-page architecture.

---

## 4. Campaign data structure

Create a structured campaign configuration so landing pages can be generated from campaign data rather than manually hard-coded every time.

Use an approach appropriate to the existing project such as JSON, TypeScript objects, database-backed configuration or the existing CMS architecture.

Suggested structure:

```text
campaignId
campaignName
campaignStatus
campaignType
country
city
audienceType
audienceSegment
contentPillar
seasonOrEvent
platform
campaignDate
adHeadline
adPrimaryText
landingPageHeadline
landingPageSubheadline
heroImage
supportingImages
primaryCTA
secondaryCTA
registrationType
humanHelpEnabled
leadFormFields
trustMessages
benefits
socialProof
faq
language
trackingCampaignName
utmSource
utmMedium
utmCampaign
utmContent
slug
```

Example slug pattern:

```text
/campaigns/nigeria/lagos/host-september-2026
/campaigns/nigeria/port-harcourt/host-september-2026
/campaigns/ghana/traveller-december-stays
/campaigns/gambia/list-your-property
```

Do not force these exact URLs if the existing Gesco Stay architecture already has a better routing convention.

Inspect the repository first.

---

## 5. Landing-page principle

Every page must be designed around **one main campaign objective**.

Do not overload a host acquisition page with traveller messaging.

Do not overload a traveller booking campaign with host acquisition messaging.

The landing page should inherit:

- campaign headline
- audience
- country
- city if relevant
- imagery
- pain point
- benefit
- offer
- tone
- CTA
- seasonal context

from the advert that brought the visitor there.

### Example

If the advert says:

> Own an apartment in Lagos? Turn your empty nights into bookings with Gesco Stay.

The landing-page hero should continue that idea.

Do **not** replace it with:

> Welcome to Gesco Stay — Discover Africa.

---

## 6. Conversion paths

Every campaign landing page should support a **hybrid conversion approach**.

There are two routes.

### Route A — Do it yourself

Primary CTA examples depending on audience:

#### Host

- List My Property
- Become a Host
- Start Hosting
- Register My Property

#### Traveller

- Find a Stay
- Explore Stays
- Create My Account
- Start Searching

This route should direct the visitor into the appropriate existing Gesco Stay registration/onboarding process.

Where technically possible preserve campaign attribution when sending them into registration.

---

### Route B — Get human help

The visitor must also have a clearly visible option such as:

- **I'd like some help**
- **Talk to our local team**

This should **not** feel like a failure route.

Some users will prefer speaking to a real person before creating an account or listing a property.

Treat this as a normal conversion route.

When selected, open a simple lead form.

#### For hosts we may ask for:

- first name
- phone / WhatsApp number
- email
- property country
- property city
- whether they currently operate a short-stay property
- preferred method of contact

Only ask for information actually required by the campaign.

#### For travellers we may ask for:

- first name
- phone / WhatsApp number or email
- destination
- approximate travel date where relevant
- preferred method of contact

Do not create unnecessarily long forms.

---

## 7. Explain WHY information is requested

Gesco Stay uses transparency as a trust-building principle.

Where we ask for information, explain briefly why we need it.

Examples:

**Phone / WhatsApp**

> So our local team can contact you about your property.

**Email**

> So we can send your Gesco Stay account and hosting information.

**Property city**

> So the right local team can help you.

**Travel destination**

> So we can help find stays in the right area.

Avoid vague phrases such as:

> Enter your details below.

Explain what happens next.

---

## 8. Human-help confirmation experience

After successful submission, show a proper confirmation state.

Example structure:

### Thanks, [First Name]

We've received your details.

A member of our friendly Gesco Stay team will contact you using the details you provided.

In the meantime, the visitor should still have the option to continue themselves.

#### For hosts

**Want to get started now? Create your host account.**

#### For travellers

**Want to start exploring now? Browse Gesco Stay.**

Do not dead-end the user after submitting the lead form.

---

## 9. Localisation

Do not treat Africa as one generic market.

The landing-page architecture must allow us to customise pages by:

- country
- city
- audience
- language
- imagery
- season
- local terminology
- trust concerns
- campaign message
- contact route

For example, the concerns of a diaspora landlord with property in Lagos may differ from those of a local serviced-apartment operator in Accra.

Likewise, traveller messaging for Senegal may differ from traveller messaging for Tanzania.

Allow campaign content to be changed without rebuilding the page.

Do not hard-code "African hosts", "African travellers" or similar generic wording across every page.

---

## 10. Language support

The architecture must support multiple campaign languages.

At minimum, prepare it so campaign copy can later be supplied in:

- English
- French
- Swahili

Do not machine-translate marketing copy yourself unless translation is explicitly provided or requested.

Language should be configurable at campaign level.

---

## 11. Recommended landing-page structure

Use the following as the default structure, but adapt it when the campaign needs a shorter page.

### A. Campaign Hero

Include:

- campaign-specific headline
- supporting sentence
- campaign-specific image/video
- primary CTA
- human-help CTA
- short trust message

The strongest part of the advert should appear above the fold.

---

### B. Why this matters

Explain the campaign benefit in simple language.

#### Host example areas

- reach travellers looking for stays
- showcase the property
- receive booking opportunities
- manage a listing
- get help from the Gesco Stay team

#### Traveller example areas

- discover places to stay
- find properties in the destination they are searching for
- browse accommodation relevant to their trip
- connect with Gesco Stay

Only make claims supported by Gesco Stay's actual product.

Do not invent guarantees, booking volumes, earnings or statistics.

---

### C. How it works

Keep this visually simple.

#### Host example

1. Create your account
2. Add your property
3. Publish your listing
4. Start receiving interest/bookings according to the existing Gesco Stay product flow

#### Traveller example

1. Search
2. Find a stay
3. View the property
4. Continue through the existing booking process

Adjust these steps after inspecting the real platform.

Do not describe functionality that does not exist.

---

### D. Trust section

Trust is particularly important.

Use available real Gesco Stay trust information.

Possible UI areas:

- local support
- clear registration
- secure account
- clear contact process
- actual platform verification features if they exist
- property/host support where available

Never fabricate:

- user counts
- host counts
- booking numbers
- reviews
- ratings
- awards
- press mentions
- security certifications

---

### E. Human-help section

Make the human route visible again.

Example:

### Prefer to speak to someone?

Our friendly team can help you understand the next step.

**[Get Human Help]**

---

### F. FAQ

Questions should be campaign specific.

#### Possible host questions

- How do I become a host?
- What information do I need?
- Can someone help me create my listing?
- Can I register if I live outside the country where my property is?
- What happens after I submit my details?

#### Possible traveller questions

- Do I need an account?
- How do I find a stay?
- Can the Gesco Stay team help me?
- What happens after I send my details?

Only answer according to functionality supported by the existing product.

---

### G. Final CTA

Repeat the campaign's primary conversion.

Do not introduce a completely different message at the bottom of the page.

---

## 12. Mobile-first development

Most campaign traffic is expected to come from social platforms.

Design mobile-first.

Optimise particularly for:

- Instagram
- Facebook
- TikTok
- mobile browsers
- WhatsApp referrals where applicable

Important requirements:

- strong above-the-fold message
- readable typography
- obvious CTA
- fast loading
- lightweight images
- short forms
- appropriate keyboard/input types
- accessible form controls
- good spacing
- minimal distractions
- avoid unnecessary navigation away from the conversion path

The page must remain fully responsive on tablet and desktop.

---

## 13. Social platform continuity

Campaign pages may originate from:

- Facebook
- Instagram
- TikTok
- other paid social platforms added later

Where practical, use the campaign configuration to allow slightly different landing-page copy based on platform or ad creative.

Example:

TikTok creative may be video-led.

Meta creative may use a shorter static-image proposition.

They can share a campaign while preserving message continuity.

Do not create completely separate codebases for each platform.

---

## 14. Analytics and attribution

Campaign performance must be measurable.

Preserve and capture:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
```

Store campaign attribution through the landing-page conversion where technically appropriate.

Implement events using whatever analytics solution already exists in the project.

Create sensible events such as:

```text
landing_page_view
primary_cta_click
human_help_click
lead_form_started
lead_form_submit
host_registration_click
traveller_registration_click
whatsapp_click
phone_click
```

Include the following with events where supported:

```text
campaign_id
campaign_name
country
city
audience_type
content_pillar
platform
```

Do not introduce a new analytics provider without first checking what Gesco Stay currently uses.

---

## 15. Lead handling

Before implementing lead submission, inspect the repository to determine:

- existing backend
- existing forms
- CRM/webhook integrations
- existing email system
- current API patterns
- database conventions
- consent handling

Reuse existing infrastructure where possible.

Do not silently store leads in an arbitrary new database.

The marketing team must later be able to determine:

- which campaign generated the lead
- country
- city
- host/traveller
- contact information
- timestamp
- campaign ID
- platform/UTM
- whether they requested human assistance

Structure the implementation accordingly.

---

## 16. Consent and privacy

Forms must include appropriate consent/privacy treatment based on the existing Gesco Stay website.

Do not create legal wording from scratch where the site already provides approved privacy wording.

Link to the appropriate privacy policy.

Do not pre-tick marketing consent boxes.

Separate operational contact needed to respond to the user's request from optional future marketing consent where required.

---

## 17. Reusable component system

Do not build every campaign page from scratch.

Create reusable components such as:

```text
CampaignLandingPage
CampaignHero
CampaignBenefits
HowItWorks
CampaignTrust
HumanHelpCTA
HumanHelpForm
CampaignFAQ
CampaignFinalCTA
LeadConfirmation
CampaignTracking
```

Use the current naming conventions and framework of the repository rather than forcing these exact names.

Campaign content should normally be data-driven.

A new campaign should ideally require:

1. adding the campaign configuration/content
2. adding the relevant campaign media
3. reviewing the generated page

rather than duplicating a full React/page file.

Important: "data-driven and reusable" describes the *engineering*, not the *design*. The component system must be flexible enough to produce landing pages that genuinely look and feel different from one another (see Section 18a) — it should never become a single rigid visual template that only swaps text and photos underneath.

---

## 18. Brand design

Inspect gescostay.com and the existing project before writing new styling.

Reuse:

- existing colours
- typography
- logo
- border radii
- button styles
- spacing system
- icon treatment
- navigation conventions
- footer conventions

The campaign page should clearly look like Gesco Stay.

However, campaign pages can be more conversion-focused than normal website pages.

Do not redesign the entire Gesco Stay brand.

Do not create a visually unrelated microsite.

---

## 18a. Visual creative direction (applies within the brand system above)

Reusing our brand kit does not mean defaulting to generic layout patterns. Staying on-brand and being visually templated are two different things — we want the first and explicitly do not want the second.

Approach each reference page as a designer who has to justify why this layout, this hero, and this hierarchy are right for *this specific audience and destination* — not as a checklist of sections to fill in. Within our actual colours, type, and logo, take real design risks on layout, imagery, and hierarchy.

Do not default to any of the following unless our brand kit specifically calls for it:

- identical rounded "SaaS cards" with the same soft grey shadow on every section
- a hero that's just headline + subhead + gradient button + stock photo
- ALL-CAPS tracked-out eyebrow labels above every heading
- numbered 01 / 02 / 03 markers on content that isn't actually a sequence
- fade-up-on-scroll animation on every section and a hover-shadow on every card
- generic "Africa" stock imagery instead of the actual destination or property supplied for the campaign
- the same hero layout, image crop, and section order reused unchanged across every country and audience

Before building each reference page (Host and Traveller), produce a short design plan first:

- which brand colours/type are doing which job on this specific page
- what the ONE most characteristic visual moment in the hero is — a real property, a real neighbourhood, a specific host's situation — not a generic travel-brand feeling
- what the one deliberate layout choice is that makes this page feel distinctly like *this* campaign and not like a template with the Gesco Stay logo dropped in
- confirm everything else on the page stays quiet and disciplined around that one choice

After building, do a self-critique pass: flag anything on the page that would look identical if you swapped in a different logo, country, or audience, and revise it before generating further campaign pages from the calendar.

Carry this same discipline into every subsequent campaign page, not just the two reference builds — the design plan and self-critique steps are part of the standard workflow (see Section 25), not a one-off exercise.

---

## 19. Campaign imagery

Campaign imagery must reflect the destination and audience.

Avoid generic stock-style representations of "Africa".

When campaign assets are supplied, use them.

Architecture should support:

- static campaign hero image
- carousel if required
- short campaign video
- property photography
- destination photography
- host-focused imagery
- traveller-focused imagery

Images should have meaningful alt text and responsive loading.

### 19a. Country and audience should look distinct, not just say different words

A Lagos host campaign and a Zanzibar traveller campaign should feel visibly different from each other — not the same layout with different photos and copy swapped in underneath. Let the destination and audience genuinely influence layout emphasis, imagery treatment, and pacing (for example: a diaspora-host campaign may lean on reassurance and clarity; a beach-destination traveller campaign may lean on the destination itself as the hero). Reusable components should flex enough to support this; if a component can only ever produce one visual outcome regardless of the campaign data poured into it, that component is too rigid and should be revisited.

---

## 20. SEO and paid-campaign indexing

Although pages primarily support paid campaigns:

- create sensible page titles
- descriptions
- canonical handling
- Open Graph metadata
- social preview metadata

Decide whether short-lived campaign pages should be indexable based on existing site conventions.

Do not automatically index hundreds of near-duplicate paid campaign pages.

---

## 21. Accessibility

Follow the accessibility standard already used by the project.

At minimum:

- semantic headings
- labels for form controls
- keyboard navigation
- visible focus states
- appropriate contrast
- meaningful alt text
- proper button/link semantics
- error messages associated with fields

---

## 22. Form validation

Use friendly inline validation.

Do not wipe the form after an error.

For telephone numbers, support international numbers because some hosts may own property in Africa while living in:

- United Kingdom
- United States
- Canada
- elsewhere

Do not assume the phone's country code from the property's country.

Property location and user's current country are separate concepts.

---

## 23. Existing registration journey

Inspect Gesco Stay's actual:

- host registration
- traveller registration
- login
- onboarding
- listing creation

before connecting CTAs.

Use the genuine application routes.

Do not create dummy `/signup` URLs simply because the real route is not immediately obvious.

---

## 24. Failure states

Create good handling for:

- form validation error
- API failure
- slow connection
- duplicate submission
- missing campaign
- invalid campaign URL
- missing campaign imagery

Never silently lose a submitted lead.

---

## 25. Development workflow

Before coding:

### Step 1 — Inspect the repository

Understand:

- framework
- route structure
- design system
- existing reusable components
- authentication
- forms
- APIs
- analytics
- CMS/content storage
- environment variables
- deployment approach

### Step 2 — Identify existing Gesco Stay flows

Find:

- host signup URL
- traveller signup URL
- privacy URL
- terms URL
- analytics implementation
- existing lead/contact functionality

### Step 3

Design the reusable campaign architecture.

### Step 4

Create the campaign configuration model.

### Step 5

Build one reference Host campaign page, including the design plan and self-critique pass described in Section 18a.

### Step 6

Build one reference Traveller campaign page, including the design plan and self-critique pass described in Section 18a.

### Step 7

Once the reusable templates are working, start generating the **September 2026** campaign landing pages based on the Social Media Marketing Calendar — applying the same design-plan and self-critique discipline to each new campaign, not just the two reference builds.

### Step 8 — Test

Test:

- mobile
- tablet
- desktop
- CTA links
- forms
- validation
- campaign parameters
- UTM persistence
- analytics
- accessibility
- loading speed

---

## 26. Interaction with the Social Media Marketing Calendar

When a campaign calendar is supplied to the repository, parse each relevant row.

For each **PAID** campaign determine:

1. Who is being targeted?
2. Which country?
3. Which city?
4. Host or traveller?
5. What is the content pillar?
6. What is the advert's main promise/message?
7. What seasonal/event context is being used?
8. What action does the advert ask the user to take?
9. Does the campaign require a dedicated landing page?
10. What should the primary conversion be?
11. What should the human-help route collect?
12. Which registration journey should follow?
13. What media assets belong to the campaign?

Then create the corresponding campaign configuration and landing page.

---

## 27. Important conversion rule

The landing page is an extension of the advertisement.

Think of the experience as **ONE conversation**:

```text
Advert
"You have this problem/opportunity."

        ↓

Landing page
"Here is how Gesco Stay can help."

        ↓

Choice
"I'll do it myself."

        OR

"I'd like a real person to help me."

        ↓

Conversion

Gesco Stay account / registration

        OR

Lead submitted to local team
```

Maintain this logic on every campaign.

---

## 28. Content-writing style

Gesco Stay copy should be:

- simple
- friendly
- clear
- reassuring
- human
- locally relevant
- direct

Avoid corporate marketing jargon.

Avoid exaggerated phrases such as:

- revolutionise
- unlock limitless potential
- game-changing
- Africa's ultimate...
- transform your journey

Avoid unnecessarily complicated sentences.

Avoid generic AI-style copy.

Prefer language someone would naturally say.

---

## 29. Do not make assumptions

If campaign data is missing, do not invent important commercial information.

Examples:

- host commission
- fees
- guaranteed income
- discounts
- payment methods
- response times
- property verification
- insurance
- cancellation protection
- exact booking numbers
- availability
- customer testimonials

Use existing verified product information or leave the component/configuration ready for the marketing team to supply the information.

---

## 30. Output required from you

Start by inspecting the current codebase.

Then provide a short implementation summary showing:

1. current stack
2. relevant existing routes/components
3. proposed campaign landing-page architecture
4. campaign configuration structure
5. lead-capture approach
6. analytics approach
7. host registration connection
8. traveller registration connection
9. human-help workflow
10. files/components you intend to create or modify

Then implement the architecture.

**Do not stop at producing a plan.**

Start building it.

The final architecture must allow the marketing team to repeatedly give you new campaigns from the Social Media Marketing Calendar and have dedicated matching landing pages created quickly without rebuilding the whole system.

---

## 31. Source-of-truth rule

The **Social Media Marketing Calendar is the source of truth for campaign strategy**.

TRAE should **not independently decide**:

- which September campaign deserves priority
- which seasonal event should be targeted
- what commercial offer should be used
- what audience should be prioritised
- what local event should be promoted
- what campaign message should be changed

The marketing calendar will define those decisions.

TRAE's job is to translate the approved campaign strategy into:

1. campaign configuration
2. matching landing page
3. tracking
4. lead capture
5. self-registration path
6. human-help path

This prevents development logic from inventing or overriding marketing strategy.

Note: this source-of-truth rule governs campaign *strategy* (what offer, what audience, what timing). It does not limit design creativity — see Section 18a. TRAE should still exercise real design judgement on layout, imagery, and hierarchy for whatever campaign the calendar specifies.

---

## 32. Recommended marketing-calendar fields for development

When reading the Social Media Marketing Calendar, look for or support fields such as:

```text
Campaign ID
Campaign Date
Country
City
Platform
Paid / Organic
Audience Type
Audience Segment
Content Pillar
Season / Local Event
Advert Headline
Advert Primary Copy
Creative Brief
Landing Page Required
Landing Page Message
Primary CTA
Human Help CTA
Registration Destination
Lead Fields
Campaign Slug
UTM Campaign
Status
```

The campaign calendar should be usable as a direct input into the landing-page workflow.

---

# Final instruction

Treat the paid social advert and its landing page as a single conversion journey.

The campaign should feel consistent from first impression through to:

- self-registration as a host
- self-registration as a traveller
- or requesting help from the local Gesco Stay team

Build the system once, then make future campaign landing pages fast to launch, easy to localise, easy to measure and easy for the marketing team to manage — and genuinely distinct from one another, not templated (see Section 18a and 19a). Consistency of brand and funnel logic should never come at the cost of every page looking the same.
