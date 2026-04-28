import { ResearchGrid } from "@/components/research/research-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const research = await prisma.research.findMany({
    where: { status: "approved" },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="page-shell space-y-10">
      <SectionHeading
        eyebrow="Publications"
        title="Research, projects, and student-led innovation"
        description="Explore approved publications from the community. Public visitors can browse cards, while active members unlock the full research details."
      />

      <ResearchGrid items={research} />
    </div>
  );
}
