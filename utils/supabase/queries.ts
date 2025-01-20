import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
});

export const getSubscription = cache(async (supabase: SupabaseClient) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  return subscription;
});

export const getProducts = cache(async (supabase: SupabaseClient) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { referencedTable: 'prices' });

  return products;
});

export const getUserDetails = cache(async (supabase: SupabaseClient) => {
  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();
  return userDetails;
});

export const getGames = cache(async (supabase: SupabaseClient) => {
  const { data: games, error } = await supabase.from('games').select('*');
  if (error) {
    throw new Error('Failed to fetch games');
  }
  return games;
});

export const getGame = cache(
  async (supabase: SupabaseClient, namespace: string) => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('namespace', namespace)
      .single();

    if (error) {
      throw new Error('Failed to fetch game');
    }
    return data;
  }
);

export const createChat = cache(
  async (supabase: SupabaseClient, userId: string, gameId: string) => {
    const { data, error } = await supabase
      .from('chats')
      .insert({
        user_id: userId,
        game_id: gameId
      })
      .select()
      .single();
    if (error) {
      throw new Error('Failed to create chat');
    }
    return data;
  }
);

export const getChat = cache(
  async (supabase: SupabaseClient, chatId: string) => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();
    return data;
  }
);

export const getChatByUserAndGame = cache(
  async (supabase: SupabaseClient, userId: string, gameId: string) => {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .maybeSingle();
    return data;
  }
);

export const getMessagesByChat = cache(
  async (supabase: SupabaseClient, chatId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId);
    if (error) {
      throw new Error('Failed to fetch messages');
    }
    return data;
  }
);

export const getMessagesCount = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('messages')
      .select('id, chat_id, chats(id, user_id)', { count: 'exact' })
      .eq('role', 'user')
      .gt('created_at', thirtyDaysAgo.toISOString());
    if (error) {
      throw new Error('Failed to fetch message count');
    }

    return data?.length || 0;
  }
);

export const addMessage = cache(
  async (
    supabase: SupabaseClient,
    chatId: string,
    role: 'user' | 'assistant',
    content: string
  ) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({ chat_id: chatId, role: role, content: content });
    if (error) {
      throw new Error('Failed to create message');
    }
    return data;
  }
);

export const createNote = cache(
  async (
    supabase: SupabaseClient,
    note: { user_id: string; content: string; type: string }
  ) => {
    const { data, error } = await supabase.from('notes').insert(note);
    if (error) {
      throw new Error('Failed to create note');
    }
    return data;
  }
);
