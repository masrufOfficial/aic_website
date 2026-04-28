import Link from "next/link";
import { ArrowRight, CalendarRange, FileText, ImagePlus, LibraryBig, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminPage();

  const [userCount, eventCount, pendingMemberships, pendingResearch, contentCount] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.membership.count({ where: { status: "pending" } }),
    prisma.research.count({ where: { status: "pending" } }),
    prisma.content.count(),
  ]);

  const quickActions = [
    {
      href: "/admin/content",
      title: "Update website content",
      description: "Edit logo, hero text, about copy, and vision or mission content.",
      icon: FileText,
    },
    {
      href: "/admin/events",
      title: "Manage events",
      description: "Create, edit, and delete events that appear across the public site.",
      icon: CalendarRange,
    },
    {
      href: "/admin/research",
      title: "Review research",
      description: "Approve or reject student submissions before they appear in the publication showcase.",
      icon: LibraryBig,
    },
    {
      href: "/admin/gallery",
      title: "Curate the gallery",
      description: "Attach gallery images to events and keep the homepage visuals fresh.",
      icon: ImagePlus,
    },
    {
      href: "/admin/members",
      title: "Review members",
      description: "Approve memberships, change roles, and maintain member status.",
      icon: UsersRound,
    },
  ];

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="Dashboard"
        title="Admin Control System"
        description="A central place for content, members, events, gallery assets, and committee management."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Users", value: userCount },
          { label: "Total Events", value: eventCount },
          { label: "Pending Memberships", value: pendingMemberships },
          { label: "Pending Research", value: pendingResearch },
          { label: "Managed Content Keys", value: contentCount },
        ].map((item) => (
          <Card className="border-slate-200/80 bg-white/85" key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{item.value}</p>
          </Card>
        ))}
      </div>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Quick Actions"
          title="Jump into the areas that change the site fastest"
          description="Everything here is database-backed, so updates persist and show on the frontend immediately after refresh."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card className="border-slate-200/80 bg-white/85" key={action.href}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--denim-50)] text-[var(--denim-700)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-950">{action.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
                    </div>
                  </div>
                  <Link href={action.href}>
                    <Button variant="outline">
                      Open
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
