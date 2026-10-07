import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { MarkdownContent } from "@/components/chat/MarkdownContent";
import { CopyButton } from "@/components/ui/CopyButton";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  if (message.role === "user") {
    return (
      <article className="message-in flex flex-col items-end gap-1.5">
        <div className="max-w-[85%] rounded-3xl rounded-br-lg bg-field px-4 py-2.5 text-[15px] leading-7 whitespace-pre-wrap text-ink md:max-w-[75%]">
          {message.content}
        </div>
        <div className="flex items-center gap-2 pr-1 text-[11px] text-ink-muted">
          <span>You</span>
          <time>{message.createdAt}</time>
          <CopyButton text={message.content} label="Copy" />
        </div>
      </article>
    );
  }

  return (
    <article className="message-in group flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[12px] text-ink-muted">
        <span
          aria-hidden="true"
          className="grid size-5 place-items-center rounded-md bg-hover text-[11px] text-ink-soft ring-1 ring-white/10"
        >
          ✦
        </span>
        <span className="font-medium text-ink-soft">AI Assistant</span>
        <span aria-hidden="true">·</span>
        <time>{message.createdAt}</time>
      </div>

      <MarkdownContent content={message.content} />

      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
        <CopyButton text={message.content} label="Copy" />
      </div>
    </article>
  );
}
