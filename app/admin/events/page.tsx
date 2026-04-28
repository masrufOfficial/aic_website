import { EventManager } from "@/components/admin/event-manager";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdminPage();

  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });

  return (
    <div className="w-full px-6 md:px-10 lg:px-12 py-10 space-y-10">
      
      {/* HEADER */}
      <SectionHeading
        eyebrow="Events"
        title="Create, update, and remove public events"
        description="Every event change is saved to the database and reused across the explore pages and profile registrations."
      />

      {/* MAIN CONTENT */}
      <div className="w-full">
        <EventManager events={events} />
      </div>

    </div>
  );
}