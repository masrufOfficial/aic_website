import Link from "next/link";

import { ResearchSubmitForm } from "@/components/research/research-submit-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getResearchStatusLabel, getResearchStatusVariant } from "@/lib/research";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardResearchPage() {
  const user = await requireUser();

  const submissions = await prisma.research.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 md:px-8 md:py-16 lg:px-16">
      <SectionHeading
        eyebrow="Research Dashboard"
        title="Submit and track your publications"
        description="Create a polished research submission with media, links, and full publication content, then monitor its approval status."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200/80 bg-white/85">
          <p className="text-sm text-slate-500">Total submissions</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">{submissions.length}</p>
        </Card>
        <Card className="border-slate-200/80 bg-white/85">
          <p className="text-sm text-slate-500">Approved</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">
            {submissions.filter((item) => item.status === "approved").length}
          </p>
        </Card>
        <Card className="border-slate-200/80 bg-white/85">
          <p className="text-sm text-slate-500">Pending review</p>
          <p className="mt-3 text-4xl font-semibold text-slate-950">
            {submissions.filter((item) => item.status === "pending").length}
          </p>
        </Card>
      </div>

      <ResearchSubmitForm />

      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Your Submissions"
            title="Recent research activity"
            description="Each submission stays private until an admin approves it."
          />
          <Link href="/research">
            <Button variant="outline">View public research showcase</Button>
          </Link>
        </div>

        {submissions.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {submissions.map((item) => (
              <Card className="border-slate-200/80 bg-white/85" key={item.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                  <Badge variant={getResearchStatusVariant(item.status)}>{getResearchStatusLabel(item.status)}</Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge className="bg-[var(--denim-50)] text-[var(--denim-700)]" key={tag}>
                      #{tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-5 text-sm text-slate-500">Submitted on {formatDate(item.createdAt)}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-slate-300 bg-white/80">
            <p className="text-lg font-semibold text-slate-900">No research submitted yet.</p>
            <p className="mt-2 text-sm text-slate-600">Your first submission will appear here after you publish it for review.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
