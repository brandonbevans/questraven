'use client';

// import Header from '@/components/Header'
import Sidebar from '@/components/ui/Sidebar';
import { Button } from '@/components/ui/button';
import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import { getGames } from '@/utils/supabase/queries';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type Game = Tables<'games'>;

export default function Bot() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game>();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  useEffect(() => {
    async function loadInitialGame() {
      try {
        const games = await getGames(supabase);
        if (!games) {
          throw new Error('Failed to fetch initial game');
        }
        setSelectedGame(games[0]);
      } catch (error) {
        console.error('Error loading initial game:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialGame();
  }, []);

  if (isLoading || !selectedGame) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      {/* <Header /> */}
      <div className="flex flex-1">
        <div
          className={`${isSidebarOpen ? 'w-80' : 'w-0'} flex-shrink-0 transition-all duration-300`}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            selectedGame={selectedGame}
            onGameSelect={setSelectedGame}
          />
        </div>
        <div className={`flex-1 relative ${!isSidebarOpen ? 'pl-16' : ''}`}>
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
          {/* <ChatInterface selectedGame={selectedGame} /> */}
        </div>
      </div>
    </div>
  );
}
