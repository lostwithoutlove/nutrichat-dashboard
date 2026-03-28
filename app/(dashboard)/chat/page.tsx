"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import ChatInput from "@/components/chat/ChatInput";
import ChatBubble from "@/components/chat/ChatBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import {
  useChatMutation,
  useGetConversationsLazyQuery,
  useGetConversationLazyQuery,
} from "@/generated/graphql";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
  conversationId: string;
}

function parseContent(content: unknown): string {
  if (!content) return "";
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && parsed.text) return parsed.text;
      if (typeof parsed === "string") return parsed;
      return content;
    } catch {
      return content;
    }
  }
  if (typeof content === "object" && (content as Record<string, unknown>).text) {
    return String((content as Record<string, unknown>).text);
  }
  return String(content);
}

const INITIAL_CONVOS = 5;

const quickActions = [
  "I had poha and chai for breakfast",
  "What did I eat yesterday?",
  "Log my weight as 65 kg",
  "Show me my nutrition trends",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatMutation] = useChatMutation();
  const [fetchConversations] = useGetConversationsLazyQuery({ fetchPolicy: "network-only" });
  const [fetchConversation] = useGetConversationLazyQuery({ fetchPolicy: "network-only" });

  // Load chat history on mount — last N conversations merged into one feed
  useEffect(() => {
    loadInitialMessages();
  }, []);

  const loadInitialMessages = async () => {
    setInitialLoading(true);
    try {
      const { data } = await fetchConversations({
        variables: { limit: 50, offset: 0 },
      });

      const convos = data?.conversations?.nodes ?? [];
      if (convos.length === 0) {
        setInitialLoading(false);
        return;
      }

      // Most recent conversation is active for new messages
      setConversationId(convos[0].id);

      // Load last N conversations in parallel
      const convosToLoad = convos.slice(0, INITIAL_CONVOS);
      const results = await Promise.allSettled(
        convosToLoad.map((c) =>
          fetchConversation({ variables: { id: c.id, messagesLimit: 50 } })
        )
      );

      const allMsgs: Message[] = [];
      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const msgs = result.value.data?.conversation?.messages ?? [];
        for (const m of msgs) {
          allMsgs.push({
            id: String(m.id),
            content: parseContent(m.content),
            role: m.role as "user" | "assistant",
            createdAt: m.createdAt,
            conversationId: String(m.conversationId ?? ""),
          });
        }
      }

      allMsgs.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(allMsgs);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isThinking]);

  const sendMessage = useCallback(
    async (text: string, imageBase64?: string) => {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        content: text,
        role: "user",
        createdAt: new Date().toISOString(),
        conversationId: conversationId ?? "",
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      try {
        const { data } = await chatMutation({
          variables: {
            input: {
              message: text,
              ...(conversationId ? { conversationId } : {}),
              ...(imageBase64 ? { imageBase64 } : {}),
            },
          },
        });

        if (data?.chat) {
          // Update conversation ID if new
          if (data.chat.conversationId && !conversationId) {
            setConversationId(data.chat.conversationId);
          }

          const aiMsg: Message = {
            id: data.chat.assistantMessage.id,
            content: parseContent(data.chat.assistantMessage.content),
            role: "assistant",
            createdAt: data.chat.assistantMessage.createdAt,
            conversationId: data.chat.conversationId,
          };
          setMessages((prev) => [...prev, aiMsg]);
        }
      } catch (err) {
        console.error("Chat error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            content: "Sorry, something went wrong. Please try again.",
            role: "assistant",
            createdAt: new Date().toISOString(),
            conversationId: "",
          },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [chatMutation, conversationId]
  );

  const handleSendMessage = (text: string) => sendMessage(text);
  const handleSendImage = (base64: string) =>
    sendMessage("What's in this photo?", base64);
  const handleSendFile = (_base64: string, fileName: string) => {
    sendMessage(`Uploading: ${fileName}`);
  };

  // Loading state
  if (initialLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-sky-100 bg-white px-6">
          <h2 className="text-base font-bold text-sky-900">NutriChat</h2>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-sky-100 bg-white px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-sky-900">NutriChat</h2>
            <p className="text-xs text-sky-400">Your AI nutrition companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-sky-50 p-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {messages.length === 0 && !isThinking ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <MessageCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-sky-900">
                Hey! What did you eat today?
              </h3>
              <p className="mt-2 text-sm text-sky-600">
                Tell me about your meals, log your weight, or ask about your nutrition.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleSendMessage(action)}
                    className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-emerald-700 transition hover:bg-emerald-50"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                content={msg.content}
                role={msg.role}
                timestamp={msg.createdAt}
              />
            ))
          )}
          {isThinking && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendImage={handleSendImage}
        onSendFile={handleSendFile}
        disabled={isThinking}
      />
    </div>
  );
}
