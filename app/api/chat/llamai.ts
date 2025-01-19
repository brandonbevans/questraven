import { Tables } from '@/types_db';
import { getDataSource } from '../../../lib/pinecone';
type Message = Tables<'messages'>;

export const getLlamaindexResponse = async (
  messages: Message[],
  gameName: string
) => {
  try {
    const index = await getDataSource(gameName);
    const queryEngine = index.asQueryEngine();
    const { message } = await queryEngine.query({
      query: messages[messages.length - 1].content
    });
    return message.content.toString();
  } catch (error) {
    console.error('Error getting chat completion:', error);
    throw new Error('Error generating chat completion');
  }
};
