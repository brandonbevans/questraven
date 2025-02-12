import {
  appendResponseMessages,
  convertToCoreMessages,
  createIdGenerator,
  streamText
} from 'ai';

import { getContext } from '@/utils/postgres/context';
import { createClient } from '@/utils/supabase/client';
import { saveChat } from '@/utils/supabase/queries';
import { createOpenAI } from '@ai-sdk/openai';
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

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, namespace, chatId } = await req.json();
  const message = messages[messages.length - 1];

  const context = await getContext(message.content[0].text, namespace);
  const prompt = `
    AI assistant is a brand new, powerful, human-like artificial intelligence.
    The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
    AI's main goal is to help users where they're stuck in the RPG game that they're playing.
    AI is takes on the characteristics of an omniscient Raven.
    START CONTEXT BLOCK
    ${context}
    END OF CONTEXT BLOCK
    AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
    AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
    AI assistant will give step-by-step instructions for the user to follow only if the incoming question warrants it.
    AI assistant will answer the question proportionally to the type of question. If the question is very direct and specific, the AI assistant will answer in a very direct and specific way. If the question is very open-ended, the AI assistant will answer in a very open-ended way.
    Don't be extremely specific unless specifically asked. You want to leave just enough for them to figure some out on their own, unless they ask for something specific.`;

  const result = streamText({
    system: prompt,
    model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    async onFinish({ response }) {
      await saveChat(
        supabase,
        chatId,
        appendResponseMessages({
          messages,
          responseMessages: response.messages
        })
      );
    },
    experimental_generateMessageId: createIdGenerator({
      prefix: 'msgs',
      size: 16
    })
  });

  return result.toDataStreamResponse();
}
