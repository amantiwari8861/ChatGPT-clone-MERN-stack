"use client";

import { useState } from "react";
import { ChevronRight, Folder } from "lucide-react";
import type { ChatProject, ChatThread } from "@/types/chat";
import { ChatList } from "@/components/chat/ChatList";
import { cn } from "@/lib/utils";

type ProjectListProps = {
  projects: ChatProject[];
  chats: ChatThread[];
  activeChatId: string | null;
  onTogglePin: (chatId: string) => void;
  onDelete: (chatId: string) => void;
};

export function ProjectList({
  projects,
  chats,
  activeChatId,
  onTogglePin,
  onDelete,
}: ProjectListProps) {
  const activeProjectId = chats.find((chat) => chat.id === activeChatId)?.projectId;
  const [expanded, setExpanded] = useState<string | null>(null);
  const openProjectId = expanded ?? activeProjectId;

  if (projects.length === 0) return null;

  return (
    <section className="pt-4 pb-1" aria-labelledby="section-projects">
      <h2
        id="section-projects"
        className="px-2.5 pb-1.5 text-[11px] font-medium tracking-wider text-ink-muted uppercase"
      >
        Projects
      </h2>
      <ul className="space-y-0.5">
        {projects.map((project) => {
          const isOpen = openProjectId === project.id;
          const projectChats = chats.filter((chat) => chat.projectId === project.id);

          return (
            <li key={project.id}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : project.id)}
                className={cn(
                  "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-[14px] leading-none transition-colors duration-150",
                  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                  isOpen
                    ? "bg-hover/70 text-ink"
                    : "text-ink-soft hover:bg-hover/70 hover:text-ink",
                )}
              >
                <ChevronRight
                  className={cn(
                    "size-3.5 shrink-0 text-ink-muted transition-transform duration-150",
                    isOpen && "rotate-90",
                  )}
                  aria-hidden="true"
                />
                <Folder className="size-4 shrink-0 opacity-70" aria-hidden="true" />
                <span className="min-w-0 truncate">{project.name}</span>
                <span className="ml-auto text-[11px] text-ink-muted">
                  {projectChats.length}
                </span>
              </button>

              {isOpen && (
                <ChatList
                  title={project.name}
                  chats={projectChats}
                  activeChatId={activeChatId}
                  emptyLabel="No chats yet."
                  depth={1}
                  onTogglePin={onTogglePin}
                  onDelete={onDelete}
                />
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
