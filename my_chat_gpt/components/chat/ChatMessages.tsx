"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { ChatMessage } from "@/components/chat/ChatMessage";

type ChatMessagesProps = {
  messages: ChatMessageType[];
  pending?: boolean;
};

export function ChatMessages({ messages, pending }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const count = messages.length;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: firstRender.current ? "auto" : "smooth",
    });
    firstRender.current = false;
  }, [count, pending]);

  return (
    <div
      ref={scrollRef}
      className="thin-scrollbar min-h-0 flex-1 overflow-y-auto"
      role="log"
      aria-label="Conversation messages"
      aria-live="polite"
    >
      <div className="mx-auto w-full max-w-[816px] space-y-7 px-4 py-6 md:px-6 md:py-8">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {pending && (
          <div className="message-in flex items-center gap-2 text-[12px] text-ink-muted">
            <span
              aria-hidden="true"
              className="grid size-5 place-items-center rounded-md bg-hover text-[11px] text-ink-soft ring-1 ring-white/10"
            >
              ✦
            </span>
            <span className="font-medium text-ink-soft">AI Assistant</span>
            <span className="flex items-end gap-1" aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className="typing-dot size-1.5 rounded-full bg-ink-muted"
                  style={{ animationDelay: `${index * 0.16}s` }}
                />
              ))}
            </span>
            <span className="sr-only">Assistant is typing</span>
          </div>
        )}
      </div>
    </div>
  );
}
