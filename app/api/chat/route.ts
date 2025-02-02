import { getContext } from '@/utils/postgres/context';
import { createClient } from '@/utils/supabase/client';
import { addMessage } from '@/utils/supabase/queries';
import { createOpenAI } from '@ai-sdk/openai';
import { getEdgeRuntimeResponse } from '@assistant-ui/react/edge';
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const supabase = createClient();
const openai = createOpenAI({
  baseURL: 'https://oai.helicone.ai/v1',
  headers: {
    'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
    'helicone-stream-usage': 'true'
  }
});
export async function POST(req: Request) {
  try {
    const { messages, namespace, chatId } = await req.json();

    const message = messages[messages.length - 1];

    await addMessage(supabase, chatId, message.role, message.content[0].text);
    const context = await getContext(message.content[0].text, namespace);
    console.log('context', context);
    const prompt = [
      {
        role: 'system',
        content: [
          {
            type: 'text',
            text: `
      AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI's main goal is to help users where they're stuck in the RPG game that they're playing.
      AI is takes on the characteristics of an omniscient Raven.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      AI assistant will answer the question proportionally to the type of question. If the question is very direct and specific, the AI assistant will answer in a very direct and specific way. If the question is very open-ended, the AI assistant will answer in a very open-ended way.
      Don't be extremely specific unless specifically asked. You want to leave just enough for them to figure some out on their own, unless they ask for something specific.`
          }
        ]
      }
    ];

    return getEdgeRuntimeResponse({
      requestData: {
        messages: [
          ...prompt,
          ...messages
          // .slice(-6, messages.length - 1) //TODO come back and only include last 5 messages
        ]
      },
      options: {
        model: openai(
          `${process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4o-mini'}`
        ),
        onFinish: async (response) => {
          const messages = response.messages;
          const lastResponseMessage = messages[messages.length - 1];
          if (lastResponseMessage.role === 'assistant') {
            const content = lastResponseMessage.content.find(
              (c) => c.type === 'text'
            );
            if (content && content.type === 'text') {
              await addMessage(supabase, chatId, 'assistant', content.text);
            } else {
              console.error(
                'No text content found in the last response message: ',
                lastResponseMessage
              );
            }
          }
        }
      },
      abortSignal: req.signal
    });
  } catch (e) {
    throw e;
  }
}
