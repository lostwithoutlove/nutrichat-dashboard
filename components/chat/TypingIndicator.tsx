"use client";

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-300 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-300 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-sky-300 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
