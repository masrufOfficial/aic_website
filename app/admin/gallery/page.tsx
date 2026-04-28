import { GalleryManager } from "@/components/admin/gallery-manager";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdminPage();

  const [images, events] = await Promise.all([
    prisma.gallery.findMany({
      include: { event: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.event.findMany({
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Gallery"
        title="Manage event-based gallery media"
        description="Assign images to events, remove outdated visuals, and keep the public gallery current."
      />
      <GalleryManager events={events} images={images} />
    </div>
  );
}
