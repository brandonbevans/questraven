import { getContext } from '@/utils/pinecone/context';
import { openai } from '@ai-sdk/openai';
import { getEdgeRuntimeResponse } from '@assistant-ui/react/edge';
import { Message } from 'ai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, namespace } = await req.json();
    // Get the last message
    const lastMessage = messages[messages.length - 1];

    // Get the context from the last message
    const context = await getContext(lastMessage.content, namespace);
    const prompt = [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI's main goal is to help users where they're stuck in the RPG game that they're playing.
      AI is takes on the characteristics of an omniscient Raven.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.`
          }
        ]
      }
    ];

    return getEdgeRuntimeResponse({
      requestData: {
        messages: [
          ...prompt,
          ...messages
            .filter((message: Message) => message.role === 'user')
            .map((message: Message) => ({
              role: message.role,
              content: message.content
            }))
        ]
      },
      options: {
        model: openai('gpt-4o-mini')
      },
      abortSignal: req.signal
    });
  } catch (e) {
    throw e;
  }
}
