import Link from "next/link";
import { Event } from "@prisma/client";
import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageDisplay } from "@/components/ui/ImageDisplay";
import { formatDate, titleCase } from "@/lib/utils";

export function EventCard({
  event,
  imageRatio = "4:3",
  imageFit = "cover",
  imageRounded = true,
}: {
  event: Event;
  imageRatio?: "16:9" | "1:1" | "4:3";
  imageFit?: "cover" | "contain";
  imageRounded?: boolean;
}) {
  return (
    <Card className="group overflow-hidden border-slate-200/80 bg-white/90 p-0">
      <div className="p-2">
        <ImageDisplay
          alt={event.title}
          aspectRatio={imageRatio}
          className="transition duration-500 group-hover:scale-[1.01]"
          fit={imageFit}
          rounded={imageRounded}
          src={event.coverImage ?? "https://picsum.photos/1200/800"}
        />
      </div>
      <div className="p-5 md:p-6">
        <CardHeader className="p-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Badge>{titleCase(event.type)}</Badge>
            <span className="text-sm text-slate-500">{formatDate(event.date)}</span>
          </div>
          <CardTitle className="mt-4 text-xl md:text-2xl">{event.title}</CardTitle>
          <CardDescription>{event.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 pt-5">
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[var(--denim-500)]" />
              {formatDate(event.date)}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[var(--denim-500)]" />
              {event.location}
            </p>
          </div>
          <Link className="mt-5 inline-flex" href={`/explore-us/${event.id}`}>
            <Button variant="outline">View Details</Button>
          </Link>
        </CardContent>
      </div>
    </Card>
  );
}
