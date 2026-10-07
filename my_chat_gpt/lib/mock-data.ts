import type { ChatMessage, ChatProject, ChatThread } from "@/types/chat";
import { createId } from "@/lib/utils";

export const currentUser = {
  name: "Aman Tiwari",
  initials: "AT",
  plan: "Go",
};

export const projects: ChatProject[] = [
  { id: "mern-course", name: "MERN Course" },
  { id: "backend-notes", name: "Backend Notes" },
  { id: "interview-prep", name: "Interview Prep" },
];

function msg(role: ChatMessage["role"], content: string, createdAt: string): ChatMessage {
  return { id: createId(role), role, content, createdAt };
}

const jwtCode = `// SecurityConfig.java
http.csrf(csrf -> csrf.disable())
  .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
  .authorizeHttpRequests(auth -> auth
      .requestMatchers("/api/auth/**").permitAll()
      .anyRequest().authenticated())
  .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);`;

const refreshCode = `POST /api/auth/refresh
Cookie: refreshToken=<httpOnly>

200 OK
{ "accessToken": "eyJhbGciOi..." }`;

const ragCode = `# split + embed + store
python ingest.py \\
  --chunk-size 512 \\
  --overlap 64 \\
  --store qdrant`;

export const initialChats: ChatThread[] = [
  {
    id: "jwt-auth-spring-boot",
    title: "JWT auth in Spring Boot",
    projectId: null,
    pinned: true,
    updatedAt: "Today",
    messages: [
      msg(
        "user",
        "How do I implement JWT authentication in Spring Boot?",
        "10:24 AM",
      ),
      msg(
        "assistant",
        `You can implement JWT authentication using a stateless filter chain. The flow is:

1. **Issue** a signed access token on successful login.
2. **Validate** the token on every request with a servlet filter.
3. **Reject** requests with a missing or expired token.

\`\`\`java
${jwtCode}
\`\`\`

Keep access tokens short lived (10–15 min) and rotate refresh tokens through an httpOnly cookie.`,
        "10:24 AM",
      ),
      msg("user", "And how should refresh tokens be stored?", "10:26 AM"),
      msg(
        "assistant",
        `Store them client side only, never in localStorage:

\`\`\`http
${refreshCode}
\`\`\`

Return the new access token in the response body and rewrite the refresh cookie on every refresh.`,
        "10:26 AM",
      ),
    ],
  },
  {
    id: "spring-ai-rag-plan",
    title: "Spring AI RAG next topic",
    projectId: null,
    pinned: true,
    updatedAt: "Today",
    messages: [
      msg("user", "Plan the next class topic for Spring AI RAG.", "9:10 AM"),
      msg(
        "assistant",
        `Suggested order for the next session:

- **Chunking strategies** — fixed, semantic, recursive.
- **Embeddings** — comparing models for code vs prose.
- **Vector stores** — pgvector vs Qdrant vs Redis.
- **Retrieval quality** — recall, reranking, metadata filters.

\`\`\`bash
${ragCode}
\`\`\`

Start with a small end-to-end notebook, then go deep on chunking — that is where most quality gains come from.`,
        "9:11 AM",
      ),
    ],
  },
  {
    id: "redis-vs-kafka",
    title: "Redis vs Kafka for queues",
    projectId: null,
    pinned: true,
    updatedAt: "Yesterday",
    messages: [
      msg(
        "user",
        "Compare Redis streams and Kafka for a MERN backend.",
        "6:42 PM",
      ),
      msg(
        "assistant",
        `**Redis Streams** — best for lightweight, low latency work: job queues, chat fan-out, rate limit counters. One command to consume, but limited replay and retention.

**Kafka** — best for durable event pipelines: order history, analytics, microservice integration. Consumer groups, replay, and long retention come at the cost of operational overhead.

Rule of thumb: start with Redis streams until you need replay or multiple independent consumer groups.`,
        "6:43 PM",
      ),
    ],
  },
  {
    id: "mern-auth-flow",
    title: "MERN auth flow with refresh rotation",
    projectId: "mern-course",
    pinned: false,
    updatedAt: "Today",
    messages: [
      msg("user", "Create a login flow with JWT and refresh tokens.", "8:05 PM"),
      msg(
        "assistant",
        `Keep access tokens in memory only and put the refresh token in an httpOnly, sameSite cookie. Rotate the refresh token on every use and reuse-detect by keeping a token family id server side.`,
        "8:06 PM",
      ),
    ],
  },
  {
    id: "socket-notifications",
    title: "Realtime notifications with Socket.IO",
    projectId: "mern-course",
    pinned: false,
    updatedAt: "Mon",
    messages: [
      msg("user", "How do I scope socket rooms per user?", "4:12 PM"),
      msg(
        "assistant",
        `Join each socket to a private room named after the user id right after authentication, then emit with \`io.to(userId).emit(...)\`. Never trust a client supplied room name.`,
        "4:13 PM",
      ),
    ],
  },
  {
    id: "mongodb-schema-design",
    title: "Embed vs reference in MongoDB",
    projectId: "backend-notes",
    pinned: false,
    updatedAt: "Tue",
    messages: [
      msg(
        "user",
        "When should I embed documents instead of referencing them?",
        "11:30 AM",
      ),
      msg(
        "assistant",
        `Embed data that is read together and bounded in size. Reference data that grows without limit, is updated independently, or is shared across many parents. A 4MB document limit is the hard ceiling — design well under it.`,
        "11:31 AM",
      ),
    ],
  },
  {
    id: "node-file-upload",
    title: "Secure file uploads in Express",
    projectId: "backend-notes",
    pinned: false,
    updatedAt: "Sat",
    messages: [
      msg("user", "Add upload support to Express using Multer.", "3:20 PM"),
      msg(
        "assistant",
        `Validate the MIME type and size before writing to disk, generate your own filenames, and store uploads outside the public directory so nothing is served as executable.\n\n\`\`\`js\nconst upload = multer({\n  storage: multer.diskStorage({ destination: "uploads/" }),\n  limits: { fileSize: 5 * 1024 * 1024 },\n  fileFilter: (req, file, cb) =>\n    cb(null, ALLOWED.includes(file.mimetype)),\n});\n\`\`\``,
        "3:22 PM",
      ),
    ],
  },
  {
    id: "system-design-notes",
    title: "URL shortener system design",
    projectId: "interview-prep",
    pinned: false,
    updatedAt: "Fri",
    messages: [
      msg("user", "Give me a quick design for a URL shortener.", "7:02 PM"),
      msg(
        "assistant",
        `Core pieces: a base62 key generator, a write-through cache, and a redirect lookup that reads from a KV store. Discuss key length, collision handling, read/write ratio (~100:1), and 301 vs 302 redirects.`,
        "7:03 PM",
      ),
    ],
  },
  {
    id: "dsa-revision-plan",
    title: "DSA 30 day revision plan",
    projectId: "interview-prep",
    pinned: false,
    updatedAt: "Thu",
    messages: [
      msg("user", "Plan a 30 day DSA revision sprint.", "9:45 PM"),
      msg(
        "assistant",
        `Split it into 4 weeks: arrays & hashing, graphs & BFS/DFS, DP fundamentals, then mocks. Two problems a day, one easy/one medium, plus a weekly review of everything you solved before.`,
        "9:46 PM",
      ),
    ],
  },
  {
    id: "docker-node-apis",
    title: "Dockerizing Node APIs",
    projectId: null,
    pinned: false,
    updatedAt: "Wed",
    messages: [
      msg("user", "Write a production Dockerfile for a Node API.", "1:15 PM"),
      msg(
        "assistant",
        `Use a multi-stage build so dev dependencies never reach the runtime image:

\`\`\`dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]
\`\`\`

Run as a non-root user and add a healthcheck.`,
        "1:17 PM",
      ),
    ],
  },
  {
    id: "postgres-vs-mongodb",
    title: "Postgres vs MongoDB for SaaS",
    projectId: null,
    pinned: false,
    updatedAt: "Mon",
    messages: [
      msg("user", "Which one for a multi-tenant SaaS?", "5:30 PM"),
      msg(
        "assistant",
        `Postgres if your data is relational and you want transactions, JSONB when documents fit naturally. MongoDB only if the schema varies wildly per tenant and you have scaled the team to run it.`,
        "5:31 PM",
      ),
    ],
  },
  {
    id: "regex-cheatsheet",
    title: "Regex cheatsheet",
    projectId: null,
    pinned: false,
    updatedAt: "Sun",
    messages: [
      msg("user", "Give me a compact regex cheatsheet.", "10:02 AM"),
      msg(
        "assistant",
        `\`\`\`\n^ start   $ end   \\b word boundary\n\\d digit  \\w word  \\s whitespace\n+ 1+      * 0+     ? optional\n(a|b) group / alternation\n[a-z0-9] character class\n(?:...) non capturing group\n\`\`\``,
        "10:02 AM",
      ),
    ],
  },
];
