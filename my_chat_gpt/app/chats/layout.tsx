import { ChatLayout } from "@/components/chat/ChatLayout";
import { initialChats } from "@/lib/mock-data";

export default function ChatsLayout({ children }: LayoutProps<"/chats">) {
  return <ChatLayout initialChats={initialChats}>{children}</ChatLayout>;
}
