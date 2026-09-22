export type AudienceType = "host" | "traveller";
export type Platform = "facebook" | "instagram" | "tiktok";
export type CampaignLanguage = "en" | "fr" | "sw";
export type FormFieldType = "text" | "email" | "tel" | "select" | "date";

export type LeadFieldKey =
  | "firstName"
  | "phone"
  | "email"
  | "propertyCountry"
  | "propertyCity"
  | "operatesShortStay"
  | "contactPreference"
  | "destination"
  | "travelDate";

export type LeadFormField = {
  key: LeadFieldKey;
  label: string;
  type: FormFieldType;
  placeholder: string;
  required?: boolean;
  helpText: string;
  options?: Array<{ label: string; value: string }>;
};

export type CampaignFaq = {
  question: string;
  answer: string;
};

export type CampaignStep = {
  title: string;
  description: string;
};

export type CampaignValue = {
  title: string;
  description: string;
};

export type CampaignSeasonMoment = {
  label: string;
  title: string;
  description: string;
};

export type CampaignAreaGuide = {
  name: string;
  vibe: string;
  description: string;
};

export type CampaignPropertyFeature = {
  reference: string;
  title: string;
  description: string;
  image: string;
  area?: string;
  priceFrom?: string;
};

export type CampaignHostProfile = {
  name: string;
  description: string;
  image: string;
};

export type SupportContact = {
  label: string;
  phone: string;
  whatsapp?: string;
};

export type CampaignConfig = {
  campaignId: string;
  campaignName: string;
  campaignStatus: "draft" | "active";
  campaignType: "paid-social";
  country: string;
  city: string;
  audienceType: AudienceType;
  audienceSegment: string;
  contentPillar: string;
  seasonOrEvent: string;
  platform: Platform;
  campaignDate: string;
  adHeadline: string;
  adPrimaryText: string;
  landingPageHeadline: string;
  landingPageSubheadline: string;
  heroImage: string;
  supportingImages: string[];
  primaryCTA: string;
  secondaryCTA: string;
  registrationType: "host-listing" | "traveller-search";
  registrationUrl: string;
  leadFormTitle: string;
  leadFormIntro: string;
  leadFormFields: LeadFormField[];
  trustMessages: string[];
  benefits: CampaignValue[];
  socialProofLabel: string;
  faq: CampaignFaq[];
  howItWorks: CampaignStep[];
  humanHelpHeading: string;
  humanHelpBody: string;
  finalCtaTitle: string;
  finalCtaBody: string;
  language: CampaignLanguage;
  trackingCampaignName: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  slugSegments: string[];
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
  indexable?: boolean;
  designVariant?: "apple-lagos-hidden-gems" | "editorial-lagos-traveller";
  seasonMoments?: CampaignSeasonMoment[];
  areaGuides?: CampaignAreaGuide[];
  bookingReasons?: CampaignValue[];
  showcaseProperties?: CampaignPropertyFeature[];
  hostProfiles?: CampaignHostProfile[];
  supportContact: SupportContact;
};

const imageBase =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=";

