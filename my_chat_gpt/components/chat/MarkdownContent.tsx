import { Fragment } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "code"; lang: string; code: string };

const CODE_FENCE = /```(\w*)\n?([\s\S]*?)```/g;

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  CODE_FENCE.lastIndex = 0;

  while ((match = CODE_FENCE.exec(content)) !== null) {
    pushTextBlocks(blocks, content.slice(cursor, match.index));
    blocks.push({ type: "code", lang: match[1] || "code", code: match[2].replace(/\n$/, "") });
    cursor = match.index + match[0].length;
  }
  pushTextBlocks(blocks, content.slice(cursor));

  return blocks;
}

function pushTextBlocks(blocks: Block[], chunk: string): void {
  const trimmed = chunk.trim();
  if (!trimmed) return;

  for (const segment of trimmed.split(/\n{2,}/)) {
    const lines = segment.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length === 0) continue;

    const heading = /^#{1,4}\s+(.*)$/.exec(lines[0]);
    if (heading && lines.length === 1) {
      blocks.push({ type: "heading", text: heading[1] });
      continue;
    }

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      blocks.push({
        type: "list",
        ordered: false,
        items: lines.map((line) => line.replace(/^[-*]\s+/, "")),
      });
      continue;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      blocks.push({
        type: "list",
        ordered: true,
        items: lines.map((line) => line.replace(/^\d+\.\s+/, "")),
      });
      continue;
    }

    blocks.push({ type: "paragraph", text: segment });
  }
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*\n]+\*)/g);

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.85em] text-[#e4e4e7]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={cn("text-[15px] leading-7 text-ink", className)}>
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        if (block.type === "code") {
          return (
            <div
              key={key}
              className="my-4 overflow-hidden rounded-xl border border-line bg-[#0f0f0f]"
            >
              <div className="flex items-center justify-between border-b border-line px-3 py-1.5">
                <span className="text-[11px] tracking-wide text-ink-muted uppercase">
                  {block.lang}
                </span>
                <CopyButton text={block.code} label="Copy" />
              </div>
              <pre className="thin-scrollbar overflow-x-auto px-4 py-3.5 text-[13px] leading-6 text-[#d4d4d8]">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        if (block.type === "heading") {
          return (
            <h3 key={key} className="mt-5 mb-2 text-[17px] font-semibold text-ink first:mt-0">
              {renderInline(block.text, key)}
            </h3>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag
              key={key}
              className={cn(
                "my-3 space-y-1.5 pl-5",
                block.ordered ? "list-decimal" : "list-disc",
                "[&::marker]:text-ink-muted",
              )}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item, `${key}-${itemIndex}`)}</li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={key} className="my-3 whitespace-pre-line first:mt-0 last:mb-0">
            {renderInline(block.text, key)}
          </p>
        );
      })}
    </div>
  );
}
