'use client';

import Image from 'next/image';
import { useState } from 'react';

interface GameCardProps {
  game: {
    name: string;
  };
}

export function GameCard({ game }: GameCardProps) {
  const [imageError, setImageError] = useState(false);
  const imagePath = `/logos/${game.name.toLowerCase().replace(/[^a-z0-9]/g, '')}2.png`;

  return (
    <div className="text-zinc-400 font-semibold text-center p-4 rounded-md hover:bg-zinc-900/50 transition-colors flex flex-col items-center justify-center h-32">
      {!imageError ? (
        <Image
          src={imagePath}
          alt={game.name}
          width={100}
          height={100}
          className="w-auto h-16 object-contain"
          onError={() => setImageError(true)}
          style={{ imageRendering: 'auto' }}
          unoptimized
        />
      ) : (
        <span className="block">{game.name}</span>
      )}
    </div>
  );
}
