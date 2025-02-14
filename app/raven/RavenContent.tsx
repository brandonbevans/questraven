'use client';

import ChatInterface from '@/components/ui/ChatComponent/ChatInterface/ChatInterface';
import Sidebar from '@/components/ui/Sidebar';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import {
  createChat,
  getChatByUserAndGame,
  getGame,
  getGames,
  getUser
} from '@/utils/supabase/queries';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type Game = Tables<'games'>;

export default function RavenContent({
  initialGameNamespace
}: {
  initialGameNamespace?: string;
}) {
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
        // Prefetch games data and user
        const gamesPromise = getGames(supabase);
        const userPromise = getUser(supabase);

        // If game parameter is provided, also fetch that specific game
        const gamePromises = [gamesPromise, userPromise] as const;
        const specificGamePromise = initialGameNamespace
          ? getGame(supabase, initialGameNamespace)
          : Promise.resolve(null);

        const [games, user, specificGame] = await Promise.all([
          ...gamePromises,
          specificGamePromise
        ]);

        if (!games || games.length === 0) {
          throw new Error('Failed to fetch initial game');
        }
        if (!user) {
          throw new Error('Failed to fetch user');
        }

        // Use the specific game if it exists, otherwise use the first game
        const initialGame = specificGame || games[0];
        setSelectedGame(initialGame);

        // Pre-initialize chat for the initial game
        let chat = await getChatByUserAndGame(
          supabase,
          user.id,
          initialGame.id
        );
        if (!chat) {
          chat = await createChat(supabase, user.id, initialGame.id);
        }
        setUserChatId(chat.id);
      } catch (error) {
        console.error('Error loading initial game:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialGame();
  }, [initialGameNamespace]);

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
