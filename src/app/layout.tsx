import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const googleAnalyticsId = "G-9ZWQ5LCV0Y";

export const metadata: Metadata = {
  title: { default: "AxeBonanza Casino | Homepage", template: "%s | AxeBonanza Casino" },
  description: "Explore games, promotions, tournaments, and more at AxeBonanza Casino.",
  applicationName: "AxeBonanza Casino",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#1a1937" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:px-5 focus:py-3 focus:text-background">
          Skip to content
        </a>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
      </body>
    </html>
  );
}
