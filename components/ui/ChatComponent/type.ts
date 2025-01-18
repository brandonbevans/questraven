import { Tables } from '@/types_db';

type Game = Tables<'games'>;

export interface ChatInterfaceProps {
  selectedGame: Game;
}

export interface MyMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
}
