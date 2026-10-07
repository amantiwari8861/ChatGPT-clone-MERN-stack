"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MenuItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  danger?: boolean;
  onSelect: () => void;
}

type DropdownMenuProps = {
  label: string;
  items: MenuItem[];
  triggerIcon: LucideIcon;
  align?: "start" | "end";
  className?: string;
};

type MenuPosition = { top: number; left: number };

export function DropdownMenu({
  label,
  items,
  triggerIcon: TriggerIcon,
  align = "end",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setPosition(null);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? 0;
    const spaceBelow = window.innerHeight - rect.bottom;
    const flip = menuHeight > 0 && menuHeight + 16 > spaceBelow && rect.top > spaceBelow;
    const next = {
      top: flip ? rect.top - 8 - menuHeight : rect.bottom + 8,
      left: align === "end" ? rect.right : rect.left,
    };

    setPosition((current) =>
      current && current.top === next.top && current.left === next.left ? current : next,
    );
  }, [open, align, position]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return;
      }
      close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };
    const onViewportChange = () => close();

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [open, close]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(
        () => menuRef.current?.querySelector<HTMLButtonElement>("[role='menuitem']")?.focus(),
        0,
      );
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']") ?? [],
    );
    const index = menuItems.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next = menuItems[(index + delta + menuItems.length) % menuItems.length];
      next?.focus();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-7 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-hover hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
      >
        <TriggerIcon className="size-4" aria-hidden="true" />
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              transform: align === "end" ? "translateX(-100%)" : "none",
            }}
            className="z-[60] w-44 overflow-hidden rounded-xl border border-line bg-panel p-1 shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
          >
            {items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    item.onSelect();
                    close();
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
                    item.danger
                      ? "text-[#f87171] hover:bg-[#f87171]/10"
                      : "text-ink-soft hover:bg-hover hover:text-ink",
                  )}
                >
                  {ItemIcon && <ItemIcon className="size-4 shrink-0" aria-hidden="true" />}
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}
