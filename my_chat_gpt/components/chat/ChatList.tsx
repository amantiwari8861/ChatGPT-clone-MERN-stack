"use client";

import type { ChatThread } from "@/types/chat";
import { ChatListItem } from "@/components/chat/ChatListItem";

type ChatListProps = {
  title: string;
  chats: ChatThread[];
  activeChatId: string | null;
  emptyLabel?: string;
  depth?: number;
  onTogglePin: (chatId: string) => void;
  onDelete: (chatId: string) => void;
};

export function ChatList({
  title,
  chats,
  activeChatId,
  emptyLabel,
  depth = 0,
  onTogglePin,
  onDelete,
}: ChatListProps) {
  if (chats.length === 0) {
    if (!emptyLabel) return null;
    return (
      <section className="pt-4 pb-1" aria-label={title}>
        <p className="px-2.5 pb-2 text-[11px] font-medium tracking-wider text-ink-muted uppercase">
          {title}
        </p>
        <p className="px-2.5 text-[13px] text-ink-muted">{emptyLabel}</p>
      </section>
    );
  }

  const headingId = `section-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <section className="pt-4 pb-1" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="px-2.5 pb-1.5 text-[11px] font-medium tracking-wider text-ink-muted uppercase"
      >
        {title}
      </h2>
      <ul className="space-y-0.5">
        {chats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            depth={depth}
            active={chat.id === activeChatId}
            onTogglePin={onTogglePin}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
