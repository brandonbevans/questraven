import { loadEnv } from '@/scripts/env';
loadEnv();

import { getLlamaindexResponse } from '@/app/api/chat/llamai';
import { Tables } from '@/types_db';
type Message = Tables<'messages'>;

const testQuery = async () => {
  const testMessage: Message = {
    role: 'user',
    content:
      "What's the first thing I should do when I start playing Elden Ring?",
    chat_id: '1',
    created_at: new Date().toISOString(),
    id: '1'
  };

  const gameName = process.argv[2] || 'eldenring';

  console.log(`Testing query for game: ${gameName}`);
  console.log(`Query: ${testMessage.content}`);

  try {
    const response = await getLlamaindexResponse([testMessage], gameName);
    console.log('\nResponse:', response);
  } catch (error) {
    console.error('Error:', error);
  }
};

testQuery();
