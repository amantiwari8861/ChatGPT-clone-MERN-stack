"use client";

import Link from "next/link";
import { MessageCircle, MoreHorizontal, Pin, PinOff, Trash2 } from "lucide-react";
import type { ChatThread } from "@/types/chat";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { cn } from "@/lib/utils";

type ChatListItemProps = {
  chat: ChatThread;
  active: boolean;
  depth?: number;
  onTogglePin: (chatId: string) => void;
  onDelete: (chatId: string) => void;
};

export function ChatListItem({
  chat,
  active,
  depth = 0,
  onTogglePin,
  onDelete,
}: ChatListItemProps) {
  return (
    <li className="group/item relative">
      <Link
        href={`/chats/${chat.id}`}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg pr-9 pl-2.5 text-[14px] leading-none transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
          active
            ? "bg-hover text-ink"
            : "text-ink-soft hover:bg-hover/70 hover:text-ink",
          depth > 0 && "pl-7",
        )}
      >
        <MessageCircle className="size-4 shrink-0 opacity-70" aria-hidden="true" />
        <span className="min-w-0 truncate">{chat.title}</span>
        <span className="ml-auto shrink-0 pl-2 text-[11px] text-ink-muted opacity-0 transition-opacity group-hover/item:opacity-100">
          {chat.updatedAt}
        </span>
      </Link>

      <div className="absolute top-1/2 right-1 -translate-y-1/2 opacity-0 transition-opacity focus-within:opacity-100 group-hover/item:opacity-100">
        <DropdownMenu
          label={`Options for ${chat.title}`}
          triggerIcon={MoreHorizontal}
          items={[
            {
              id: "pin",
              label: chat.pinned ? "Unpin from top" : "Pin to top",
              icon: chat.pinned ? PinOff : Pin,
              onSelect: () => onTogglePin(chat.id),
            },
            {
              id: "delete",
              label: "Delete chat",
              icon: Trash2,
              danger: true,
              onSelect: () => onDelete(chat.id),
            },
          ]}
        />
      </div>
    </li>
  );
}
