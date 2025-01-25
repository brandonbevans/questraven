import botScreenshot from '@/public/botscreenshot.png';
import { Brain, Check, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import { SparklesCore } from '../components/ui/sparkles';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quest Raven - AI-Powered Game Guide',
  description:
    'Quest Raven is the first ever AI-powered game guide. It provides tips, strategies, walkthroughs, and answers to gaming-related questions in real-time.',
  keywords: [
    'game guide',
    'ai',
    'tips',
    'strategies',
    'walkthroughs',
    'answers',
    'real-time'
  ],
  openGraph: {
    url: 'https://questraven.ai',
    type: 'website',
    title: 'Quest Raven - AI-Powered Game Guide',
    description:
      'Quest Raven is the first ever AI-powered game guide. It provides tips, strategies, walkthroughs, and answers to gaming-related questions in real-time.',
    images: [
      {
        url: 'https://questraven.ai/images/home/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Quest Raven'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quest Raven - AI-Powered Game Guide',
    description:
      'Quest Raven is the first ever AI-powered game guide. It provides tips, strategies, walkthroughs, and answers to gaming-related questions in real-time.',
    creator: '@dontdiefallow',
    site: '@dontdiefallow',
    images: [
      {
        url: 'https://questraven.ai/images/home/thumbnail.png',
        width: 1200,
        height: 630,
        alt: 'Quest Raven'
      }
    ]
  },
  alternates: {
    canonical: 'https://questraven.ai'
  }
};

function LandingPageContent() {
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlescolorful"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={0.5}
        />
      </div>
      {/* Hero Section */}
      <section className="relative mx-auto min-h-screen max-w-6xl px-4 pt-24 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          First Ever AI-Powered Game Guide
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
          Join us in creating the future of gaming! Quest Raven provides tips,
          strategies, walkthroughs, and answers to gaming-related questions in
          real-time.
        </p>

        {/* Browser Window Mockup */}
        <div className="relative mx-auto mb-16 max-w-4xl">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-zinc-800" />
                <div className="h-3 w-3 rounded-full bg-zinc-800" />
                <div className="h-3 w-3 rounded-full bg-zinc-800" />
              </div>
            </div>
            <div className="relative aspect-video w-full overflow-hidden">
              <Image
                src={botScreenshot}
                alt="Quest Raven Interface"
                width={1280}
                height={720}
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="absolute -inset-1 -z-10 rounded-lg bg-blue-500/20 blur-2xl" />
        </div>

        {/* CTA Button */}
        <div className="relative mb-32">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/bot">Talk With The Raven</Link>
          </Button>
          {/* <ArrowDown className="mx-auto mt-8 h-12 w-12 animate-bounce text-blue-500" /> */}
        </div>

        {/* Features Section */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 mb-32 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="relative overflow-hidden border-2 border-zinc-800 bg-zinc-900/90 transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-orange-500/20">
                  <Brain className="h-7 w-7 text-orange-500" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-50">
                  Personalized Gaming Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-7 text-zinc-300 text-center">
                  Get custom gaming insights tailored to your unique gameplay
                  style and preferences. Access real-time help for any game,
                  whenever you need it.
                </p>
              </CardContent>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
            </Card>

            <Card className="relative overflow-hidden border-2 border-zinc-800 bg-zinc-900/90 transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-green-500/20">
                  <Users className="h-7 w-7 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-50">
                  Community Knowledge Base
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-7 text-zinc-300 text-center">
                  Leverage the collective expertise of the gaming community,
                  enhanced by AI to deliver accurate and up-to-date gaming
                  advice.
                </p>
              </CardContent>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-500/10 via-transparent to-transparent" />
            </Card>
          </div>
        </div>

        {/* Comparison Section */}
        <h2 className="mb-12 text-3xl font-bold">How It Compares</h2>
        <div className="mx-auto max-w-3xl overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="py-4 pr-4">Core features</th>
                <th className="px-4 py-4 text-blue-500">Quest Raven</th>
                <th className="px-4 py-4">Guides</th>
                <th className="px-4 py-4">Community Chat</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              {[
                'Personalized Assistance',
                'Instant Response',
                'Comprehensive Game Knowledge',
                // 'Curated Learning & Training',
                'No Spoilers'
              ].map((feature, i) => (
                <tr key={i} className="border-b border-zinc-800">
                  <td className="py-4 pr-4">{feature}</td>
                  <td className="px-4 py-4">
                    <Check className="h-5 w-5 text-blue-500" />
                  </td>
                  <td className="px-4 py-4">
                    {i === 2 ? (
                      <Check className="h-5 w-5 text-blue-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}{' '}
                  </td>
                  <td className="px-4 py-4">
                    {i === 0 || i === -1 ? (
                      <Check className="h-5 w-5 text-blue-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex justify-center space-x-6 text-sm text-zinc-400">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense>
      <LandingPageContent />
    </Suspense>
  );
}
