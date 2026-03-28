"use client";

import { cn } from "@/utils/cn";

interface ChatBubbleProps {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

function parseContent(content: string): string {
  if (!content) return "";
  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === "object" && parsed.text) return parsed.text;
    if (typeof parsed === "string") return parsed;
    return content;
  } catch {
    return content;
  }
}

export default function ChatBubble({ content, role, timestamp }: ChatBubbleProps) {
  const isUser = role === "user";
  const text = parseContent(content);

  const time = new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
          isUser
            ? "rounded-br-md bg-emerald-500 text-white"
            : "rounded-bl-md bg-white text-sky-900"
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{text}</p>
        <p
          className={cn(
            "mt-1 text-right text-[10px]",
            isUser ? "text-emerald-100" : "text-sky-400"
          )}
        >
          {time}
        </p>
      </div>
    </div>
  );
}
