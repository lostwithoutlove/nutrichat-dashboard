"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  MessageCircle,
  UtensilsCrossed,
  Activity,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/lib/auth";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/utils/cn";

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageCircle },
  { href: "/food", label: "Food", icon: UtensilsCrossed },
  { href: "/track", label: "Track", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const userInitial = user?.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5 text-sky-900" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r border-sky-100 bg-white transition-transform lg:static lg:translate-x-0",
          "w-[280px] xl:w-[280px] lg:w-[72px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sky-100 px-5">
          <h1 className="text-lg font-bold text-sky-900 lg:hidden xl:block">
            <span className="text-emerald-500">Nutri</span>Chat
          </h1>
          <div className="hidden lg:flex xl:hidden items-center justify-center w-full">
            <span className="text-lg font-bold text-emerald-500">N</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-md p-1 hover:bg-sky-50 lg:hidden"
          >
            <X className="h-5 w-5 text-sky-600" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setMobileOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  "lg:justify-center xl:justify-start",
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-sky-600 hover:bg-sky-50 hover:text-sky-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    active ? "text-emerald-500" : "text-sky-400"
                  )}
                />
                <span className="lg:hidden xl:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Profile + sign out */}
        <div className="border-t border-sky-100 p-3 space-y-1">
          <button
            onClick={() => {
              router.push("/profile");
              setMobileOpen(false);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              "lg:justify-center xl:justify-start",
              isActive("/profile")
                ? "bg-emerald-50 text-emerald-700"
                : "text-sky-600 hover:bg-sky-50 hover:text-sky-900"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
              {userInitial}
            </div>
            <div className="min-w-0 text-left lg:hidden xl:block">
              <p className="truncate text-sm font-medium text-sky-900">
                {user?.email ?? "Profile"}
              </p>
            </div>
          </button>

          <button
            onClick={handleSignOut}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sky-600 transition hover:bg-red-50 hover:text-red-600",
              "lg:justify-center xl:justify-start"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="lg:hidden xl:inline">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
