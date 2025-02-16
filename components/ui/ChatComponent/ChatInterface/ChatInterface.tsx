'use client';

import { MyRuntimeProvider } from '@/app/MyRuntimeProvider';
import { Thread } from '@/components/assistant-ui/thread';
import { useChatInterface } from '@/components/ui/ChatComponent/ChatInterface/useChatInterface';
import { createClient } from '@/utils/supabase/client';
import { getMessagesCount, getUser } from '@/utils/supabase/queries';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Tables } from 'types_db';

type Game = Tables<'games'>;

export default function ChatInterface({
  selectedGame
}: {
  selectedGame: Game;
}) {
  const [mounted, setMounted] = useState(false);
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const [upgradeText, setUpgradeText] = useState(
    'Upgrade for unlimited access'
  );
  const router = useRouter();
  const { hasSubscription, isLoading, messages, userChatId } = useChatInterface(
    {
      selectedGame
    }
  );
  const FREE_MESSAGE_LIMIT = parseInt(
    process.env.NEXT_PUBLIC_FREE_MESSAGE_LIMIT ?? '3'
  );
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    getUserMessagesCount();
    getUpgradeText().then(setUpgradeText);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('chats-updated')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chats' },
        (payload) => {
          getUserMessagesCount();
        }
      )
      .subscribe();

    // Cleanup to avoid leaks:
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  const getUserMessagesCount = async () => {
    const user = await getUser(supabase);
    if (!user) {
      return;
    }
    const userMessagesCount = await getMessagesCount(supabase, user.id);
    setUserMessagesCount(userMessagesCount);
  };

  const getUpgradeText = async () => {
    const user = await getUser(supabase);
    if (user?.is_anonymous) {
      return 'Join for more credits';
    } else {
      return 'Get unlimited access';
    }
  };

  // Prevent hydration issues by not rendering anything on server
  if (!mounted) {
    return (
      <div className="flex h-[calc(100vh-6rem)] flex-col px-4">
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
    <div className="flex h-[calc(100vh-6rem)] flex-col px-4">
      <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl flex flex-col overflow-hidden">
        {!hasSubscription && (
          <div className="shrink-0 px-4 pt-4 text-sm border-b border-zinc-800 bg-zinc-900/50">
            {isLimitReached ? (
              <div className="pb-4 flex items-center justify-between">
                <span className="text-red-400">
                  0 credits left for today. Check back in a few days, or
                  subscribe for unlimited access.
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
                  {upgradeText}
                </button>
              </div>
            )}
          </div>
        )}

        <MyRuntimeProvider
          key={userChatId}
          chatId={userChatId}
          namespace={selectedGame.namespace}
          messages={messages}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {isLoading ? (
              <div className="flex-1 flex flex-col justify-center items-center text-zinc-400">
                <Image
                  src={`/logos/${selectedGame.namespace}.png`}
                  alt={`${selectedGame.name} Logo`}
                  width={50}
                  height={50}
                />
                <div className="text-lg text-zinc-600 mt-2">
                  Loading {selectedGame.name}
                </div>
              </div>
            ) : (
              <div
                className={`flex-1 ${isLimitReached ? 'pointer-events-none opacity-50' : ''}`}
              >
                <Thread />
              </div>
            )}
          </div>
        </MyRuntimeProvider>
      </div>
    </div>
  );
}
