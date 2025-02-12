'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { Message } from 'ai';
export function MyRuntimeProvider({
  children,
  chatId,
  namespace,
  messages
}: Readonly<{
  children: React.ReactNode;
  chatId: string;
  namespace: string;
  messages: Message[];
}>) {
  const initialMessages = messages.map((msg) => ({
    role: msg.role as 'system' | 'user' | 'assistant',
    content: msg.content,
    createdAt: msg.createdAt
  }));

  const runtime = useChatRuntime({
    api: '/api/chat',
    body: {
      chatId: chatId,
      namespace: namespace
    },
    initialMessages: initialMessages
  });
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
