"use client";

import { PanelLeft, Plus, Search, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

type SidebarHeaderProps = {
  searchOpen: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onSearchOpenChange: (open: boolean) => void;
  onNewChat: () => void;
  onToggleCollapse: () => void;
};

export function SidebarHeader({
  searchOpen,
  query,
  onQueryChange,
  onSearchOpenChange,
  onNewChat,
  onToggleCollapse,
}: SidebarHeaderProps) {
  return (
    <div className="shrink-0 px-2.5 pt-2.5 pb-1">
      <div className="flex items-center justify-between gap-2 px-1 pb-2">
        <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          <span
            aria-hidden="true"
            className="grid size-6 place-items-center rounded-md bg-hover text-[13px]"
          >
            ✦
          </span>
          My AI
        </span>
        <IconButton
          label="Collapse sidebar"
          size="sm"
          onClick={onToggleCollapse}
          className="hidden md:inline-flex"
        >
          <PanelLeft className="size-4" aria-hidden="true" />
        </IconButton>
      </div>

      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          onClick={onNewChat}
          className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[14px] text-ink-soft transition-colors duration-150 hover:bg-hover hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
        >
          <Plus className="size-4 shrink-0" aria-hidden="true" />
          New chat
        </button>

        {searchOpen ? (
          <div className="flex h-9 items-center gap-2 rounded-lg bg-hover px-2.5 ring-1 ring-white/10 focus-within:ring-white/25">
            <Search className="size-4 shrink-0 text-ink-muted" aria-hidden="true" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  onQueryChange("");
                  onSearchOpenChange(false);
                }
              }}
              placeholder="Search chats"
              aria-label="Search chats"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-muted"
            />
            <button
              type="button"
              aria-label="Close search"
              onClick={() => {
                onQueryChange("");
                onSearchOpenChange(false);
              }}
              className="shrink-0 rounded p-0.5 text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSearchOpenChange(true)}
            className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[14px] text-ink-soft transition-colors duration-150 hover:bg-hover hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
          >
            <Search className="size-4 shrink-0" aria-hidden="true" />
            Search
          </button>
        )}
      </div>
    </div>
  );
}
