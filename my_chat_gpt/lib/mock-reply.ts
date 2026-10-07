const replyTemplate = (prompt: string): string => `Here is a practical way to approach **${prompt}**

1. **Clarify the goal** — write down the input, the output, and the constraints before touching code.
2. **Start with the smallest working version**, then add edge cases one at a time.
3. **Verify with a real example** so you know it behaves the way you expect.

\`\`\`ts
async function solve(input: string): Promise<string> {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("empty input");
  return process(trimmed);
}
\`\`\`

A few things worth double checking:

- Error paths are handled, not just the happy path.
- Loading and empty states are visible to the user.
- Nothing sensitive is logged or shipped to the client.

If you share the exact code you have so far, I can review it line by line.`;

export function mockAssistantReply(prompt: string): string {
  const cleaned = prompt.trim().replace(/\s+/g, " ").slice(0, 80);
  return replyTemplate(cleaned || "your question");
}
