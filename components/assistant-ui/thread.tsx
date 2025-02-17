'use client';

import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive
} from '@assistant-ui/react';
import { BirdIcon, SendHorizontalIcon } from 'lucide-react';
import type { FC } from 'react';

import { MarkdownText } from '@/components/assistant-ui/markdown-text';
import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';
import { Avatar } from '@/components/ui/avatar';
import { Tables } from '@/types_db';

type Game = Tables<'games'>;

export const Thread: FC<{ game: Game }> = ({ game }) => {
  return (
    <ThreadPrimitive.Root className="bg-zinc-950 h-full">
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-2 sm:px-4 pt-4 sm:pt-8">
        <ThreadWelcome game={game} />
        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            AssistantMessage: AssistantMessage
          }}
        />

        <div className="min-h-4 sm:min-h-8 flex-grow" />

        <div className="sticky bottom-0 mt-2 sm:mt-3 flex w-full max-w-2xl flex-col items-center justify-end rounded-t-lg bg-inherit pb-2 sm:pb-4">
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadWelcome: FC<{ game: Game }> = ({ game }) => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex flex-grow flex-col items-center justify-center">
        <Avatar className="bg-zinc-800">
          <BirdIcon className="text-zinc-100 size-6 m-auto" />
          {/* <AvatarFallback className="text-zinc-100">C</AvatarFallback> */}
        </Avatar>
        <p className="mt-4 font-medium text-zinc-100">
          Ask me anything about {game.name}.
        </p>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-zinc-300/20 flex w-full flex-wrap items-end rounded-lg border border-zinc-800 bg-zinc-950 px-2 sm:px-2.5 shadow-sm transition-colors ease-in">
      <ComposerPrimitive.Input
        autoFocus
        placeholder="Write a message..."
        rows={1}
        className="placeholder:text-zinc-500 max-h-24 sm:max-h-40 flex-grow resize-none border-none bg-transparent px-1 sm:px-2 py-2 sm:py-4 text-sm text-zinc-100 outline-none focus:ring-0 disabled:cursor-not-allowed dark:placeholder:text-zinc-400"
      />
      <ComposerPrimitive.Send asChild>
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          className="my-1.5 sm:my-2.5 size-7 sm:size-8 p-1.5 sm:p-2 transition-opacity ease-in"
        >
          <SendHorizontalIcon />
        </TooltipIconButton>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-2xl auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-1 sm:gap-y-2 py-2 sm:py-4">
      <div className="bg-zinc-800 text-zinc-50 col-start-2 row-start-1 max-w-xl break-words rounded-2xl sm:rounded-3xl px-3 sm:px-5 py-2 sm:py-2.5">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-2xl grid-cols-[auto_1fr] grid-rows-[auto_1fr] py-2 sm:py-4">
      <Avatar className="bg-zinc-800 mr-2 sm:mr-4 size-7 sm:size-8">
        <BirdIcon className="text-zinc-100 size-4 sm:size-6 m-auto" />
      </Avatar>

      <div className="text-zinc-50 col-start-2 row-start-1 my-1 sm:my-1.5 max-w-xl break-words leading-6 sm:leading-7">
        <MessagePrimitive.Content components={{ Text: MarkdownText }} />
      </div>
    </MessagePrimitive.Root>
  );
};
