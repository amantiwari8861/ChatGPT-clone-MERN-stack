"use client";

import Link from "next/link";
import { useChatStore } from "@/components/chat/ChatProvider";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { EmptyChat } from "@/components/chat/EmptyChat";

type ChatConversationProps = {
  chatId: string;
};

export function ChatConversation({ chatId }: ChatConversationProps) {
  const { getChat, sendMessage } = useChatStore();
  const chat = getChat(chatId);

  if (!chat) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[15px] text-ink">This chat is no longer available.</p>
          <Link
            href="/chats"
            className="mt-3 inline-block rounded-lg border border-line px-3.5 py-2 text-[14px] text-ink-soft transition-colors hover:bg-hover hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
          >
            Back to chats
          </Link>
        </div>
      </div>
    );
  }

  if (chat.messages.length === 0) {
    return <EmptyChat onSend={(content) => sendMessage(chat.id, content)} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatMessages messages={chat.messages} pending={chat.pending} />

      <div className="shrink-0 px-4 pt-8 pb-3 md:px-6 md:pb-5">
        <ChatComposer
          onSend={(content) => sendMessage(chat.id, content)}
          showFade
        />
        <p className="mt-2.5 text-center text-[11px] text-ink-muted">
          AI can make mistakes. Check important information.
        </p>
      </div>
    </div>
  );
}
