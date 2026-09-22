export const siteConfig = {
  name: "GescoStay",
  description:
    "Discover unique stays and car rentals across Africa. Book, stay, belong.",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://gescostay-campaigns.vercel.app",
  analyticsId: process.env.NEXT_PUBLIC_GA_ID ?? "G-QKFTVS6K4E",
  instagramUrl: "https://www.instagram.com/gescostay/",
  privacyUrl: "https://www.gescostay.com/privacy",
  termsUrl: "https://www.gescostay.com/terms",
  mainBrowseUrl: "https://www.gescostay.com/listings",
  hostListingUrl: "https://www.gescostay.com/listings/create",
};
