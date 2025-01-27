import { Tables } from '@/types_db';
import { getContext } from '@/utils/pinecone/context';
type Message = Tables<'messages'>;

const testQuery = async () => {
  const testMessage: Message = {
    role: 'user',
    text: 'Where do I find copper?',
    chat_id: '1',
    created_at: new Date().toISOString(),
    id: '1'
  };

  const gameName = 'valheim';
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
