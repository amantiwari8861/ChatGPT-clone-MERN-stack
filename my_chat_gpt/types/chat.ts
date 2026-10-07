export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatProject {
  id: string;
  name: string;
}

export interface ChatThread {
  id: string;
  title: string;
  projectId: string | null;
  pinned: boolean;
  updatedAt: string;
  messages: ChatMessage[];
  pending?: boolean;
}

export interface ChatStore {
  chats: ChatThread[];
  projects: ChatProject[];
  getChat: (id: string) => ChatThread | undefined;
  createChat: () => string;
  sendMessage: (chatId: string, content: string) => void;
  deleteChat: (chatId: string) => void;
  togglePin: (chatId: string) => void;
}
