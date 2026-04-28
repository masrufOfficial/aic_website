"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  FolderKanban,
  GalleryVerticalEnd,
  LibraryBig,
  Menu,
  ShieldCheck,
  Users2,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageTransition } from "@/components/ui/page-transition";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/content", label: "Content Management", icon: FileText },
  { href: "/admin/events", label: "Events", icon: FolderKanban },
  { href: "/admin/research", label: "Research", icon: LibraryBig },
  { href: "/admin/gallery", label: "Gallery", icon: GalleryVerticalEnd },
  { href: "/admin/members", label: "Members", icon: Users2 },
  { href: "/admin/committee", label: "Committee", icon: ShieldCheck },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navigation = (
    <Card className="h-fit p-4">
      <div className="p-4 bg-slate-900 text-white rounded-xl">
        <p className="text-xs uppercase">Admin Control</p>
        <h2 className="text-lg font-bold mt-1">BUBT AI CMS</h2>
      </div>

      <nav className="mt-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                active
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </Card>
  );

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden xl:block w-[260px] p-4 shrink-0">
        {navigation}
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
}
