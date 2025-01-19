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
import { useEffect, useState } from 'react';
type Game = Tables<'games'>;
type Message = Tables<'messages'>;

export function useChatInterface({ selectedGame }: { selectedGame: Game }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setMessages([]);
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
          // You can do something with chat here if needed (e.g., setState)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame, supabase]);

  const runtime = useEdgeRuntime({
    api: '/api/chat',
    initialMessages: messages.map((message) => ({
      role: message.role as 'assistant' | 'user' | 'system',
      content: message.content,
      id: message.id
    })),
    body: {
      namespace: selectedGame.namespace
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
