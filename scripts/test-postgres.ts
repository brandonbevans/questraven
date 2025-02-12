import { getContext } from '@/utils/postgres/context';
import { Message } from 'ai';

const testQuery = async () => {
  const testMessage: Message = {
    role: 'user',
    content: 'Where do I find copper?',
    createdAt: new Date(),
    id: '1'
  };

  const gameName = 'valheim';
  console.log(`Testing context for game: ${gameName}`);
  console.log(`Query: ${testMessage.content}`);

  try {
    const response = await getContext(testMessage.content, gameName);
    console.log('\nResponse:', response);
  } catch (error) {
    console.error('Error:', error);
  }
};

testQuery();
