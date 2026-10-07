"use client";

import { useParams } from "next/navigation";
import { ChatConversation } from "@/components/chat/ChatConversation";

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();

  return <ChatConversation chatId={params.chatId} />;
}
