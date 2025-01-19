import { AI } from '@/app/actions';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Metadata, Viewport } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import { PropsWithChildren, Suspense } from 'react';
import 'styles/main.css';
import { RunTimeProvider } from './RunTimeProvider';
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
    target: 'https://www.questraven.ai/bot',
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
  verification: {
    google: 'YOUR_DATA',
    yandex: ['YOUR_DATA'],
    other: {
      'msvalidate.01': ['YOUR_DATA'],
      'facebook-domain-verification': ['YOUR_DATA']
    }
  },
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

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <AI>
      <RunTimeProvider>
        <html lang="en">
          <Head>
            <Script
              id="json-ld"
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
              strategy="beforeInteractive"
            />
            {process.env.NODE_ENV === 'production' && (
              <>
                <GoogleAnalytics gaId="G-T5LLMZVJ2S" />
                <GoogleTagManager gtmId="GTM-P2DTLHJ6" />
              </>
            )}
          </Head>
          <body className="bg-black">
            <Navbar />
            <main
              id="skip"
              className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
            >
              {children}
            </main>
            <Footer />
            <Suspense>
              <Toaster />
            </Suspense>
          </body>
        </html>
      </RunTimeProvider>
    </AI>
  );
}
