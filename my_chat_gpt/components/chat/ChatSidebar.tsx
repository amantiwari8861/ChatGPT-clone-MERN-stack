"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useChatStore, useStartChat } from "@/components/chat/ChatProvider";
import { ChatList } from "@/components/chat/ChatList";
import { ProjectList } from "@/components/chat/ProjectList";
import { SidebarHeader } from "@/components/chat/SidebarHeader";
import { UserProfile } from "@/components/chat/UserProfile";

type ChatSidebarProps = {
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
};

export function ChatSidebar({ onNavigate, onToggleCollapse }: ChatSidebarProps) {
  const { chats, projects, togglePin, deleteChat } = useChatStore();
  const startChat = useStartChat();
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const activeChatId = pathname.startsWith("/chats/")
    ? pathname.slice("/chats/".length)
    : null;

  const trimmedQuery = query.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!trimmedQuery) return [];
    return chats.filter((chat) => chat.title.toLowerCase().includes(trimmedQuery));
  }, [chats, trimmedQuery]);

  const pinnedChats = chats.filter((chat) => chat.pinned);
  const recentChats = chats.filter(
    (chat) => !chat.pinned && chat.projectId === null,
  );

  const handleNewChat = () => {
    const isActiveEmpty =
      activeChatId !== null &&
      chats.some((chat) => chat.id === activeChatId && chat.messages.length === 0);

    if (!isActiveEmpty) startChat();
    onNavigate?.();
  };

  const handleDelete = (chatId: string) => {
    deleteChat(chatId);
    if (chatId === activeChatId) {
      router.push("/chats");
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-panel">
      <SidebarHeader
        searchOpen={searchOpen}
        query={query}
        onQueryChange={setQuery}
        onSearchOpenChange={(open) => {
          setSearchOpen(open);
          if (!open) setQuery("");
        }}
        onNewChat={handleNewChat}
        onToggleCollapse={() => onToggleCollapse?.()}
      />

      <nav
        aria-label="Chat history"
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-2.5 pb-4"
      >
        {trimmedQuery ? (
          <ChatList
            title="Results"
            chats={searchResults}
            activeChatId={activeChatId}
            emptyLabel={`No chats match “${query.trim()}”.`}
            onTogglePin={togglePin}
            onDelete={handleDelete}
          />
        ) : (
          <>
            <ChatList
              title="Pinned"
              chats={pinnedChats}
              activeChatId={activeChatId}
              emptyLabel="Nothing pinned yet."
              onTogglePin={togglePin}
              onDelete={handleDelete}
            />
            <ProjectList
              projects={projects}
              chats={chats}
              activeChatId={activeChatId}
              onTogglePin={togglePin}
              onDelete={handleDelete}
            />
            <ChatList
              title="Recent"
              chats={recentChats}
              activeChatId={activeChatId}
              emptyLabel="No recent chats."
              onTogglePin={togglePin}
              onDelete={handleDelete}
            />
          </>
        )}
      </nav>

      <UserProfile />
    </div>
  );
}