function createImage(prompt: string, imageSize: string) {
  return `${imageBase}${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

const contacts: Record<string, SupportContact> = {
  Nigeria: {
    label: "Nigeria support",
    phone: "+2348055494590",
    whatsapp: "https://wa.me/2348055494590",
  },
  Ghana: {
    label: "Ghana support",
    phone: "+233208252004",
  },
};

export const campaigns: CampaignConfig[] = [
  {
    campaignId: "ng-lagos-host-sep-2026",
    campaignName: "Lagos Host Acquisition September 2026",
    campaignStatus: "active",
    // Served at lagos-hosts.gescostay.com via proxy.ts host-based rewrite.
    campaignType: "paid-social",
    country: "Nigeria",
    city: "Lagos",
    audienceType: "host",
    audienceSegment: "Property owners and managers with empty nights",
    contentPillar: "Host acquisition",
    seasonOrEvent: "September 2026",
    platform: "facebook",
    campaignDate: "2026-09-01",
    adHeadline:
      "Own an apartment in Lagos? Turn your empty nights into bookings with GescoStay.",
    adPrimaryText:
      "Create your host account, add your property, and let travellers find your space on GescoStay.",
    landingPageHeadline:
      "Own a property in Lagos? Put your empty nights to work with GescoStay.",
    landingPageSubheadline:
      "Create your host account, add your property, and get your listing in front of travellers already searching for stays.",
    heroImage: createImage(
      "Luxury serviced apartment living room in Lagos Nigeria, warm natural light, polished neutral decor, realistic property photography, hospitality brand campaign, mobile hero composition",
      "portrait_16_9",
    ),
    supportingImages: [
      createImage(
        "Lagos apartment host greeting guests at doorway, friendly hospitality, realistic African city short stay property photography",
        "square_hd",
      ),
      createImage(
        "Modern Lagos apartment bedroom with clean linen and tasteful decor, realistic short stay listing photography",
        "square_hd",
      ),
    ],
    primaryCTA: "List My Property",
    secondaryCTA: "Talk to our Lagos team",
    registrationType: "host-listing",
    registrationUrl: "https://www.gescostay.com/listings/create",
    leadFormTitle: "Talk to our Lagos host support team",
    leadFormIntro:
      "Share a few details and our team can help you understand the next step for your property.",
    leadFormFields: [
      {
        key: "firstName",
        label: "First name",
        type: "text",
        placeholder: "Your first name",
        required: true,
        helpText: "So our team knows what to call you.",
      },
      {
        key: "phone",
        label: "Phone or WhatsApp",
        type: "tel",
        placeholder: "+234...",
        required: true,
        helpText: "So our local team can contact you about your property.",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        helpText: "So we can send your GescoStay account and hosting information.",
      },
      {
        key: "propertyCountry",
        label: "Property country",
        type: "select",
        placeholder: "Select a country",
        required: true,
        helpText: "So we can route you to the right market team.",
        options: [
          { label: "Nigeria", value: "Nigeria" },
          { label: "Ghana", value: "Ghana" },
          { label: "The Gambia", value: "The Gambia" },
          { label: "Senegal", value: "Senegal" },
          { label: "Tanzania", value: "Tanzania" },
        ],
      },
      {
        key: "propertyCity",
        label: "Property city",
        type: "text",
        placeholder: "Lagos",
        required: true,
        helpText: "So the right local team can help you.",
      },
      {
        key: "operatesShortStay",
        label: "Do you already run short stays?",
        type: "select",
        placeholder: "Select an option",
        required: true,
        helpText: "So we know how much setup support you may need.",
        options: [
          { label: "Yes, already operating", value: "yes" },
          { label: "Not yet", value: "not-yet" },
        ],
      },
      {
        key: "contactPreference",
        label: "Preferred contact method",
        type: "select",
        placeholder: "Select a contact method",
        required: true,
        helpText: "So we contact you in the way that suits you best.",
        options: [
          { label: "Phone call", value: "phone" },
          { label: "WhatsApp", value: "whatsapp" },
          { label: "Email", value: "email" },
        ],
      },
    ],
    trustMessages: [
      "Use the same GescoStay platform travellers already browse for short stays.",
      "Choose between creating your listing yourself or getting help from the local team.",
      "Your lead goes to the country team with the campaign and location context attached.",
    ],
    benefits: [
      {
        title: "Meet active stay seekers",
        description:
          "Put your property in front of travellers already browsing GescoStay for places to stay.",
      },
      {
        title: "Show your space clearly",
        description:
          "Add your property details and photos so guests understand what makes your space a fit.",
      },
      {
        title: "Get local support when needed",
        description:
          "If you want a hand with setup, the GescoStay team can guide you through the next step.",
      },
    ],
    socialProofLabel: "Designed to feel like the GescoStay experience travellers already trust.",
    faq: [
      {
        question: "How do I become a host on GescoStay?",
        answer:
          "Start by creating your host listing. If you would rather speak to someone first, send your details and the local team can help.",
      },
      {
        question: "Can I register if I live outside Nigeria?",
        answer:
          "Yes. The form keeps your contact number separate from your property location so diaspora owners can still register correctly.",
      },
      {
        question: "What happens after I ask for help?",
        answer:
          "Your details are sent with the campaign and property location so the relevant team can follow up with the next step.",
      },
    ],
    howItWorks: [
      {
        title: "Create your account",
        description: "Start with the live GescoStay listing flow.",
      },
      {
        title: "Add your property",
        description: "Enter the details travellers need to understand your space.",
      },
      {
        title: "Publish your listing",
        description: "Make your property available for travellers searching the platform.",
      },
      {
        title: "Get support if you need it",
        description: "Choose the human-help route any time if you want a hand.",
      },
    ],
    humanHelpHeading: "Prefer to speak to someone first?",
    humanHelpBody:
      "Our Lagos team can help you understand what you need before you create the listing.",
    finalCtaTitle: "Ready to list your property?",
    finalCtaBody:
      "Go straight into the GescoStay listing flow or ask the team to call you back.",
    language: "en",
    trackingCampaignName: "paid_social_lagos_host_sep_2026",
    utmSource: "facebook",
    utmMedium: "paid-social",
    utmCampaign: "lagos-host-september-2026",
    utmContent: "hero-static",
    slugSegments: ["nigeria", "lagos", "host-september-2026"],
    metaTitle: "List Your Lagos Property | GescoStay Campaign",
    metaDescription:
      "Create your GescoStay host listing for Lagos or ask the local team for help with your next step.",
    canonicalPath: "https://lagos-hosts.gescostay.com/",
    indexable: false,
    supportContact: contacts.Nigeria,
  },
  {
    campaignId: "ng-lagos-traveller-q4-2026",
    campaignName: "Lagos Traveller Discovery Q4 2026",
    campaignStatus: "active",
    // Served at lagos-travel.gescostay.com via proxy.ts host-based rewrite.
    campaignType: "paid-social",
    country: "Nigeria",
    city: "Lagos",
    audienceType: "traveller",
    audienceSegment: "Potential visitors planning a Lagos trip for late 2026",
    contentPillar: "Destination demand",
    seasonOrEvent: "September to December 2026",
    platform: "instagram",
    campaignDate: "2026-09-01",
    adHeadline: "Stay like you know somebody in Lagos.",
    adPrimaryText:
      "Every GescoStay host is vetted for real hospitality. Every home is checked before it's listed. Book a stay that already feels like yours.",
    landingPageHeadline: "Stay like you know somebody in Lagos.",
    landingPageSubheadline:
      "Every host is vetted for real hospitality. Every home is checked before it's listed. Every booking pays a local host, fast.",
    heroImage:
      "https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?q=80&w=1800&auto=format&fit=crop",
    supportingImages: [
      createImage(
        "Crowd at live Afrobeat performance in Lagos Nigeria, warm stage lighting, stylish city nightlife, realistic editorial travel photography",
        "square_hd",
      ),
      createImage(
        "Elegant Lagos rooftop dinner and city lights in Victoria Island, realistic upscale travel photography, editorial mood",
        "square_hd",
      ),
      createImage(
        "Contemporary art gallery scene in Lagos Nigeria with visitors, refined cultural travel editorial style, realistic photography",
        "square_hd",
      ),
    ],
    primaryCTA: "Explore Lagos Stays",
    secondaryCTA: "Get help choosing an area",
    registrationType: "traveller-search",
    registrationUrl: "https://www.gescostay.com/listings",
    leadFormTitle: "Ask our Lagos team for help",
    leadFormIntro:
      "Tell us your dates, the part of Lagos you are considering, and how you would like us to reach you. We will help you narrow the search.",
    leadFormFields: [
      {
        key: "firstName",
        label: "First name",
        type: "text",
        placeholder: "Your first name",
        required: true,
        helpText: "So we know what to call you.",
      },
      {
        key: "phone",
        label: "Phone or WhatsApp",
        type: "tel",
        placeholder: "+234 or international number",
        helpText: "So our Lagos team can contact you about your stay search.",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        helpText: "So we can share stay options and next steps.",
      },
      {
        key: "destination",
        label: "Destination",
        type: "text",
        placeholder: "Lagos",
        required: true,
        helpText: "So we can help find stays in the right area.",
      },
      {
        key: "travelDate",
        label: "Approximate travel date",
        type: "date",
        placeholder: "",
        helpText: "So we know whether you are planning for September, October, November, or December.",
      },
      {
        key: "contactPreference",
        label: "Preferred contact method",
        type: "select",
        placeholder: "Select a contact method",
        required: true,
        helpText: "So we contact you in the way that suits you best.",
        options: [
          { label: "Phone call", value: "phone" },
          { label: "WhatsApp", value: "whatsapp" },
          { label: "Email", value: "email" },
        ],
      },
    ],
    trustMessages: [
      "Browse homes and hotels in Lagos through the live GescoStay journey.",
      "Ask for local help if you want guidance on areas, timing, or the kind of trip you are planning.",
      "Keep your campaign context attached when you continue into the main search flow.",
    ],
    benefits: [
      {
        title: "A late-year city with momentum",
        description:
          "Lagos builds through the last quarter of the year, moving from cultural season into a fuller festive city rhythm.",
      },
      {
        title: "Different neighbourhoods for different trips",
        description:
          "Your stay choice changes the feel of the trip, whether you want nightlife, airport access, beach proximity, or a smoother first visit.",
      },
      {
        title: "A practical route into booking",
        description:
          "Read the city story first, then move straight into live GescoStay listings without losing the option to ask for help.",
      },
    ],
    bookingReasons: [
      {
        title: "Browse Lagos stays in one flow",
        description:
          "Move from campaign story to live listings without starting over somewhere else.",
      },
      {
        title: "Get help choosing the right area",
        description:
          "If you are unsure whether to stay closer to Victoria Island, Lekki, or Ikeja, the local team can guide you.",
      },
      {
        title: "Keep self-serve and human help open",
        description:
          "You can explore on your own, then switch to a guided route when you want practical support.",
      },
    ],
    seasonMoments: [
      {
        label: "September",
        title: "World Tourism Day starts the countdown",
        description:
          "27 September marks World Tourism Day — the quiet moment to lock in your base before Lagos gets busier through the rest of the year.",
      },
      {
        label: "October",
        title: "October sounds like Lagos",
        description:
          "Felabration returns to the New Afrika Shrine (12–18 Oct) alongside Lagos Fashion Week — a week of Afrobeat, electric nights, and the energy people fly in for.",
      },
      {
        label: "November",
        title: "Clearer travel window before December peaks",
        description:
          "November is when the drier season starts to return, making it a useful moment for travellers who want Lagos energy without full festive-season pressure.",
      },
      {
        label: "December",
        title: "Lagos at full festive volume",
        description:
          "Detty December brings concerts, reunions, nightlife, art, beach plans, and a citywide sense that something is happening every night.",
      },
    ],
    areaGuides: [
      {
        name: "Victoria Island",
        vibe: "For nightlife, dining, and a polished city base",
        description:
          "A strong fit if you want to be near restaurants, lounges, and major social plans without feeling far from the commercial centre.",
      },
      {
        name: "Lekki",
        vibe: "For beach energy and a contemporary social scene",
        description:
          "Useful for travellers who want newer apartments, food spots, and a trip that leans more lifestyle than business.",
      },
      {
        name: "Ikeja",
        vibe: "For airport access and music-culture proximity",
        description:
          "A practical option if you want easier airport movement or plan to spend time around the Shrine and mainland creative scene.",
      },
    ],
    socialProofLabel:
      "GescoStay gives you a clearer route from Lagos inspiration to an actual stay search, with local human help still available if you want it.",
    faq: [
      {
        question: "Why visit Lagos later in the year?",
        answer:
          "This stretch of the year is when Lagos gathers cultural momentum, then moves into its biggest festive-season energy. The right month depends on whether you want more room, more events, or full December atmosphere.",
      },
      {
        question: "How do I decide where to stay in Lagos?",
        answer:
          "Think about the kind of trip you want first. Victoria Island, Lekki, and Ikeja each suit different rhythms, and our local team can help you narrow that down.",
      },
      {
        question: "Do I need to commit before I ask for help?",
        answer:
          "No. You can browse first, or send your details and ask the local team to help you choose an area or timing before you continue.",
      },
    ],
    howItWorks: [
      {
        title: "Choose the kind of Lagos trip you want",
        description: "Start with season, area, and the pace you want from the city.",
      },
      {
        title: "Browse live stays",
        description: "Continue into GescoStay listings and compare the options that fit your plan.",
      },
      {
        title: "Ask for help if needed",
        description: "Use the local team if you want guidance on neighbourhoods or travel timing.",
      },
    ],
    humanHelpHeading: "Not sure which part of Lagos suits your trip?",
    humanHelpBody:
      "Tell us what kind of trip you want, when you are planning to come, and how you would like us to reach you. We will help you narrow the search.",
    finalCtaTitle: "Ready to choose your Lagos base?",
    finalCtaBody:
      "Browse Lagos stays on GescoStay now, or ask the local team to help you decide where and when to book.",
    language: "en",
    trackingCampaignName: "paid_social_lagos_traveller_q4_2026",
    utmSource: "instagram",
    utmMedium: "paid-social",
    utmCampaign: "lagos-traveller-q4-2026",
    utmContent: "editorial-city-hero",
    slugSegments: ["nigeria", "lagos", "traveller-q4-2026"],
    metaTitle: "Stay Like You Know Somebody in Lagos | GescoStay",
    metaDescription:
      "Book a vetted, verified stay in Lagos with GescoStay — local hosts, checked homes, and a welcome that feels like family.",
    canonicalPath: "https://lagos-travel.gescostay.com/",
    indexable: false,
    designVariant: "apple-lagos-hidden-gems",
    showcaseProperties: [
      {
        reference: "lagos-hidden-gem-vi-loft",
        title: "Skyline Loft on Victoria Island",
        description:
          "Floor-to-ceiling views and a host who checks in without hovering.",
        area: "Victoria Island, Lagos",
        priceFrom: "$74",
        image:
          "https://images.unsplash.com/photo-1649769425782-8cdb757da2b4?q=80&w=900&auto=format&fit=crop",
      },
      {
        reference: "lagos-hidden-gem-lekki-courtyard",
        title: "Courtyard Stay in Lekki",
        description:
          "A quiet terracotta courtyard, five minutes from the beach.",
        area: "Lekki, Lagos",
        priceFrom: "$57",
        image:
          "https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=900&auto=format&fit=crop",
      },
      {
        reference: "lagos-hidden-gem-ikeja-residence",
        title: "Creative Residence in Ikeja",
        description:
          "Clean lines, good light, close to the mainland music scene.",
        area: "Ikeja, Lagos",
        priceFrom: "$43",
        image:
          "https://images.unsplash.com/photo-1708493666755-34fbad47c197?q=80&w=900&auto=format&fit=crop",
      },
      {
        reference: "lagos-hidden-gem-lagoon-suite",
        title: "Lagoon View Suite",
        description:
          "Wake up to the lagoon turning gold. Worth the early flight.",
        area: "Lagoon-side, Lagos",
        priceFrom: "$91",
        image:
          "https://images.unsplash.com/photo-1774383138392-d968a7283015?q=80&w=900&auto=format&fit=crop",
      },
    ],
    hostProfiles: [
      {
        name: "Ada",
        description: "Welcomes guests with local food tips and easy city guidance.",
        image:
          "https://images.unsplash.com/photo-1743871698163-a2e470d8eac7?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Tunde",
        description: "Knows the mainland rhythm and how to make first-time visitors feel settled.",
        image:
          "https://images.unsplash.com/photo-1594492003372-f56819b6e029?q=80&w=600&auto=format&fit=crop",
      },
      {
        name: "Ife",
        description: "Curates stays for guests who want design, calm, and a softer Lagos pace.",
        image:
          "https://images.unsplash.com/photo-1586171984069-1dbce3573a10?q=80&w=600&auto=format&fit=crop",
      },
    ],
    supportContact: contacts.Nigeria,
  },
  {
    campaignId: "gh-accra-traveller-sep-2026",
    campaignName: "Accra Traveller Search September 2026",
    campaignStatus: "draft",
    campaignType: "paid-social",
    country: "Ghana",
    city: "Accra",
    audienceType: "traveller",
    audienceSegment: "Travellers looking for stays in Accra",
    contentPillar: "Traveller demand",
    seasonOrEvent: "September 2026",
    platform: "instagram",
    campaignDate: "2026-09-01",
    adHeadline: "Heading to Accra? Find a stay that fits your trip on GescoStay.",
    adPrimaryText:
      "Browse homes and hotels in Accra, or ask our local team to help you get started.",
    landingPageHeadline:
      "Going to Accra? Find a stay that fits your trip on GescoStay.",
    landingPageSubheadline:
      "Browse available stays in Accra yourself or ask the local team to help you narrow things down.",
    heroImage: createImage(
      "Stylish short stay apartment in Accra Ghana, balcony view, natural daylight, welcoming travel photography, premium but approachable hospitality campaign, mobile hero composition",
      "portrait_16_9",
    ),
    supportingImages: [
      createImage(
        "Traveller arriving at modern Accra apartment with luggage, realistic hospitality photography, friendly African travel scene",
        "square_hd",
      ),
      createImage(
        "Bright Accra apartment interior with dining area and local design details, realistic short stay photography",
        "square_hd",
      ),
    ],
    primaryCTA: "Explore Stays",
    secondaryCTA: "Talk to our Accra team",
    registrationType: "traveller-search",
    registrationUrl: "https://www.gescostay.com/listings",
    leadFormTitle: "Ask our Accra team for help",
    leadFormIntro:
      "Tell us where you are headed and how you would like to be contacted. We will point you in the right direction.",
    leadFormFields: [
      {
        key: "firstName",
        label: "First name",
        type: "text",
        placeholder: "Your first name",
        required: true,
        helpText: "So we know what to call you.",
      },
      {
        key: "phone",
        label: "Phone or WhatsApp",
        type: "tel",
        placeholder: "+233...",
        helpText: "So our team can contact you about your stay search.",
      },
      {
        key: "email",
        label: "Email",
        type: "email",
        placeholder: "you@example.com",
        helpText: "So we can share stay options and next steps.",
      },
      {
        key: "destination",
        label: "Destination",
        type: "text",
        placeholder: "Accra",
        required: true,
        helpText: "So we can help find stays in the right area.",
      },
      {
        key: "travelDate",
        label: "Approximate travel date",
        type: "date",
        placeholder: "",
        helpText: "So we know when you plan to travel.",
      },
      {
        key: "contactPreference",
        label: "Preferred contact method",
        type: "select",
        placeholder: "Select a contact method",
        required: true,
        helpText: "So we contact you in the way that suits you best.",
        options: [
          { label: "Phone call", value: "phone" },
          { label: "WhatsApp", value: "whatsapp" },
          { label: "Email", value: "email" },
        ],
      },
    ],
    trustMessages: [
      "You can continue straight into live GescoStay listings from this page.",
      "Need help first? The local team can guide you before you commit to anything.",
      "Campaign tracking stays attached so marketing can see what drove the enquiry.",
    ],
    benefits: [
      {
        title: "See stays in the right city",
        description:
          "Jump straight to the GescoStay listing experience for Accra and keep moving through your search.",
      },
      {
        title: "Keep your options open",
        description:
          "Browse on your own or ask the team to point you toward the right area for your trip.",
      },
      {
        title: "Get help without starting over",
        description:
          "If you submit the help form, you still keep a clear route back into the main GescoStay search flow.",
      },
    ],
    socialProofLabel: "Built around the same GescoStay browsing journey visitors meet on the live site.",
    faq: [
      {
        question: "Do I need an account before I browse?",
        answer:
          "No. You can start exploring stays right away and continue through the live GescoStay journey from there.",
      },
      {
        question: "Can someone help me choose a location?",
        answer:
          "Yes. The human-help route lets you share your destination and travel timing so the local team can follow up.",
      },
      {
        question: "What happens after I send my details?",
        answer:
          "Your request is packaged with the campaign, country, city, and UTM details so the right team can respond.",
      },
    ],
    howItWorks: [
      {
        title: "Start your search",
        description: "Open the live GescoStay listings experience.",
      },
      {
        title: "Browse suitable stays",
        description: "Review the properties that fit your destination and trip.",
      },
      {
        title: "Continue with the booking flow",
        description: "Move forward inside the main GescoStay product journey.",
      },
      {
        title: "Ask for local help if needed",
        description: "Use the support option any time if you want someone to guide you.",
      },
    ],
    humanHelpHeading: "Would you like some help first?",
    humanHelpBody:
      "Our Accra team can help you get started before you continue into the main search flow.",
    finalCtaTitle: "Ready to start looking?",
    finalCtaBody:
      "Browse live GescoStay listings in Accra or ask the team to help you narrow things down.",
    language: "en",
    trackingCampaignName: "paid_social_accra_traveller_sep_2026",
    utmSource: "instagram",
    utmMedium: "paid-social",
    utmCampaign: "accra-traveller-september-2026",
    utmContent: "reel-hero",
    slugSegments: ["ghana", "accra", "traveller-september-2026"],
    metaTitle: "Find a Stay in Accra | GescoStay Campaign",
    metaDescription:
      "Browse Accra stays on GescoStay or ask the local team to help with your next search step.",
    canonicalPath: "/campaigns/ghana/accra/traveller-september-2026",
    indexable: false,
    supportContact: contacts.Ghana,
  },
];

export function getCampaignPath(campaign: CampaignConfig) {
  return `/campaigns/${campaign.slugSegments.join("/")}`;
}

export function findCampaignBySlug(slugSegments: string[]) {
  return campaigns.find(
    (campaign) => campaign.slugSegments.join("/") === slugSegments.join("/"),
  );
}

export function findCampaignById(campaignId: string) {
  return campaigns.find((campaign) => campaign.campaignId === campaignId);
}

export function getCampaignStaticParams() {
  return campaigns.map((campaign) => ({ slug: campaign.slugSegments }));
}

export function appendCampaignQueryParams(
  campaign: CampaignConfig,
  searchParams?: URLSearchParams,
) {
  const params = new URLSearchParams(searchParams);

  params.set("campaign_id", campaign.campaignId);
  params.set("campaign_name", campaign.trackingCampaignName);
  params.set("country", campaign.country);
  params.set("city", campaign.city);
  params.set("audience_type", campaign.audienceType);
  params.set("utm_source", params.get("utm_source") ?? campaign.utmSource);
  params.set("utm_medium", params.get("utm_medium") ?? campaign.utmMedium);
  params.set("utm_campaign", params.get("utm_campaign") ?? campaign.utmCampaign);
  params.set("utm_content", params.get("utm_content") ?? campaign.utmContent);

  return params;
}
