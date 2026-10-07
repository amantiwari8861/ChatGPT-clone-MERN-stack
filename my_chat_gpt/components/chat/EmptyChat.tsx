"use client";

import { ChatComposer } from "@/components/chat/ChatComposer";

type EmptyChatProps = {
  onSend: (content: string) => void;
};

export function EmptyChat({ onSend }: EmptyChatProps) {
  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto">
      <div className="m-auto w-full max-w-[816px] px-4 py-10 md:px-6">
        <div className="mb-7 text-center md:mb-9">
          <h2 className="text-[22px] font-medium tracking-tight text-ink md:text-[28px]">
            What&apos;s on your mind today?
          </h2>
        </div>
        <ChatComposer onSend={onSend} />
      </div>
    </div>
  );
}
