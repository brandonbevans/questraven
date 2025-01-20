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

  const runtime = useEdgeRuntime({
    api: '/api/chat',
    body: {
      namespace: selectedGame.namespace,
      chatId: userchatId
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
