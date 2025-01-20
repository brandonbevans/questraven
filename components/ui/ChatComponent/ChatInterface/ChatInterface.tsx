'use client';

import { useChatInterface } from '@/components/ui/ChatComponent/ChatInterface/useChatInterface';
import { FREE_MESSAGE_LIMIT } from '@/components/ui/ChatComponent/helper';
import { ChatInterfaceProps } from '@/components/ui/ChatComponent/type';
import { Thread } from '@assistant-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatInterface({ selectedGame }: ChatInterfaceProps) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { hasSubscription, userMessagesCount, isLoading, runtime, messages } =
    useChatInterface({ selectedGame });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration issues by not rendering anything on server
  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-theme(space.16))] flex-col px-4">
        <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col justify-center items-center text-zinc-400">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const isLimitReached =
    !hasSubscription && userMessagesCount >= FREE_MESSAGE_LIMIT;

  return (
    <div className="flex h-[calc(100vh-theme(space.16))] flex-col px-4">
      <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl flex flex-col overflow-hidden">
        {!hasSubscription && (
          <div className="shrink-0 px-4 pt-4 text-sm border-b border-zinc-800 bg-zinc-900/50">
            {isLimitReached ? (
              <div className="pb-4 flex items-center justify-between">
                <span className="text-red-400">
                  You&apos;ve reached your free message limit.
                </span>
                <button
                  className="ml-2 px-4 py-1 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
                  onClick={() => {
                    router.push('/subscribe');
                  }}
                >
                  Upgrade now
                </button>
              </div>
            ) : (
              <div className="pb-4 flex items-center justify-between">
                <span className="text-zinc-400">
                  Free tier: {FREE_MESSAGE_LIMIT - userMessagesCount} message
                  {FREE_MESSAGE_LIMIT - userMessagesCount !== 1 ? 's' : ''}{' '}
                  remaining
                </span>
                <button
                  className="ml-2 px-4 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-md transition-colors"
                  onClick={() => {
                    router.push('/subscribe');
                  }}
                >
                  Upgrade for unlimited access
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex-1 flex flex-col justify-center items-center text-zinc-400">
              {selectedGame.logo_url && (
                <Image
                  src={selectedGame.logo_url}
                  alt={`${selectedGame.name} Logo`}
                  width={50}
                  height={50}
                />
              )}
              <div className="text-lg text-zinc-600 mt-2">
                Loading {selectedGame.name}
              </div>
            </div>
          ) : (
            <div
              className={`flex-1 ${isLimitReached ? 'pointer-events-none opacity-50' : ''}`}
            >
              <Thread
                runtime={runtime}
                welcome={{
                  message: `I know all about ${selectedGame.name}. Speak to the Raven.`
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
