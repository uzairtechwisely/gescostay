import Script from "next/script";

type GoogleAnalyticsProps = {
  analyticsId: string;
};

export function GoogleAnalytics({ analyticsId }: GoogleAnalyticsProps) {
  if (!analyticsId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${analyticsId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
