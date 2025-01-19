import { NextResponse, type NextRequest } from 'next/server';
import { getLlamaindexResponse } from './llamai';

import { Tables } from '@/types_db';
export const runtime = 'nodejs';

type Message = Tables<'messages'>;

export async function POST(request: NextRequest) {
  try {
    const { messages, chatId, gameName } = (await request.json()) as {
      messages: Message[];
      chatId: string;
      gameName: string;
    };
    const userMessage = messages[messages.length - 1];

    const assistantMessageContent = await getLlamaindexResponse(
      messages,
      gameName
    );

    if (!assistantMessageContent) {
      return NextResponse.json(
        { detail: 'Failed to generate a response' },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: assistantMessageContent });
  } catch (error) {
    const detail = (error as Error).message;
    return NextResponse.json({ detail }, { status: 500 });
  }
}
