"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ImageDisplay } from "@/components/ui/ImageDisplay";
import { siteConfig } from "@/lib/constants";
import type { ContentMap } from "@/lib/content";
import { cn } from "@/lib/utils";

const primaryNavItems = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about-us" },
  { title: "Explore", href: "/explore-us" },
];

const moreNavItems = [
  { title: "Research", href: "/research" },
  { title: "Gallery", href: "/gallery" },
  { title: "Membership", href: "/membership" },
  { title: "Profile", href: "/profile" },
];

function NavLink({
  href,
  title,
  active,
}: {
  href: string;
  title: string;
  active: boolean;
}) {
  return (
    <Link
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[var(--denim-50)] hover:text-[var(--denim-700)]",
        active && "bg-[var(--denim-50)] text-[var(--denim-800)]"
      )}
      href={href}
    >
      {title}
    </Link>
  );
}

export function NavbarClient({
  content,
  isAdmin,
  isLoggedIn,
}: {
  content: ContentMap;
  isAdmin: boolean;
  isLoggedIn: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const clubName = content.club_name || siteConfig.name;
  const subtitle = "Bangladesh University of Business and Technology (BUBT)";
  const moreActive = moreNavItems.some((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
  );

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8 lg:px-16">
        <div className="flex min-w-0 items-center">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            {content.logo_url ? (
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full md:h-11 md:w-11">
                <ImageDisplay
                  alt={`${clubName} logo`}
                  aspectRatio={content.logo_crop === "center" ? "4:3" : "1:1"}
                  fit={content.logo_fit_mode as "cover" | "contain"}
                  rounded={content.logo_style !== "square"}
                  src={content.logo_url}
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--denim-500)] to-[var(--denim-800)] text-sm font-bold text-white">
                AI
              </div>
            )}

            <div className="flex min-w-0 flex-col">
              <span className="font-semibold text-sm md:text-base text-blue-700 truncate max-w-[280px] md:max-w-[400px] lg:max-w-[500px]">
                {clubName}
              </span>
              <span className="text-[10px] md:text-xs text-gray-500 truncate max-w-[280px] md:max-w-[400px] lg:max-w-[500px]">
                {subtitle}
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {primaryNavItems.map((item) => (
            <NavLink
              active={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
              href={item.href}
              key={item.href}
              title={item.title}
            />
          ))}

          <div
            className="relative shrink-0"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              className={cn(
                "inline-flex shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-[var(--denim-50)] hover:text-[var(--denim-700)]",
                moreActive && "bg-[var(--denim-50)] text-[var(--denim-800)]"
              )}
              onClick={() => setMoreOpen((value) => !value)}
              type="button"
            >
              More
              <ChevronDown className={cn("ml-1 h-4 w-4 transition", moreOpen && "rotate-180")} />
            </button>

            <div
              className={cn(
                "absolute left-1/2 top-full z-50 mt-3 w-56 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-xl backdrop-blur",
                moreOpen ? "block" : "hidden"
              )}
            >
              {moreNavItems.map((item) => (
                <Link
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[var(--denim-50)] hover:text-[var(--denim-700)]",
                    pathname.startsWith(item.href) && "bg-[var(--denim-50)] text-[var(--denim-800)]"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="hidden shrink-0 items-center justify-end gap-2 xl:flex">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link href="/admin">
                  <Button size="sm" variant="outline">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/dashboard/research">
                <Button size="sm" variant="outline">
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button size="sm">Profile</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Join Community</Button>
              </Link>
            </>
          )}
        </div>

        <div className="shrink-0 xl:hidden">
          <Button
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((value) => !value)}
            size="icon"
            variant="outline"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className={cn("border-t border-slate-200 bg-white/95 xl:hidden", mobileOpen ? "block" : "hidden")}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-8 lg:px-16">
          <div className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">Main Menu</p>
            {primaryNavItems.map((item) => (
              <Link
                className={cn(
                  "block whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[var(--denim-50)] hover:text-[var(--denim-700)]",
                  pathname.startsWith(item.href) && "bg-[var(--denim-50)] text-[var(--denim-800)]"
                )}
                href={item.href}
                key={item.href}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">More</p>
            {moreNavItems.map((item) => (
              <Link
                className={cn(
                  "block whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[var(--denim-50)] hover:text-[var(--denim-700)]",
                  pathname.startsWith(item.href) && "bg-[var(--denim-50)] text-[var(--denim-800)]"
                )}
                href={item.href}
                key={item.href}
              >
                {item.title}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link href="/admin">
                    <Button className="w-full" variant="outline">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard/research">
                  <Button className="w-full" variant="outline">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button className="w-full">Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button className="w-full" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full">Join Community</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
