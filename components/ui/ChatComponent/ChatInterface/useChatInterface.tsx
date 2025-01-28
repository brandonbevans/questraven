import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import {
  createChat,
  getChatByUserAndGame,
  getMessagesByChat,
  getSubscription
} from '@/utils/supabase/queries';
import { useEffect, useState } from 'react';

type Game = Tables<'games'>;
type Message = Tables<'messages'>;

export function useChatInterface({ selectedGame }: { selectedGame: Game }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessage, setLastMessage] = useState('');
  const [userChatId, setUserChatId] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Handle session changes here
    });
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    async function checkSubscription() {
      try {
        const data = await getSubscription(supabase);
        setHasSubscription(Boolean(data));
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      }
    }

    checkSubscription();
  }, [supabase, messages]);

  useEffect(() => {
    async function fetchChat() {
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
    }

    fetchChat();
  }, [selectedGame, supabase]);

  return {
    isLoading,
    messages,
    hasSubscription,
    lastMessage,
    setLastMessage,
    userChatId
  };
}
