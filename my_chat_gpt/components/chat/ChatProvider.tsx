"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ChatMessage, ChatStore, ChatThread } from "@/types/chat";
import { projects } from "@/lib/mock-data";
import { mockAssistantReply } from "@/lib/mock-reply";
import { createId, formatClock } from "@/lib/utils";

const REPLY_DELAY_MS = 1100;

const ChatStoreContext = createContext<ChatStore | null>(null);

export function ChatProvider({
  initial,
  children,
}: {
  initial: ChatThread[];
  children: React.ReactNode;
}) {
  const [chats, setChats] = useState<ChatThread[]>(initial);
  const timers = useRef(new Map<string, number>());

  const getChat = useCallback(
    (id: string) => chats.find((chat) => chat.id === id),
    [chats],
  );

  const createChat = useCallback(() => {
    const id = createId("chat");
    const chat: ChatThread = {
      id,
      title: "New chat",
      projectId: null,
      pinned: false,
      updatedAt: "Now",
      messages: [],
    };
    setChats((current) => [chat, ...current]);
    return id;
  }, []);

  const sendMessage = useCallback((chatId: string, content: string) => {
    const userMessage: ChatMessage = {
      id: createId("msg"),
      role: "user",
      content,
      createdAt: formatClock(new Date()),
    };

    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title:
                chat.messages.length === 0
                  ? content.trim().slice(0, 48) || "New chat"
                  : chat.title,
              updatedAt: "Now",
              pending: true,
              messages: [...chat.messages, userMessage],
            }
          : chat,
      ),
    );

    const existing = timers.current.get(chatId);
    if (existing) window.clearTimeout(existing);

    const timerId = window.setTimeout(() => {
      timers.current.delete(chatId);
      const reply: ChatMessage = {
        id: createId("msg"),
        role: "assistant",
        content: mockAssistantReply(content),
        createdAt: formatClock(new Date()),
      };
      setChats((current) =>
        current.map((chat) =>
          chat.id === chatId
            ? { ...chat, pending: false, messages: [...chat.messages, reply] }
            : chat,
        ),
      );
    }, REPLY_DELAY_MS);

    timers.current.set(chatId, timerId);
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    const timer = timers.current.get(chatId);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(chatId);
    }
    setChats((current) => current.filter((chat) => chat.id !== chatId));
  }, []);

  const togglePin = useCallback((chatId: string) => {
    setChats((current) =>
      current.map((chat) =>
        chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat,
      ),
    );
  }, []);

  const value = useMemo<ChatStore>(
    () => ({ chats, projects, getChat, createChat, sendMessage, deleteChat, togglePin }),
    [chats, getChat, createChat, sendMessage, deleteChat, togglePin],
  );

  return <ChatStoreContext.Provider value={value}>{children}</ChatStoreContext.Provider>;
}

export function useChatStore(): ChatStore {
  const store = useContext(ChatStoreContext);
  if (!store) {
    throw new Error("useChatStore must be used inside <ChatProvider>");
  }
  return store;
}

export function useStartChat(): (content?: string) => void {
  const { createChat, sendMessage } = useChatStore();
  const router = useRouter();

  return useCallback(
    (content?: string) => {
      const id = createChat();
      const trimmed = content?.trim();
      if (trimmed) sendMessage(id, trimmed);
      router.push(`/chats/${id}`);
    },
    [createChat, sendMessage, router],
  );
}
