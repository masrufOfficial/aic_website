import { ResearchAdminManager } from "@/components/research/research-admin-manager";
import { SectionHeading } from "@/components/ui/section-heading";
import { requireAdminPage } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  await requireAdminPage();

  const research = await prisma.research.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10 px-6 py-10 md:px-10 lg:px-12">
      <SectionHeading
        eyebrow="Research Review"
        title="Moderate submissions before publication"
        description="Approve strong work, reject incomplete entries, and keep the public research archive curated."
      />

      <ResearchAdminManager items={research} />
    </div>
  );
}
