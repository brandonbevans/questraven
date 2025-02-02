'use client';

import RequestGameDialog from '@/components/ui/RequestGameDialog';
import SubmitImprovementDialog from '@/components/ui/SubmitImprovementDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import { getGames } from '@/utils/supabase/queries';
import { ChevronLeft, Home, MessageSquarePlus, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Game = Tables<'games'>;

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedGame: Game;
  onGameSelect: (game: Game) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  selectedGame,
  onGameSelect
}: SidebarProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImprovementDialog, setShowImprovementDialog] = useState(false);
  const [showGameRequestDialog, setShowGameRequestDialog] = useState(false);
  const supabase = createClient();
  useEffect(() => {
    getGames(supabase).then((games) => {
      setGames(games);
      setIsLoading(false);
    });
  }, []);

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Card className="w-64 h-full p-4 bg-zinc-950 border-zinc-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-900 rounded w-1/2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-zinc-900 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-64 h-full p-4 bg-zinc-950 border-zinc-800">
        <div className="text-red-400">{error}</div>
      </Card>
    );
  }

  return (
    <div className="h-full border-r border-zinc-800 bg-zinc-950 p-4">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>

            <button
              onClick={() => setShowImprovementDialog(true)}
              className="w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50"
            >
              <MessageSquarePlus className="h-5 w-5" />
              <span className="font-medium">Submit Improvement</span>
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
            aria-label="Close Sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4 mt-4">
          <h2 className="text-xl font-bold text-zinc-50 px-2">Games</h2>
          <div className="space-y-2 overflow-y-auto">
            {games.map((game) => (
              <button
                key={game.namespace}
                onClick={() => onGameSelect(game)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  selectedGame?.namespace === game.namespace
                    ? 'bg-blue-600/20 text-zinc-50 hover:bg-blue-600/30'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50'
                }`}
              >
                <Image
                  src={`/logos/${game.namespace}.png`}
                  alt={game.name}
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <div className="text-left">
                  <div className="font-medium">{game.name}</div>
                  <div
                    className={`text-xs ${
                      selectedGame?.namespace === game.namespace
                        ? 'text-zinc-200'
                        : 'text-zinc-500'
                    } line-clamp-1`}
                  >
                    {game.description}
                  </div>
                </div>
              </button>
            ))}

            <button
              onClick={() => setShowGameRequestDialog(true)}
              className="w-full flex items-center gap-3 p-2 mt-8 rounded-lg transition-colors text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 border-t border-zinc-800 pt-8"
            >
              <PlusCircle className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Request a Game</div>
                <div className="text-xs text-zinc-500">
                  Not seeing your game? Request to add it here!
                </div>
              </div>
            </button>
          </div>
        </div>

        <RequestGameDialog
          open={showGameRequestDialog}
          onOpenChange={setShowGameRequestDialog}
        />

        <SubmitImprovementDialog
          open={showImprovementDialog}
          onOpenChange={setShowImprovementDialog}
        />
      </div>
    </div>
  );
}
