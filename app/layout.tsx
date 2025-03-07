import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import '@/styles/globals.scss';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Metadata, Viewport } from 'next';
import { ThemeProvider } from 'next-themes';
import Script from 'next/script';
import { PropsWithChildren } from 'react';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
};

const jsonLd = {
  '@context': 'https://schema.org/',
  '@type': 'WebSite',
  name: 'Quest Raven',
  url: 'https://www.questraven.ai',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.questraven.ai/raven',
    'query-input': 'required name=search_term_string'
  }
};

export const metadata: Metadata = {
  metadataBase: new URL('https://questraven.ai'),
  openGraph: {
    siteName: 'Quest Raven',
    type: 'website',
    locale: 'en_US'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow'
  },
  applicationName: 'Quest Raven',
  appleWebApp: {
    title: 'Quest Raven',
    statusBarStyle: 'default',
    capable: true
  },
  // verification: {
  //   google: 'YOUR_DATA',
  //   yandex: ['YOUR_DATA'],
  //   other: {
  //     'msvalidate.01': ['YOUR_DATA'],
  //     'facebook-domain-verification': ['YOUR_DATA']
  //   }
  // },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon'
      }
      // add favicon-32x32.png, favicon-96x96.png, android-chrome-192x192.png
    ],
    shortcut: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon'
      }
    ],
    apple: [
      {
        url: '/favicon.ico',
        sizes: '57x57',
        type: 'image/png'
      },
      {
        url: '/favicon.ico',
        sizes: '60x60',
        type: 'image/png'
      }
      // add apple-icon-72x72.png, apple-icon-76x76.png, apple-icon-114x114.png, apple-icon-120x120.png, apple-icon-144x144.png, apple-icon-152x152.png, apple-icon-180x180.png
    ]
  }
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {process.env.VERCEL_ENV === 'production' && (
          <>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ''} />
            <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID ?? ''} />
          </>
        )}

        {/* OpenPixel Tracking Script */}
        {process.env.NODE_ENV !== 'production' && (
          <>
            <Script id="adweave-debug" strategy="afterInteractive">
              {`window.ADWEAVE_DEBUG = true;`}
            </Script>
            <Script
              src="https://api.adweave.ai/pixel.js?app_id=questraven-test"
              strategy="afterInteractive"
            />
            <Script id="openpixel-init" strategy="afterInteractive">
              {`
                window.opix = window.opix || function() {
                  (window.opix.q = window.opix.q || []).push(arguments);
                };
                opix('init', 'questraven-test'); 
                opix('track', 'PageView');
              `}
            </Script>
          </>
        )}

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)]"
          >
            {children}
            {process.env.NODE_ENV === 'production' && (
              <Script id="clarity-script" strategy="afterInteractive">
                {`
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
                `}
              </Script>
            )}
          </main>
          {/* <Footer /> */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
