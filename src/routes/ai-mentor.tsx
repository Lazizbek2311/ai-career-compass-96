import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowUp,
  Briefcase,
  Check,
  Code2,
  Copy,
  DollarSign,
  GraduationCap,
  MessageCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Square,
  Trash2,
  User,
  BookOpen,
  FileText,
  Mic,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/ai-mentor")({
  component: AiMentorPage,
});

type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

const STORAGE_KEY = "careerai.mentor.conversations.v1";
const ACTIVE_KEY = "careerai.mentor.active.v1";

const SUGGESTED = [
  { icon: Sparkles, key: "career" },
  { icon: BookOpen, key: "learning" },
  { icon: Mic, key: "interview" },
  { icon: FileText, key: "resume" },
  { icon: DollarSign, key: "salary" },
  { icon: GraduationCap, key: "university" },
  { icon: Briefcase, key: "jobs" },
  { icon: Code2, key: "code" },
] as const;

function newConversation(): Conversation {
  return {
    id: crypto.randomUUID(),
    title: "New chat",
    updatedAt: Date.now(),
    messages: [],
  };
}

function loadConversations(): { list: Conversation[]; activeId: string } {
  if (typeof window === "undefined") {
    const c = newConversation();
    return { list: [c], activeId: c.id };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const activeId = window.localStorage.getItem(ACTIVE_KEY) ?? "";
    const list = raw ? (JSON.parse(raw) as Conversation[]) : [];
    if (list.length === 0) {
      const c = newConversation();
      return { list: [c], activeId: c.id };
    }
    return { list, activeId: list.some((c) => c.id === activeId) ? activeId : list[0].id };
  } catch {
    const c = newConversation();
    return { list: [c], activeId: c.id };
  }
}

function messageText(m: UIMessage) {
  return m.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}

