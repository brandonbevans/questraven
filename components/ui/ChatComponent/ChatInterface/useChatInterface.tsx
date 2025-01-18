import {
  convertMessage,
  FREE_MESSAGE_LIMIT
} from '@/components/ui/ChatComponent/helper';
import { MyMessage } from '@/components/ui/ChatComponent/type';
import { Tables } from '@/types_db';
import {
  createChat,
  getChatByUserAndGame,
  getMessagesByChat,
  getUser
} from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import { AppendMessage, useExternalStoreRuntime } from '@assistant-ui/react';
import { useEffect, useState } from 'react';

type Game = Tables<'games'>;

export function useChatInterface({ selectedGame }: { selectedGame: Game }) {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [messages, setMessages] = useState<MyMessage[]>([]);
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
        const response = await fetch('/api/subscription/status');

        if (!response.ok) {
          throw new Error('Failed to fetch subscription status');
        }

        const data = await response.json();
        setHasSubscription(Boolean(data.hasActiveSubscription));
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      }
    }

    async function getUserMessagesCount() {
      const userMessagesCount = await fetch('/api/messages/count')
        .then((res) => res.json())
        .then((data) => data.count);
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
        const user = await getUser(supabase);
        const chat = await getChatByUserAndGame(
          supabase,
          user.id,
          selectedGame.id
        );
        let chatId = chat?.id;
        if (!chat) {
          const newChat = await createChat(
            supabase,
            user?.id ?? '',
            selectedGame.id
          );
          chatId = newChat.id;
        } else {
          // You can do something with chat here if needed (e.g., setState)
          const userMessages = await getMessagesByChat(supabase, chat.id);
          setMessages(userMessages);
        }
        setUserChatId(chatId);
      } catch (error) {
        console.log('Error fetching chat:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame, supabase]);

  const onNew = async (message: AppendMessage) => {
    if (message.content[0]?.type !== 'text')
      throw new Error('Only text messages are supported');

    const input = message.content[0].text;
    setLastMessage('');
    try {
      setMessages((currentConversation) => [
        ...currentConversation,
        { role: 'user', content: input }
      ]);
      setIsRunning(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: selectedGame.id,
          gameName: selectedGame.namespace,
          chatId: userchatId,
          messages: [...messages, { role: 'user', content: input }]
        })
      });

      const messagedata: { message: string } = await response.json();
      setMessages((currentConversation) => [
        ...currentConversation,
        { role: 'assistant', content: messagedata.message }
      ]);
      setLastMessage(messagedata.message);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const runtime = useExternalStoreRuntime({
    isRunning,
    messages,
    isDisabled: !hasSubscription && userMessagesCount >= FREE_MESSAGE_LIMIT,
    convertMessage,
    onNew
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
