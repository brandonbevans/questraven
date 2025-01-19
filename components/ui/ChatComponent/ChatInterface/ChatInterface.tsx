'use client';

import { useChatInterface } from '@/components/ui/ChatComponent/ChatInterface/useChatInterface';
import { FREE_MESSAGE_LIMIT } from '@/components/ui/ChatComponent/helper';
import { ChatInterfaceProps } from '@/components/ui/ChatComponent/type';
import { Thread } from '@assistant-ui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ChatInterface({ selectedGame }: ChatInterfaceProps) {
  const [mounted, setMounted] = useState(false);

  const { hasSubscription, userMessagesCount, isLoading, runtime } =
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

  return (
    <div className="flex h-[calc(100vh-theme(space.16))] flex-col px-4">
      <div className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl flex flex-col overflow-hidden">
        {!hasSubscription && (
          <div className="shrink-0 px-4 pt-4 text-sm text-zinc-400">
            {userMessagesCount >= FREE_MESSAGE_LIMIT ? (
              <div className="text-red-400">
                You&apos;ve reached your free message limit.
                <button
                  className="ml-2 text-blue-500 hover:text-blue-400 underline"
                  onClick={() => {
                    /* Add upgrade flow later */
                  }}
                >
                  Upgrade now
                </button>
              </div>
            ) : (
              <div>
                Free tier: {FREE_MESSAGE_LIMIT - userMessagesCount} message
                {FREE_MESSAGE_LIMIT - userMessagesCount !== 1 ? 's' : ''}{' '}
                remaining.
                <button
                  className="ml-2 text-blue-500 hover:text-blue-400 underline"
                  onClick={() => {
                    /* Add upgrade flow later */
                  }}
                >
                  Upgrade for unlimited access
                </button>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col h-full overflow-y-auto mt-2">
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
            <Thread
              runtime={runtime}
              // assistantMessage={{
              //   components: {
              //     Text: (text) => (
              //       <div className="w-full">
              //         {text.status.type === 'running' ? (
              //           <div className="">
              //             <CircleLoader color="white" size={15} />
              //           </div>
              //         ) : text.text === lastMessage ? (
              //           <TypingEffect
              //             text={text.text}
              //             setLastMessage={setLastMessage}
              //           />
              //         ) : (
              //           <Markdown>{text.text}</Markdown>
              //         )}
              //       </div>
              //     )
              //   }
              // }}
              welcome={{
                message: `I know all about ${selectedGame.name}. Speak to the Raven.`
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
