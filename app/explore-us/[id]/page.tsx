import type { Gallery } from "@prisma/client";

import { notFound } from "next/navigation";

import { EventRegistrationButton } from "@/components/site/event-registration-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ImageDisplay } from "@/components/ui/ImageDisplay";
import { getContentMap } from "@/lib/content";
import { getAspectRatioValue, getRoundedValue } from "@/lib/media";
import { formatDate, titleCase } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, content] = await Promise.all([
    prisma.event.findUnique({
      where: { id },
      include: {
        galleryItems: true,
      },
    }),
    getContentMap(),
  ]);

  if (!event) {
    notFound();
  }
  const imageRatio = getAspectRatioValue(content.image_ratio);
  const imageFit = content.image_fit === "contain" ? "contain" : "cover";
  const imageRounded = getRoundedValue(content.image_style);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 md:px-8 md:py-16 lg:px-16">
      <ImageDisplay
        alt={event.title}
        aspectRatio={imageRatio}
        className="border border-white/10 shadow-2xl"
        fit={imageFit}
        rounded={imageRounded}
        src={event.coverImage ?? "https://picsum.photos/1200/800"}
      >
        <div className="flex h-full flex-col justify-end bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-6 md:p-8">
          <Badge>{titleCase(event.type)}</Badge>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200">{event.description}</p>
        </div>
      </ImageDisplay>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="border-slate-200/80 bg-white/85">
          <h2 className="text-2xl font-semibold text-slate-950">Event details</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              <span className="font-semibold text-slate-900">Date:</span> {formatDate(event.date)}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Location:</span> {event.location}
            </p>
            <p>
              <span className="font-semibold text-slate-900">Registration Link:</span>{" "}
              {event.registrationLink ? (
                <a className="text-[var(--denim-700)] underline" href={event.registrationLink} target="_blank">
                  Open external registration
                </a>
              ) : (
                "Use the internal registration button"
              )}
            </p>
          </div>
        </Card>

        <Card className="border-slate-200/80 bg-white/85">
          <h2 className="text-xl font-semibold text-slate-950">Reserve your spot</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Logged-in members can register directly from the platform.</p>
          <div className="mt-6">
            <EventRegistrationButton eventId={event.id} />
          </div>
        </Card>
      </div>

      {event.galleryItems.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {event.galleryItems.map((image: Gallery) => (
            <ImageDisplay alt={image.caption ?? event.title} aspectRatio={imageRatio} fit={imageFit} key={image.id} rounded={imageRounded} src={image.imageUrl} />
          ))}
        </div>
      )}
    </div>
  );
}
