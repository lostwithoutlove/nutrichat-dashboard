"use client";

import { useRouter, usePathname } from "next/navigation";
import { MessageCircle, Plus } from "lucide-react";
import { useGetConversationsQuery } from "@/generated/graphql";
import { cn } from "@/utils/cn";

export default function ConversationList() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, loading, error } = useGetConversationsQuery({
    variables: { limit: 50, offset: 0 },
    fetchPolicy: "network-only",
  });

  if (error) {
    console.error("ConversationList error:", error);
  }

  const conversations = data?.conversations?.nodes ?? [];
  const activeId = pathname.split("/chat/")[1];

  const startNewChat = () => {
    router.push("/chat");
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    }
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-sky-100 px-4">
        <h2 className="text-base font-bold text-sky-900">Chats</h2>
        <button
          onClick={startNewChat}
          className="rounded-md p-2 text-sky-600 transition hover:bg-emerald-50 hover:text-emerald-600"
          title="New chat"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && conversations.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <MessageCircle className="mb-3 h-10 w-10 text-sky-200" />
            <p className="text-sm text-sky-600">No conversations yet</p>
            <p className="mt-1 text-xs text-sky-400">
              Start chatting with NutriChat
            </p>
          </div>
        ) : (
          conversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => router.push(`/chat/${convo.id}`)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-sky-50 px-4 py-3 text-left transition",
                activeId === convo.id
                  ? "bg-emerald-50"
                  : "hover:bg-sky-50"
              )}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <MessageCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-sky-900">
                    {convo.title || "New conversation"}
                  </p>
                  <span className="ml-2 shrink-0 text-xs text-sky-400">
                    {formatTime(convo.updatedAt || convo.createdAt)}
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
