import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import {
  createChat,
  getChatByUserAndGame,
  getMessagesByChat,
  getMessagesCount,
  getSubscription
} from '@/utils/supabase/queries';
import { useEdgeRuntime } from '@assistant-ui/react';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';

type Game = Tables<'games'>;
type Message = Tables<'messages'>;

export function useChatInterface({ selectedGame }: { selectedGame: Game }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [lastMessage, setLastMessage] = useState('');
  const [userchatId, setUserChatId] = useState('');
  const [userMessagesCount, setUserMessagesCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Handle session changes here
      console.log('Auth event:', event);
      console.log('Session:', session);
    });
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const data = await getSubscription(supabase);
        console.log('getSubscription: ', data);
        setHasSubscription(Boolean(data));
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      }
    }

    async function getUserMessagesCount() {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      const userMessagesCount = await getMessagesCount(
        supabase,
        user?.id ?? ''
      );
      setUserMessagesCount(userMessagesCount);
    }

    checkSubscription();
    getUserMessagesCount();
  }, [supabase]);

  useEffect(() => {
    const fetchChat = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser();
        let chat = await getChatByUserAndGame(
          supabase,
          user?.id ?? '',
          selectedGame.id
        );
        if (!chat) {
          chat = await createChat(supabase, user?.id ?? '', selectedGame.id);
        } else {
          const userMessages = await getMessagesByChat(supabase, chat.id);
          setMessages(userMessages);
        }
        setUserChatId(chat.id);
      } catch (error) {
        console.log('Error fetching chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [selectedGame, supabase]);

  const onNew = async (m: any) => {
    if (m.content[0]?.type !== 'text')
      throw new Error('Only text messages are supported');

    const input = m.content[0].text;
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', content: input, id: m.id || nanoid() } as Message
    ]);

    try {
      setIsRunning(true);
      // Handle the API call and response here
      // Add your API call logic
    } finally {
      setIsRunning(false);
    }
  };

  const runtime = useEdgeRuntime({
    api: '/api/chat',
    // initialMessages: messages.map((message) => ({
    //   role: message.role as 'assistant' | 'user' | 'system',
    //   content: [{ type: 'text', text: message.content }],
    //   id: message.id || nanoid()
    // })),
    body: {
      namespace: selectedGame.namespace,
      messages: messages.map((message) => ({
        role: message.role as 'assistant' | 'user' | 'system',
        content: [{ type: 'text', text: message.content }],
        id: message.id || nanoid()
      }))
    }
  });

  return {
    runtime,
    isLoading,
    messages,
    userMessagesCount,
    hasSubscription,
    lastMessage,
    setLastMessage
  };
}
