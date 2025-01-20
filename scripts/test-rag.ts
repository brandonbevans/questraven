import { Tables } from '@/types_db';
import { getContext } from '@/utils/pinecone/context';
type Message = Tables<'messages'>;

const testQuery = async () => {
  const testMessage: Message = {
    role: 'user',
    text: "What's the first thing I should do when I start playing Elden Ring?",
    chat_id: '1',
    created_at: new Date().toISOString(),
    id: '1'
  };

  const gameName = process.argv[2] || 'eldenring';
  console.log('pinecone api key', process.env.PINECONE_API_KEY);
  console.log('openai api key', process.env.OPENAI_API_KEY);
  console.log(`Testing context for game: ${gameName}`);
  console.log(`Query: ${testMessage.text}`);

  try {
    const response = await getContext(testMessage.text, gameName);
    console.log('\nResponse:', response);
  } catch (error) {
    console.error('Error:', error);
  }
};

testQuery();
