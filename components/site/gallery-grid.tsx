"use client";

import { useState } from "react";
import { Gallery, Event } from "@prisma/client";
import { X } from "lucide-react";

import { ImageDisplay } from "@/components/ui/ImageDisplay";

type GalleryItem = Gallery & {
  event: Event;
};

export function GalleryGrid({
  items,
  imageRatio = "1:1",
  imageFit = "cover",
  imageRounded = true,
}: {
  items: GalleryItem[];
  imageRatio?: "16:9" | "1:1" | "4:3";
  imageFit?: "cover" | "contain";
  imageRounded?: boolean;
}) {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            className="group relative cursor-pointer text-left"
            onClick={() => setSelected(item)}
            type="button"
          >
            <ImageDisplay
              alt={item.caption ?? item.event.title}
              aspectRatio={imageRatio}
              className="border border-slate-200 shadow-sm transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
              fit={imageFit}
              rounded={imageRounded}
              src={item.imageUrl}
            >
              <div className="flex h-full flex-col justify-end bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent p-4">
                <p className="text-sm font-semibold text-white">{item.event.title}</p>
                <p className="text-xs text-slate-200">{item.caption}</p>
              </div>
            </ImageDisplay>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <button
              className="absolute right-4 top-4 z-10 cursor-pointer rounded-full bg-slate-950/70 p-2 text-white transition hover:scale-105"
              onClick={() => setSelected(null)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid md:grid-cols-[1fr_320px]">
              <div className="p-3">
                <ImageDisplay
                  alt={selected.caption ?? selected.event.title}
                  aspectRatio="4:3"
                  fit="contain"
                  rounded={true}
                  src={selected.imageUrl}
                />
              </div>
              <div className="space-y-4 p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--denim-600)]">Gallery Preview</p>
                <h3 className="text-2xl font-semibold text-slate-950">{selected.event.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{selected.caption ?? "Captured from the BUBT AI community event archive."}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
