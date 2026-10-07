import { cn } from "@/lib/utils";

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: "sm" | "md";
  ref?: React.Ref<HTMLButtonElement>;
};

export function IconButton({
  label,
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg text-ink-soft",
        "transition-colors duration-150 hover:bg-hover hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30",
        size === "sm" ? "size-7" : "size-9",
        className,
      )}
      {...props}
    />
  );
}
