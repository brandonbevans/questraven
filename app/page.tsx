import botScreenshot from '@/public/botscreenshot.png';
import { Brain, Check, Clock, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { AuroraButton } from '../components/ui/aurora-button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/ui/card';
import { SparklesCore } from '../components/ui/sparkles';

import { getGames } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quest Raven - Your Personal AI Gaming Guide & Strategy Assistant',
  description:
    'Level up your gaming experience with Quest Raven, the advanced AI-powered game guide that provides instant walkthroughs, quest help, build strategies, and real-time answers for your favorite RPGs and other games.',
  keywords: [
    'AI game guide',
    'RPG walkthrough',
    'gaming assistant',
    'quest help',
    'game strategies',
    'build guides',
    'real-time gaming help',
    'video game companion',
    'game walkthrough',
    'gaming tips'
  ],
  openGraph: {
    url: 'https://questraven.ai',
    type: 'website',
    title: 'Quest Raven - Your Personal AI Gaming Guide & Strategy Assistant',
    description:
      'Level up your gaming experience with Quest Raven, the advanced AI-powered game guide that provides instant walkthroughs, quest help, build strategies, and real-time answers for your favorite RPGs and other games.',
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
    title: 'Quest Raven - Your Personal AI Gaming Guide & Strategy Assistant',
    description:
      'Level up your gaming experience with Quest Raven, the advanced AI-powered game guide that provides instant walkthroughs, quest help, build strategies, and real-time answers for your favorite RPGs and other games.',
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

async function LandingPageContent() {
  const client = await createClient();
  const games = await getGames(client);

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
          Instant AI Game Guides
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
          No spoilers, no searching — Raven gets the exact video game hints you
          need, instantly.
        </p>
        <br></br>
        <br></br>
        <br></br>
        {/* CTA Button */}
        <div className="relative mb-32">
          <div className="flex justify-center">
            <AuroraButton glowClassName="from-pink-500 via-purple-500 to-blue-500">
              <Link href="/raven">Get Started For Free</Link>
            </AuroraButton>
          </div>
        </div>

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

        {/* Supported Games */}
        <div className="mx-auto max-w-6xl px-4 mb-32">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">★★★★★ 5.0 rating</span>
              <span className="text-zinc-700">|</span>
              <span className="text-sm text-zinc-400">
                Trusted by 1,000+ gamers
              </span>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {games?.map((game: { name: string }) => (
                <div
                  key={game.name}
                  className="text-zinc-400 font-semibold text-center p-2 rounded-md hover:bg-zinc-900/50 transition-colors"
                >
                  {game.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 mb-32 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl">
            Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="relative overflow-hidden border-2 border-zinc-800 bg-zinc-900/90 transition-all hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-green-500/20">
                  <Clock className="h-7 w-7 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-50">
                  Save Hours of Searching
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-7 text-zinc-300 text-center">
                  Turn 15-minute searches into 15-second answers. Stop wasting
                  time scrolling through guides and videos, and waiting for
                  responses on Discord. Get instant, accurate solutions to your
                  gaming challenges, so you can spend more time actually
                  playing.
                </p>
              </CardContent>
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />
            </Card>
            <Card className="relative overflow-hidden border-2 border-zinc-800 bg-zinc-900/90 transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-orange-500/20">
                  <Brain className="h-7 w-7 text-orange-500" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-zinc-50">
                  Smart Gaming Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-7 text-zinc-300 text-center">
                  Our AI analyzes thousands of gaming guides and walkthroughs to
                  give you precise answers for your specific situation. Whether
                  you're stuck on a boss or optimizing your character, get the
                  exact help you need, when you need it.
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
