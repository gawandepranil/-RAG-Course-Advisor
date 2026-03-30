"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Library, BarChart3 } from "lucide-react";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Chat", href: "/advisor", icon: MessageSquare },
  { label: "Library", href: "/advisor", icon: Library },
  { label: "Analytics", href: "/advisor", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-white/70 bg-white/60 p-4 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col items-center justify-between rounded-[2rem] border border-white/70 bg-white/60 py-6 shadow-xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4b2e83] font-black text-white">
          H
        </div>

        <nav className="flex flex-col gap-3">
          {items.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`group flex h-14 w-14 items-center justify-center rounded-2xl transition ${
                  active
                    ? "bg-[#4b2e83] text-white shadow-lg shadow-[#4b2e83]/20"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
                title={label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            UW
          </p>
        </div>
      </div>
    </aside>
  );
}