"use client";

import { Event } from "@prisma/client";
import { useMemo, useState } from "react";

import { EventCard } from "@/components/site/event-card";
import { Button } from "@/components/ui/button";
import { ITEMS_PER_PAGE, getPageCount, paginateItems } from "@/lib/pagination";

export function EventsSectionGrid({
  events,
  imageFit,
  imageRatio,
  imageRounded,
}: {
  events: Event[];
  imageFit: "cover" | "contain";
  imageRatio: "16:9" | "1:1" | "4:3";
  imageRounded: boolean;
}) {
  const [page, setPage] = useState(1);
  const pageCount = getPageCount(events.length, ITEMS_PER_PAGE);
  const paginated = useMemo(() => paginateItems(events, page, ITEMS_PER_PAGE), [events, page]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {paginated.map((event) => (
          <EventCard event={event} imageFit={imageFit} imageRatio={imageRatio} imageRounded={imageRounded} key={event.id} />
        ))}
      </div>
      {events.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-3">
          <Button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} type="button" variant="outline">
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {page} of {pageCount}
          </span>
          <Button disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} type="button" variant="outline">
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
