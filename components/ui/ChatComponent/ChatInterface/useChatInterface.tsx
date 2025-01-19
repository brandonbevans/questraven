import {
  convertMessage,
  FREE_MESSAGE_LIMIT
} from '@/components/ui/ChatComponent/helper';
import { MyMessage } from '@/components/ui/ChatComponent/type';
import { Tables } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import {
  createChat,
  createMessage,
  getChatByUserAndGame,
  getMessagesByChat,
  getMessagesCount,
  getSubscription
} from '@/utils/supabase/queries';
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

      // Create user message in supabase
      createMessage(supabase, userchatId, 'user', input);
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
      const messagedata = await response.json();
      if (messagedata.message) {
        createMessage(supabase, userchatId, 'assistant', messagedata.message);
      } else {
        console.log(
          'failed to create message from RAG response: ',
          messagedata
        );
      }
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
