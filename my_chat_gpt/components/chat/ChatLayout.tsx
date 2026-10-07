"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { ChatThread } from "@/types/chat";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatProvider } from "@/components/chat/ChatProvider";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { cn } from "@/lib/utils";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ChatLayoutProps = {
  initialChats: ChatThread[];
  children: React.ReactNode;
};

export function ChatLayout({ initialChats, children }: ChatLayoutProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const asideRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setDrawerOpen(false);
  }

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!drawerOpen || isDesktop) return;

    const container = asideRef.current;
    container?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDrawer();
        return;
      }
      if (event.key !== "Tab" || !container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen, isDesktop, closeDrawer]);

  const toggleCollapse = useCallback(() => setCollapsed((value) => !value), []);
  const modalDrawer = !isDesktop && drawerOpen;

  return (
    <ChatProvider initial={initialChats}>
      <div className="flex h-dvh w-full overflow-hidden bg-app text-ink">
        <div
          aria-hidden="true"
          onClick={closeDrawer}
          className={cn(
            "fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 md:hidden",
            drawerOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />

        <aside
          ref={asideRef}
          tabIndex={-1}
          inert={!isDesktop && !drawerOpen}
          aria-label="Chat navigation"
          role={modalDrawer ? "dialog" : undefined}
          aria-modal={modalDrawer || undefined}
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[300px] shrink-0 overflow-hidden border-r border-line bg-panel",
            "transition-[transform,width] duration-200 ease-out",
            "focus:outline-none md:static md:z-auto md:translate-x-0 md:transition-[width] md:duration-200",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
            collapsed ? "md:w-0 md:border-r-0" : "md:w-[300px] lg:w-[340px]",
          )}
        >
          <div className="h-full w-[300px] lg:w-[340px]">
            <ChatSidebar
              onNavigate={closeDrawer}
              onToggleCollapse={toggleCollapse}
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-app">
          <ChatHeader
            collapsed={collapsed}
            menuButtonRef={menuButtonRef}
            onOpenMenu={() => setDrawerOpen(true)}
            onToggleCollapse={toggleCollapse}
          />
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
        </div>
      </div>
    </ChatProvider>
  );
}
