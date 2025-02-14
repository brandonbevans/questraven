'use client';

import ChatInterface from '@/components/ui/ChatComponent/ChatInterface/ChatInterface';
import Sidebar from '@/components/ui/Sidebar';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import {
  createChat,
  getChatByUserAndGame,
  getGames,
  getUser
} from '@/utils/supabase/queries';
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

  function onGameChange(newGame: Game) {
    setSelectedGame(newGame);
  }

  useEffect(() => {
    async function fetchChat() {
      if (!selectedGame) {
        return;
      }
      setIsLoading(true);
      try {
        const user = await getUser(supabase);

        let chat = await getChatByUserAndGame(
          supabase,
          user?.id ?? '',
          selectedGame.id
        );

        if (!chat) {
          chat = await createChat(supabase, user?.id ?? '', selectedGame.id);
        }
        setUserChatId(chat.id);
      } catch (error) {
        console.log('Error fetching chat:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChat();
  }, [selectedGame, supabase]);

  useEffect(() => {
    setMounted(true);
    async function loadInitialGame() {
      try {
        // Prefetch games data
        const gamesPromise = getGames(supabase);
        const userPromise = getUser(supabase);

        const [games, user] = await Promise.all([gamesPromise, userPromise]);

        if (!games || games.length === 0) {
          throw new Error('Failed to fetch initial game');
        }
        if (!user) {
          throw new Error('Failed to fetch user');
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
            <ChatInterface selectedGame={selectedGame} />
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
