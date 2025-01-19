'use server';

import { openai } from '@ai-sdk/openai';
import { createAI, getMutableAIState, streamUI } from 'ai/rsc';
import { nanoid } from 'nanoid';
import { ReactNode } from 'react';

export interface ServerMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ClientMessage {
  id: string;
  role: 'user' | 'assistant';
  display: ReactNode;
}

export async function continueConversation(
  input: string
): Promise<ClientMessage> {
  'use server';

  const history = getMutableAIState();

  const result = await streamUI({
    model: openai('gpt-4o-mini'),
    messages: [...history.get(), { role: 'user', content: input }],
    text: ({ content, done }) => {
      if (done) {
        history.done((messages: ServerMessage[]) => [
          ...messages,
          { role: 'assistant', content }
        ]);
      }

      return <div>{content}</div>;
    }
  });

  return {
    id: nanoid(),
    role: 'assistant',
    display: result.value
  };
}

export const AI = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation
  },
  initialAIState: [],
  initialUIState: []
});
