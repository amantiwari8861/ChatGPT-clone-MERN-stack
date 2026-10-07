export default function ChatLoading() {
  return (
    <div
      className="flex min-h-0 flex-1 items-center justify-center"
      role="status"
      aria-label="Loading conversation"
    >
      <span className="size-6 animate-spin rounded-full border-2 border-line border-t-ink-muted" />
    </div>
  );
}
