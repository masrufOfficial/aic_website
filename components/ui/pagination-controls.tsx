"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaginationControls({
  currentPage,
  pageCount,
}: {
  currentPage: number;
  pageCount: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pageCount <= 1) {
    return null;
  }

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());

    if (page <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
      <Link href={buildHref(currentPage - 1)}>
        <Button disabled={currentPage <= 1} variant="outline">
          Previous
        </Button>
      </Link>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
        <Link href={buildHref(page)} key={page}>
          <span
            className={cn(
              "inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition",
              page === currentPage
                ? "border-[var(--denim-600)] bg-[var(--denim-600)] text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-[var(--denim-50)]"
            )}
          >
            {page}
          </span>
        </Link>
      ))}
      <Link href={buildHref(currentPage + 1)}>
        <Button disabled={currentPage >= pageCount} variant="outline">
          Next
        </Button>
      </Link>
    </div>
  );
}
