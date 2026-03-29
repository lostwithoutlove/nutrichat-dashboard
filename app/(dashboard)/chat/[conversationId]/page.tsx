"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import TypingIndicator from "@/components/chat/TypingIndicator";
import {
  useGetConversationQuery,
  useChatMutation,
  useUploadReportMutation,
  ReportType,
} from "@/generated/graphql";

interface LocalMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: string;
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

export default function ConversationPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMutation] = useChatMutation();
  const [uploadReport] = useUploadReportMutation();

  const { data, loading } = useGetConversationQuery({
    variables: {
      id: conversationId,
      messagesLimit: 100,
      messagesOffset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const serverMessages = data?.conversation?.messages ?? [];
  const title = data?.conversation?.title || "Conversation";

  // Combine server + local messages
  const allMessages = [
    ...serverMessages.map((m) => ({
      id: m.id,
      content: parseContent(m.content),
      role: m.role as "user" | "assistant",
      createdAt: m.createdAt,
    })),
    ...localMessages,
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length, isThinking]);

  // Clear local messages when server data refreshes
  useEffect(() => {
    if (serverMessages.length > 0) {
      setLocalMessages((prev) =>
        prev.filter(
          (local) =>
            !serverMessages.some(
              (server) =>
                server.content === local.content && server.role === local.role
            )
        )
      );
    }
  }, [serverMessages]);

  const sendMessage = useCallback(
    async (text: string, imageBase64?: string) => {
      const userMsg: LocalMessage = {
        id: `local-user-${Date.now()}`,
        content: text,
        role: "user",
        createdAt: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      try {
        const { data: chatData } = await chatMutation({
          variables: {
            input: {
              message: text,
              conversationId,
              ...(imageBase64 ? { imageBase64 } : {}),
            },
          },
          refetchQueries: ["GetConversation", "GetConversations"],
        });

        if (chatData?.chat) {
          const aiMsg: LocalMessage = {
            id: `local-ai-${Date.now()}`,
            content: parseContent(chatData.chat.assistantMessage.content),
            role: "assistant",
            createdAt: chatData.chat.assistantMessage.createdAt,
          };
          setLocalMessages((prev) => [
            ...prev.filter((m) => m.id !== userMsg.id),
            aiMsg,
          ]);
        }
      } catch (err) {
        console.error("Chat error:", err);
        setLocalMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            content: "Sorry, something went wrong. Please try again.",
            role: "assistant",
            createdAt: new Date().toISOString(),
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
  const handleSendFile = async (base64: string, fileName: string) => {
    setLocalMessages((prev) => [
      ...prev,
      { id: `local-upload-${Date.now()}`, content: `Uploading: ${fileName}`, role: "user", createdAt: new Date().toISOString() },
    ]);
    setIsThinking(true);
    try {
      const { data: uploadData } = await uploadReport({
        variables: {
          input: { fileBase64: base64, fileName, title: fileName, reportType: ReportType.Lab },
        },
      });
      setLocalMessages((prev) => [
        ...prev,
        {
          id: `local-upload-done-${Date.now()}`,
          content: uploadData?.uploadReport ? `Report "${uploadData.uploadReport.title}" uploaded!` : "Report uploaded.",
          role: "assistant",
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setLocalMessages((prev) => [
        ...prev,
        { id: `error-${Date.now()}`, content: "Failed to upload report.", role: "assistant", createdAt: new Date().toISOString() },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center border-b border-sky-100 bg-white px-6">
        <h2 className="text-base font-bold text-sky-900">{title}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-sky-50 p-4">
        <div className="mx-auto max-w-3xl space-y-3">
          {loading && allMessages.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            allMessages.map((msg) => (
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
