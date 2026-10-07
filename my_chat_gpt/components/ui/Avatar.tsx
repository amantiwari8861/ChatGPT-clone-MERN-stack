import { cn } from "@/lib/utils";

type AvatarProps = {
  initials: string;
  className?: string;
};

export function Avatar({ initials, className }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-full",
        "bg-gradient-to-br from-[#3b3b3b] to-[#242424] text-[11px] font-semibold tracking-wide text-ink ring-1 ring-white/10",
        className,
      )}
    >
      {initials}
    </span>
  );
}
