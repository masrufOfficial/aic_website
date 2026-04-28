import { GalleryGrid } from "@/components/site/gallery-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getContentMap } from "@/lib/content";
import { getAspectRatioValue, getRoundedValue } from "@/lib/media";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [items, content] = await Promise.all([
    prisma.gallery.findMany({
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
    getContentMap(),
  ]);

  // ✅ GROUP IMAGES BY EVENT
  const groupedItems = Object.values(
    items.reduce((acc: any, item) => {
      if (!acc[item.event.id]) {
        acc[item.event.id] = {
          event: item.event,
          images: [],
        };
      }
      acc[item.event.id].images.push(item);
      return acc;
    }, {})
  );

  const imageRatio = getAspectRatioValue(content.image_ratio);
  const imageFit = content.image_fit === "contain" ? "contain" : "cover";
  const imageRounded = getRoundedValue(content.image_style);

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 md:px-8 md:py-16 lg:px-16">
      
      {/* HEADER */}
      <SectionHeading
        eyebrow="Gallery"
        title="A visual archive of BUBT AI community moments."
        description="Images are grouped by events and presented in a responsive grid."
      />

      {/* EVENT GROUPS */}
      <div className="space-y-16">
        {groupedItems.map((group: any) => (
          <div key={group.event.id}>
            
            {/* EVENT TITLE */}
            <h2 className="text-xl md:text-2xl font-semibold mb-6">
              {group.event.title}
            </h2>

            {/* REUSE YOUR EXISTING GRID */}
            <GalleryGrid
              items={group.images}
              imageFit={imageFit}
              imageRatio={imageRatio}
              imageRounded={imageRounded}
            />
          </div>
        ))}
      </div>

    </div>
  );
}