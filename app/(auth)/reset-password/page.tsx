"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/lib/auth";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-sky-900">Check your email</h2>
        <p className="mt-2 text-sm text-sky-600">
          We sent a password reset link to <strong>{email}</strong>.
        </p>
        <Link href="/login" className="mt-6 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow-lg">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-sky-900">
          <span className="text-emerald-500">Nutri</span>Chat
        </h1>
        <p className="mt-2 text-sm text-sky-600">Reset your password</p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-sky-900">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-md border border-sky-100 bg-sky-50 px-3 py-2.5 text-sm text-sky-900 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            placeholder="you@example.com" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-sky-600">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">Sign in</Link>
      </p>
    </div>
  );
}
