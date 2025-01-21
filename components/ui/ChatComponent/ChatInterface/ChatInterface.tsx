'use client';

import { useChatInterface } from '@/components/ui/ChatComponent/ChatInterface/useChatInterface';
import { ChatInterfaceProps } from '@/components/ui/ChatComponent/type';
import { createClient } from '@/utils/supabase/client';
import { getMessagesCount } from '@/utils/supabase/queries';
import {
  AssistantRuntimeProvider,
  MessageStatus,
  Thread,
  ThreadMessage
} from '@assistant-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatInterface({ selectedGame }: ChatInterfaceProps) {
  const [mounted, setMounted] = useState(false);
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const router = useRouter();
  const { hasSubscription, isLoading, runtime, messages, userChatId } =
    useChatInterface({
      selectedGame
    });
  const FREE_MESSAGE_LIMIT = parseInt(process.env.FREE_MESSAGE_LIMIT ?? '100');
  const supabase = createClient();
  const [nameToThreadIdMap, setNameToThreadIdMap] = useState<
    Map<string, string>
  >(new Map());

  useEffect(() => {
    setMounted(true);
    getUserMessagesCount();
  }, []);

  const buildRepository = () => {
    const repository = {
      messages: messages
        .filter((message) => message.chat_id === userChatId)
        .map((message) => ({
          message: {
            role: message.role as 'user' | 'assistant' | 'system',
            content: [
              {
                type: 'text',
                text: message.text
              }
            ],
            metadata: {
              unstable_data: [],
              custom: {}
            },
            id: message.id,
            createdAt: new Date(message.created_at ?? ''),
            status: {
              type: 'complete',
              reason: 'stop'
            } as MessageStatus
          } as ThreadMessage,
          parentId: null
        }))
    };
    return repository;
  };

  useEffect(() => {
    if (nameToThreadIdMap.has(selectedGame.namespace)) {
      const threadId = nameToThreadIdMap.get(selectedGame.namespace);
      if (threadId) {
        runtime.threadList.getItemById(threadId).switchTo();
      } else {
        console.log('threadId not found, serious error');
      }
    } else {
      runtime.switchToNewThread();
      const currentThreadId = runtime.threadList.getState().mainThreadId;

      // TODO: fix this
      // runtime.thread.import(buildRepository());

      setNameToThreadIdMap(
        new Map([
          ...Array.from(nameToThreadIdMap.entries()),
          [selectedGame.namespace, currentThreadId]
        ])
      );
    }
  }, [selectedGame]);

  useEffect(() => {
    const channel = supabase
      .channel('unique-channel-name')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
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
    const {
      data: { user }
    } = await supabase.auth.getUser();
    const userMessagesCount = await getMessagesCount(supabase, user?.id ?? '');
    setUserMessagesCount(userMessagesCount);
  };

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
        <AssistantRuntimeProvider runtime={runtime}>
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
                  welcome={{
                    message: `I know all about ${selectedGame.name}. Speak to the Raven.`
                  }}
                />
              </div>
            )}
          </div>
        </AssistantRuntimeProvider>
      </div>
    </div>
  );
}
