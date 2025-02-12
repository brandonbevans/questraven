import { SupabaseClient } from '@supabase/supabase-js';
import { Message } from 'ai';
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
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('enabled', true);
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

export const getMessagesCount = cache(
  async (supabase: SupabaseClient, userId: string) => {
    const { data, error } = await supabase
      .from('chats')
      .select('messages')
      .eq('user_id', userId);

    if (error) {
      throw new Error('Failed to fetch messages count');
    }

    // Sum up the total user messages across all chats
    const totalUserMessages = data.reduce((total, chat) => {
      const userMessages =
        chat.messages?.filter((msg: { role: string }) => msg.role === 'user') ||
        [];
      return total + userMessages.length;
    }, 0);

    return totalUserMessages;
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

export const saveChat = cache(
  async (supabase: SupabaseClient, chatId: string, messages: Message[]) => {
    // Convert messages to a simpler format that PostgreSQL can handle
    const simplifiedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      id: msg.id,
      createdAt: msg.createdAt
    }));

    const { data, error } = await supabase
      .from('chats')
      .update({ messages: simplifiedMessages })
      .eq('id', chatId);
    if (error) {
      throw new Error('Failed to save chat: ' + error.message);
    }
    return data;
  }
);
