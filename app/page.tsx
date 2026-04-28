import type { Committee, Event } from "@prisma/client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { CommitteeCard } from "@/components/site/committee-card";
import { EventCard } from "@/components/site/event-card";
import { GalleryGrid } from "@/components/site/gallery-grid";
import { Hero } from "@/components/site/hero";
import { StatsGrid } from "@/components/site/stats-grid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { getHomePageData } from "@/lib/queries";
import { getAspectRatioValue, getRoundedValue } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { featuredEvents, committee, gallery, stats, content } = await getHomePageData();
  const imageRatio = getAspectRatioValue(content.image_ratio);
  const imageFit = content.image_fit === "contain" ? "contain" : "cover";
  const imageRounded = getRoundedValue(content.image_style);

  return (
    <div className="pb-10 md:pb-16">
      <section className="bg-slate-950">
        <Hero
          badge={content.hero_badge}
          imageUrl={content.hero_image_url}
          imageFit={imageFit}
          imageRatio={imageRatio}
          imageRounded={imageRounded}
          subtitle={content.hero_subtitle}
          title={content.hero_title}
        />
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 md:px-8 md:py-16 lg:px-16">
        <StatsGrid stats={stats} />

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Explore Preview"
            title="See what the BUBT AI community is building next."
            description="From national showcases to hands-on domestic sessions, members can browse upcoming opportunities and register directly."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredEvents.map((event: Event) => (
              <EventCard imageFit={imageFit} imageRatio={imageRatio} imageRounded={imageRounded} key={event.id} event={event} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200/80 bg-white/85">
            <SectionHeading
              eyebrow="Highlights"
              title="A modern platform that supports the whole community lifecycle."
              description="Built around real student workflows: event promotion, membership review, gallery publishing, and profile activity history."
            />
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                "Role-based authentication and protected dashboards",
                "Membership approval and status verification",
                "Event registration with categorized discoverability",
                "Gallery management with social-style layouts",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-3xl bg-[var(--denim-50)] p-5">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-[var(--denim-600)]" />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-slate-200/80 bg-gradient-to-br from-[var(--denim-900)] to-slate-950 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--denim-200)]">Vision & Mission</p>
            <h2 className="mt-4 text-3xl font-semibold">Community strategy and direction</h2>
            <p className="mt-5 text-sm leading-7 text-slate-200">{content.vision_mission}</p>
            <Link href="/about-us" className="mt-8 inline-flex">
              <Button variant="secondary">
                Learn About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Committee"
            title="Current leaders guiding the community."
            description="Present committee members can be managed from the admin panel and displayed in polished profile cards."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {committee.map((member: Committee) => (
              <CommitteeCard imageFit={imageFit} imageRatio={imageRatio} imageRounded={imageRounded} key={member.id} member={member} />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments from workshops, showcases, and industry visits."
            description="Event-based gallery content is arranged in a social-inspired grid with lightbox previews."
          />
          <GalleryGrid imageFit={imageFit} imageRatio={imageRatio} imageRounded={imageRounded} items={gallery} />
        </section>
      </div>
    </div>
  );
}
