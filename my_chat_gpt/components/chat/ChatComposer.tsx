"use client";

import { useId, useRef, useState } from "react";
import { ArrowUp, Mic, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_HEIGHT_PX = 168;

type ChatComposerProps = {
  onSend: (content: string) => void;
  showFade?: boolean;
  placeholder?: string;
  className?: string;
};

export function ChatComposer({
  onSend,
  showFade = false,
  placeholder = "Ask anything",
  className,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = useId();

  const resize = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT_PX)}px`;
  };

  const submit = () => {
    const content = value.trim();
    if (!content) return;
    onSend(content);
    setValue("");
    requestAnimationFrame(() => {
      resize();
      textareaRef.current?.focus();
    });
  };

  const canSend = value.trim().length > 0;

  return (
    <div className={cn("relative w-full", className)}>
      {showFade && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-app to-transparent"
        />
      )}

      <form
        aria-label="Chat composer"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="mx-auto flex w-full max-w-3xl items-end gap-1 rounded-[26px] border border-line bg-field px-2 py-2 shadow-[0_10px_36px_rgba(0,0,0,0.4)] transition-colors duration-150 focus-within:border-white/20"
      >
        <button
          type="button"
          aria-label="Attach a file"
          title="Attach a file"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white/10 hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        >
          <Plus className="size-[18px]" aria-hidden="true" />
        </button>

        <label className="sr-only" htmlFor={inputId}>
          Message
        </label>
        <textarea
          id={inputId}
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            setValue(event.target.value);
            resize();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              submit();
            }
          }}
          className="thin-scrollbar max-h-40 min-h-9 min-w-0 flex-1 resize-none bg-transparent px-1 py-1.5 text-[15px] leading-6 text-ink outline-none placeholder:text-ink-muted"
        />

        <button
          type="button"
          aria-label="Use microphone"
          title="Use microphone"
          className="grid size-9 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-white/10 hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        >
          <Mic className="size-[18px]" aria-hidden="true" />
        </button>

        <button
          type="submit"
          aria-label="Send message"
          title="Send message"
          disabled={!canSend}
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-field",
            canSend
              ? "bg-ink text-app hover:bg-white"
              : "cursor-not-allowed bg-white/10 text-ink-muted",
          )}
        >
          <ArrowUp className="size-[18px]" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
