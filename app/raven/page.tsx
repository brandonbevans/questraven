'use client';

import ChatInterface from '@/components/ui/ChatComponent/ChatInterface/ChatInterface';
import Sidebar from '@/components/ui/Sidebar';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import {
  createChat,
  getChatByUserAndGame,
  getGames
} from '@/utils/supabase/queries';
import { useEdgeRuntime } from '@assistant-ui/react';
import { ChevronRight } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

type Game = Tables<'games'>;

function RavenContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userChatId, setUserChatId] = useState<string | undefined>();
  const supabase = createClient();
  const [nameToThreadIdMap, setNameToThreadIdMap] = useState<
    Map<string, string>
  >(new Map());

  function onGameChange(newGame: Game) {
    if (!selectedGame) {
      return;
    }
    // if the thread doesn't exist in the map and there's messages, save the existing game into it
    if (
      !nameToThreadIdMap.has(selectedGame.namespace) &&
      runtime.thread.getState().messages.length > 0
    ) {
      const currentThreadId = runtime.threads.getState().mainThreadId;
      setNameToThreadIdMap(
        new Map([
          ...Array.from(nameToThreadIdMap.entries()),
          [selectedGame.namespace, currentThreadId]
        ])
      );
    }

    // if the new game has an entry in the map, switch to it, otherwise create a new state
    if (nameToThreadIdMap.has(newGame.namespace)) {
      const threadId = nameToThreadIdMap.get(newGame.namespace);
      if (threadId) {
        runtime.threads.getItemById(threadId).switchTo();
      }
    } else {
      runtime.threads.switchToNewThread();
    }

    setSelectedGame(newGame);
  }

  useEffect(() => {
    async function fetchChat() {
      if (!selectedGame) {
        return;
      }
      setIsLoading(true);
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        let chat = await getChatByUserAndGame(
          supabase,
          user?.id ?? '',
          selectedGame.id
        );

        if (!chat) {
          chat = await createChat(supabase, user?.id ?? '', selectedGame.id);
        }
        // else {
        //   const userMessages = await getMessagesByChat(supabase, chat.id);
        //   // setMessages(userMessages);
        // }
        setUserChatId(chat.id);
      } catch (error) {
        console.log('Error fetching chat:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChat();
  }, [selectedGame, supabase]);

  const runtime = useEdgeRuntime({
    api: '/api/chat',
    // initialMessages: messages.map((message) => ({
    //   role: message.role as 'user' | 'assistant' | 'system',
    //   content: message.text
    // })),
    body: {
      namespace: selectedGame?.namespace,
      chatId: userChatId
    }
  });

  useEffect(() => {
    setMounted(true);
    async function loadInitialGame() {
      try {
        // Prefetch games data
        const gamesPromise = getGames(supabase);
        const userPromise = supabase.auth.getUser();

        const [
          games,
          {
            data: { user }
          }
        ] = await Promise.all([gamesPromise, userPromise]);

        if (!games || games.length === 0) {
          throw new Error('Failed to fetch initial game');
        }

        setSelectedGame(games[0]);

        // Pre-initialize chat for the first game
        let chat = await getChatByUserAndGame(
          supabase,
          user?.id ?? '',
          games[0].id
        );
        if (!chat) {
          chat = await createChat(supabase, user?.id ?? '', games[0].id);
        }
        setUserChatId(chat.id);
      } catch (error) {
        console.error('Error loading initial game:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialGame();
  }, []);

  // Only show the full screen loader if the page isn't mounted or if there isn't an initial game
  if (!mounted || !selectedGame) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden bg-zinc-950">
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${isSidebarOpen ? 'w-80' : 'w-0'} flex-shrink-0 transition-all duration-300`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            selectedGame={selectedGame}
            onGameSelect={onGameChange}
          />
        </div>
        <div
          className={`flex-1 relative overflow-hidden ${!isSidebarOpen ? 'pl-16' : ''}`}
        >
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-4 left-4 text-zinc-400 hover:text-white"
              aria-label="Open Sidebar"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-pulse text-zinc-400">Loading chat...</div>
            </div>
          ) : (
            <ChatInterface selectedGame={selectedGame} runtime={runtime} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function Raven() {
  return (
    <Suspense>
      <RavenContent />
    </Suspense>
  );
}