function AiMentorPage() {
  const { t } = useI18n();
  const [{ list, activeId }, setState] = useState(loadConversations);
  const active = list.find((c) => c.id === activeId) ?? list[0];

  // persist
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      window.localStorage.setItem(ACTIVE_KEY, activeId);
    } catch {
      /* ignore */
    }
  }, [list, activeId]);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/mentor-chat" }), []);

  const { messages, sendMessage, status, stop, regenerate, setMessages, error } = useChat({
    id: active.id,
    messages: active.messages,
    transport,
    onError: (e) => toast.error(e.message || t("mentor.chatError")),
  });

  // sync streamed messages back into conversation store
  useEffect(() => {
    setState((s) => ({
      ...s,
      list: s.list.map((c) =>
        c.id === active.id
          ? {
              ...c,
              messages,
              updatedAt: Date.now(),
              title:
                c.title === "New chat" && messages[0]
                  ? messageText(messages[0]).slice(0, 48) || "New chat"
                  : c.title,
            }
          : c,
      ),
    }));
  }, [messages, active.id]);

  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [active.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const isLoading = status === "submitted" || status === "streaming";

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    setInput("");
    await sendMessage({ text: value });
  };

  const startNew = () => {
    const c = newConversation();
    setState((s) => ({ list: [c, ...s.list], activeId: c.id }));
  };

  const selectConv = (id: string) => setState((s) => ({ ...s, activeId: id }));

  const deleteConv = (id: string) => {
    setState((s) => {
      const next = s.list.filter((c) => c.id !== id);
      if (next.length === 0) {
        const c = newConversation();
        return { list: [c], activeId: c.id };
      }
      return { list: next, activeId: s.activeId === id ? next[0].id : s.activeId };
    });
  };

  const clearActive = () => {
    setMessages([]);
    setState((s) => ({
      ...s,
      list: s.list.map((c) => (c.id === active.id ? { ...c, messages: [], title: "New chat" } : c)),
    }));
  };

  return (
    <DashboardLayout>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr] h-[calc(100vh-7rem)]">
        {/* Conversations */}
        <aside className="hidden lg:flex flex-col glass rounded-2xl border border-border/60 p-3 overflow-hidden">
          <Button
            onClick={startNew}
            className="rounded-xl gradient-brand text-white border-0 hover:opacity-90 gap-2"
          >
            <Plus className="h-4 w-4" /> New chat
          </Button>
          <div className="mt-3 text-xs font-semibold text-muted-foreground px-1">History</div>
          <div className="mt-1 flex-1 overflow-y-auto space-y-1 pr-1">
            {list
              .slice()
              .sort((a, b) => b.updatedAt - a.updatedAt)
              .map((c) => {
                const isActive = c.id === active.id;
                return (
                  <div
                    key={c.id}
                    className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer transition-all ${
                      isActive
                        ? "gradient-brand text-white shadow-elegant"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => selectConv(c.id)}
                  >
                    <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate flex-1">{c.title || "New chat"}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConv(c.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 transition rounded-md p-1 ${
                        isActive ? "hover:bg-white/20" : "hover:bg-foreground/10"
                      }`}
                      aria-label="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
          </div>
        </aside>

        {/* Chat panel */}
        <section className="flex flex-col glass rounded-2xl border border-border/60 overflow-hidden">
          <header className="flex items-center justify-between px-4 sm:px-6 h-14 border-b border-border/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-8 w-8 place-items-center rounded-xl gradient-brand shadow-glow shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">AI Mentor</div>
                <div className="text-[11px] text-muted-foreground truncate">
                  Your personal career & learning coach
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="rounded-full gap-1.5" onClick={clearActive}>
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline text-xs">Clear</span>
              </Button>
              <Button
                size="sm"
                className="rounded-full gradient-brand text-white border-0 hover:opacity-90 gap-1.5 lg:hidden"
                onClick={startNew}
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="text-xs">New</span>
              </Button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-6">
            {messages.length === 0 ? (
              <EmptyState onPick={(t) => send(t)} />
            ) : (
              <div className="mx-auto max-w-3xl space-y-6">
                <AnimatePresence initial={false}>
                  {messages.map((m, idx) => (
                    <MessageBubble
                      key={m.id}
                      message={m}
                      isLast={idx === messages.length - 1}
                      isStreaming={isLoading && idx === messages.length - 1 && m.role === "assistant"}
                      onRegenerate={() => regenerate()}
                    />
                  ))}
                </AnimatePresence>
                {status === "submitted" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="grid h-8 w-8 place-items-center rounded-xl gradient-brand">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <TypingDots />
                  </div>
                )}
                {error && (
                  <div className="text-sm text-destructive">{error.message}</div>
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border/60 p-3 sm:p-4"
          >
            <div className="mx-auto max-w-3xl">
              <div className="relative rounded-2xl border border-border/60 bg-secondary/40 focus-within:border-primary/60 transition-colors shadow-elegant">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask anything about your career, learning, interviews…"
                  rows={1}
                  className="w-full bg-transparent resize-none px-4 py-3.5 pr-14 text-sm outline-none placeholder:text-muted-foreground max-h-40"
                  style={{ minHeight: 52 }}
                />
                <div className="absolute right-2 bottom-2">
                  {isLoading ? (
                    <Button
                      type="button"
                      size="icon"
                      onClick={() => stop()}
                      className="rounded-xl h-9 w-9 bg-foreground text-background hover:bg-foreground/90"
                      aria-label="Stop"
                    >
                      <Square className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!input.trim()}
                      className="rounded-xl h-9 w-9 gradient-brand text-white border-0 hover:opacity-90 disabled:opacity-40"
                      aria-label="Send"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground text-center mt-2">
                AI Mentor can make mistakes. Verify important info.
              </p>
            </div>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}

function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-4"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-brand shadow-glow mb-4">
          <Sparkles className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">How can I help you today?</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Ask anything about careers, learning, interviews, salaries, universities, jobs, or code.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-3">
        {SUGGESTED.map((s, i) => (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            type="button"
            onClick={() => onPick(s.label)}
            className="group glass rounded-2xl border border-border/60 px-4 py-3.5 text-left hover:shadow-elegant hover:border-primary/40 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary/70 text-primary group-hover:gradient-brand group-hover:text-white transition-all">
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {s.group}
                </div>
                <div className="text-sm font-medium mt-0.5">{s.label}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  isLast,
  isStreaming,
  onRegenerate,
}: {
  message: UIMessage;
  isLast: boolean;
  isStreaming: boolean;
  onRegenerate: () => void;
}) {
  const isUser = message.role === "user";
  const text = messageText(message);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl gradient-brand shadow-glow">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
      )}
      <div className={`min-w-0 max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "gradient-brand text-white shadow-elegant"
              : "bg-secondary/60 border border-border/60 text-foreground"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{text}</div>
          ) : (
            <Markdown>{text}</Markdown>
          )}
          {isStreaming && !isUser && (
            <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-primary animate-pulse rounded-sm" />
          )}
        </div>
        {!isUser && !isStreaming && text && (
          <div className="flex items-center gap-1 mt-1.5 px-1">
            <button
              type="button"
              onClick={copy}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-accent transition"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {isLast && (
              <button
                type="button"
                onClick={onRegenerate}
                className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:bg-accent transition"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate
              </button>
            )}
          </div>
        )}
      </div>
      {isUser && (
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-secondary border border-border/60">
          <User className="h-4 w-4" />
        </div>
      )}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-primary"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:my-2 prose-pre:bg-background/60 prose-pre:border prose-pre:border-border/60 prose-pre:rounded-xl prose-code:before:content-none prose-code:after:content-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-foreground/10 text-foreground text-[0.85em] font-mono"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match[1]}>{String(children).replace(/\n$/, "")}</CodeBlock>;
          },
          a({ children, ...props }) {
            return (
              <a {...props} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-2">
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="relative group not-prose my-2">
      <div className="flex items-center justify-between px-3 py-1.5 bg-foreground/5 border border-b-0 border-border/60 rounded-t-xl text-[11px] text-muted-foreground font-mono">
        <span>{language}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 hover:text-foreground transition"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="m-0 p-3 overflow-x-auto bg-background/60 border border-border/60 rounded-b-xl text-xs leading-relaxed">
        <code className={`language-${language} font-mono`}>{children}</code>
      </pre>
    </div>
  );
}
