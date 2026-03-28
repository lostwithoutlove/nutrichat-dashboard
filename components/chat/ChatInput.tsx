"use client";

import { useState, useRef, type KeyboardEvent } from "react";
import { Send, Image, Paperclip } from "lucide-react";
import { cn } from "@/utils/cn";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendImage: (base64: string) => void;
  onSendFile: (base64: string, fileName: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  onSendImage,
  onSendFile,
  disabled,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setMessage("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      onSendImage(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      onSendFile(base64, file.name);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="border-t border-sky-100 bg-white px-4 py-3">
      <div className="flex items-end gap-2">
        {/* Image upload */}
        <button
          onClick={() => imageInputRef.current?.click()}
          disabled={disabled}
          className="shrink-0 rounded-full p-2 text-sky-400 transition hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50"
          title="Send photo"
        >
          <Image className="h-5 w-5" />
        </button>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* File upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="shrink-0 rounded-full p-2 text-sky-400 transition hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50"
          title="Upload report"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Text input */}
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleTextareaInput}
            placeholder="Type a message..."
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-xl border border-sky-100 bg-sky-50 px-4 py-2.5 text-sm text-sky-900 outline-none transition placeholder:text-sky-300 focus:border-emerald-300 focus:bg-white disabled:opacity-50"
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className={cn(
            "shrink-0 rounded-full p-2.5 transition",
            message.trim()
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-sky-100 text-sky-300"
          )}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
