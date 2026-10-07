"use client";

import { EmptyChat } from "@/components/chat/EmptyChat";
import { useStartChat } from "@/components/chat/ChatProvider";

export default function ChatsIndexPage() {
  const startChat = useStartChat();

  return <EmptyChat onSend={(content) => startChat(content)} />;
}
