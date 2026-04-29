import type { Event } from "@prisma/client";

import { EventsSectionGrid } from "@/components/site/events-section-grid";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getContentMap } from "@/lib/content";
import { getAspectRatioValue, getRoundedValue } from "@/lib/media";
import { getExplorePageData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ExploreUsPage() {
  const [{ events, industrialVisits }, content] = await Promise.all([getExplorePageData(), getContentMap()]);
  const imageRatio = getAspectRatioValue(content.image_ratio);
  const imageFit = content.image_fit === "contain" ? "contain" : "cover";
  const imageRounded = getRoundedValue(content.image_style);

  const grouped = {
    national: events.filter((event: Event) => event.type === "national"),
    domestic: events.filter((event: Event) => event.type === "domestic"),
    collaborative: events.filter((event: Event) => event.type === "collaborative"),
  };

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 md:px-8 md:py-16 lg:px-16">
      <SectionHeading
        eyebrow="Explore Us"
        title="Discover events across national, domestic, and collaborative tracks."
        description="Community activities are categorized for easier exploration, with individual event pages and registration support built in."
      />

      {Object.entries(grouped).map(([label, items]) => (
        <section className="space-y-6" key={label}>
          <SectionHeading
            eyebrow={label}
            title={`${label.charAt(0).toUpperCase() + label.slice(1)} events`}
            description={`Upcoming ${label} experiences designed for learning, networking, and applied AI growth.`}
          />
          <EventsSectionGrid events={items as Event[]} imageFit={imageFit} imageRatio={imageRatio} imageRounded={imageRounded} />
        </section>
      ))}

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Industrial Visit"
          title="Industry exposure beyond the classroom"
          description="Use this dedicated area to highlight research lab visits, tech company tours, and partner collaborations."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {industrialVisits.map((visit: Event) => (
            <Card className="border-slate-200/80 bg-white/85" key={visit.id}>
              <h3 className="text-2xl font-semibold text-slate-950">{visit.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{visit.description}</p>
              <p className="mt-5 text-sm font-medium text-[var(--denim-700)]">{visit.location}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
