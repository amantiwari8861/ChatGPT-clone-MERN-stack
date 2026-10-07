"use client";

import { LogOut, Settings, Keyboard } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { currentUser } from "@/lib/mock-data";

export function UserProfile() {
  return (
    <div className="flex shrink-0 items-center gap-1 border-t border-line px-2 py-2">
      <button
        type="button"
        className="group flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
      >
        <Avatar initials={currentUser.initials} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-ink">
            {currentUser.name}
          </span>
          <span className="block truncate text-[12px] text-ink-muted">
            {currentUser.plan} plan
          </span>
        </span>
      </button>

      <DropdownMenu
        label="Account options"
        triggerIcon={Settings}
        items={[
          { id: "settings", label: "Settings", icon: Settings, onSelect: () => {} },
          { id: "shortcuts", label: "Keyboard shortcuts", icon: Keyboard, onSelect: () => {} },
          { id: "logout", label: "Log out", icon: LogOut, onSelect: () => {} },
        ]}
      />
    </div>
  );
}
