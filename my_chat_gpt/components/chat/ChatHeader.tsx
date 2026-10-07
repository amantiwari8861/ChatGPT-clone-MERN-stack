"use client";

import { Menu, MoreHorizontal, PanelLeft, Pin, PinOff, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useChatStore } from "@/components/chat/ChatProvider";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";

type ChatHeaderProps = {
  collapsed: boolean;
  menuButtonRef?: React.Ref<HTMLButtonElement>;
  onOpenMenu: () => void;
  onToggleCollapse: () => void;
};

export function ChatHeader({
  collapsed,
  menuButtonRef,
  onOpenMenu,
  onToggleCollapse,
}: ChatHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { getChat, deleteChat, togglePin } = useChatStore();

  const chatId = pathname.startsWith("/chats/") ? pathname.slice(7) : null;
  const chat = chatId ? getChat(chatId) : undefined;
  const title = chat?.title ?? "New chat";

  const menuItems = chat
    ? [
        {
          id: "pin",
          label: chat.pinned ? "Unpin from top" : "Pin to top",
          icon: chat.pinned ? PinOff : Pin,
          onSelect: () => togglePin(chat.id),
        },
        {
          id: "delete",
          label: "Delete chat",
          icon: Trash2,
          danger: true,
          onSelect: () => {
            deleteChat(chat.id);
            router.push("/chats");
          },
        },
      ]
    : [];

  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b border-line/80 px-2.5 md:px-3">
      <IconButton
        label="Open navigation menu"
        size="sm"
        ref={menuButtonRef}
        onClick={onOpenMenu}
        className="md:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </IconButton>

      {collapsed && (
        <IconButton
          label="Expand sidebar"
          size="sm"
          onClick={onToggleCollapse}
          className="hidden md:inline-flex"
        >
          <PanelLeft className="size-4" aria-hidden="true" />
        </IconButton>
      )}

      <h1 className="min-w-0 flex-1 truncate px-1.5 text-[14px] font-medium text-ink">
        {title}
      </h1>

      {chat && (
        <DropdownMenu
          label="Chat options"
          triggerIcon={MoreHorizontal}
          items={menuItems}
        />
      )}
    </header>
  );
}
